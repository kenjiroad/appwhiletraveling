import CoreGraphics
import QuartzCore
import Vision

/// What one camera frame tells us about the body. Two independent signals so a rep counts whether
/// the phone films you from the side (joint angle) or from the front (the body moving down and up).
struct PoseSample {
  /// Elbow (push-ups) or knee (squats) angle, in degrees. Reliable from the side.
  var angle: Double?
  /// Height of the shoulders (push-ups) or hips (squats) in the image, 0 = bottom, 1 = top.
  var height: Double?
  /// Body size in the image (upper arm or torso length), so "how far it moved" doesn't depend on
  /// how close you are to the phone.
  var scale: Double?
  /// The part that must move during a rep: shoulders (push-ups) or hips (squats).
  var mover: CGPoint?
  /// The parts that must stay still, each on its own: left and right hand on the floor (push-ups) or
  /// left and right foot (squats). If they move as much as the mover, it wasn't a rep: you stood up or
  /// just waved an arm. (Averaging both hands jumped whenever Vision lost one of them for a frame,
  /// which looked like a big move and rejected every rep.)
  var anchors: [CGPoint?] = []

  var isBodyVisible: Bool { angle != nil || height != nil }
}

enum Exercise: String {
  case pushup
  case squat

  typealias Joint = VNHumanBodyPoseObservation.JointName

  // The angle we track: the elbow for push-ups, the knee for squats. Both sides are
  // checked and the one Vision is most confident about wins.
  var jointTriples: [(Joint, Joint, Joint)] {
    switch self {
    case .pushup:
      return [(.leftShoulder, .leftElbow, .leftWrist), (.rightShoulder, .rightElbow, .rightWrist)]
    case .squat:
      return [(.leftHip, .leftKnee, .leftAnkle), (.rightHip, .rightKnee, .rightAnkle)]
    }
  }

  // Below this angle the rep counts as "down", above `upAngle` it counts as "up" again.
  // The gap between the two avoids counting the jitter around a single threshold.
  var downAngle: Double { self == .pushup ? 100 : 110 }
  var upAngle: Double { self == .pushup ? 150 : 155 }

  /// How far the shoulders / hips must travel, as a fraction of `PoseSample.scale`, for a rep.
  var verticalTravel: Double { self == .pushup ? 0.6 : 0.4 }

  /// Minimum travel of the mover over a whole rep (fraction of `scale`), checked before counting it.
  var minMoverTravel: Double { self == .pushup ? 0.35 : 0.25 }

  private static let minConfidence: Float = 0.3

  /// - Parameter aspectRatio: image width / height, because Vision points are normalized
  ///   separately on each axis and distances would otherwise be distorted.
  func sample(from observation: VNHumanBodyPoseObservation, aspectRatio: CGFloat) -> PoseSample {
    guard let points = try? observation.recognizedPoints(.all) else { return PoseSample() }

    func point(_ joint: Joint) -> CGPoint? {
      guard let p = points[joint], p.confidence > Self.minConfidence else { return nil }
      return CGPoint(x: p.location.x * aspectRatio, y: p.location.y)
    }
    func mean(_ joints: [Joint]) -> CGPoint? {
      let found = joints.compactMap(point)
      guard !found.isEmpty else { return nil }
      return CGPoint(
        x: found.map(\.x).reduce(0, +) / CGFloat(found.count),
        y: found.map(\.y).reduce(0, +) / CGFloat(found.count)
      )
    }

    var sample = PoseSample()

    var best: (angle: Double, confidence: Float)?
    for (a, b, c) in jointTriples {
      guard let pa = points[a], let pb = points[b], let pc = points[c] else { continue }
      let confidence = min(pa.confidence, pb.confidence, pc.confidence)
      guard confidence > Self.minConfidence else { continue }

      let angle = Self.angle(
        CGPoint(x: pa.location.x * aspectRatio, y: pa.location.y),
        CGPoint(x: pb.location.x * aspectRatio, y: pb.location.y),
        CGPoint(x: pc.location.x * aspectRatio, y: pc.location.y)
      )
      if best == nil || confidence > best!.confidence {
        best = (angle, confidence)
      }
    }
    sample.angle = best?.angle

    switch self {
    case .pushup:
      sample.mover = mean([.leftShoulder, .rightShoulder])
      sample.anchors = [point(.leftWrist), point(.rightWrist)]
      sample.height = mean([.leftShoulder, .rightShoulder]).map { Double($0.y) }
      let arms: [(Joint, Joint)] = [(.leftShoulder, .leftElbow), (.rightShoulder, .rightElbow)]
      let upperArms = arms.compactMap { pair -> Double? in
        guard let ps = point(pair.0), let pe = point(pair.1) else { return nil }
        return Double(hypot(ps.x - pe.x, ps.y - pe.y))
      }
      sample.scale = upperArms.max()
    case .squat:
      let hips = mean([.leftHip, .rightHip])
      sample.mover = hips
      sample.anchors = [point(.leftAnkle), point(.rightAnkle)]
      sample.height = hips.map { Double($0.y) }
      if let hips, let shoulders = mean([.leftShoulder, .rightShoulder]) {
        sample.scale = Double(hypot(shoulders.x - hips.x, shoulders.y - hips.y))
      }
    }
    if sample.scale == nil { sample.height = nil }
    return sample
  }

  /// Average confidence of the detected joints: used to pick the image orientation that sees you best.
  static func quality(of observation: VNHumanBodyPoseObservation) -> Float {
    guard let points = try? observation.recognizedPoints(.all) else { return 0 }
    let confidences = points.values.map(\.confidence).filter { $0 > 0 }
    guard !confidences.isEmpty else { return 0 }
    return confidences.reduce(0, +) / Float(confidences.count)
  }

  /// Angle at `b` between the segments b→a and b→c, in degrees.
  static func angle(_ a: CGPoint, _ b: CGPoint, _ c: CGPoint) -> Double {
    let v1 = CGVector(dx: a.x - b.x, dy: a.y - b.y)
    let v2 = CGVector(dx: c.x - b.x, dy: c.y - b.y)
    let magnitude = hypot(v1.dx, v1.dy) * hypot(v2.dx, v2.dy)
    guard magnitude > 0 else { return 180 }
    let cosine = max(-1, min(1, (v1.dx * v2.dx + v1.dy * v2.dy) / magnitude))
    return Double(acos(cosine)) * 180 / .pi
  }
}

/// Side view: counts a rep when the joint angle goes below `downAngle` then back above `upAngle`.
struct AngleRepMachine {
  let exercise: Exercise
  private var isDown = false
  private var smoothedAngle: Double?

  init(exercise: Exercise) {
    self.exercise = exercise
  }

  mutating func process(angle: Double) -> Bool {
    let smoothed = smoothedAngle.map { $0 * 0.6 + angle * 0.4 } ?? angle
    smoothedAngle = smoothed

    if !isDown && smoothed < exercise.downAngle {
      isDown = true
    } else if isDown && smoothed > exercise.upAngle {
      isDown = false
      return true
    }
    return false
  }
}

/// Front view: counts a rep when the shoulders (or hips) drop by `travel × scale` and come back up.
struct VerticalRepMachine {
  let travel: Double
  private var isDown = false
  private var top: Double?
  private var bottom = 0.0
  private var smoothedHeight: Double?
  private var smoothedScale: Double?

  init(travel: Double) {
    self.travel = travel
  }

  mutating func process(height: Double, scale: Double) -> Bool {
    let h = smoothedHeight.map { $0 * 0.6 + height * 0.4 } ?? height
    let s = smoothedScale.map { $0 * 0.8 + scale * 0.2 } ?? scale
    smoothedHeight = h
    smoothedScale = s
    let threshold = travel * s

    if !isDown {
      // The "up" position follows you if you shift, but slowly enough that a real rep stands out.
      let current = max(h, (top ?? h) - 0.002)
      top = current
      if current - h > threshold {
        isDown = true
        bottom = h
      }
    } else {
      bottom = min(bottom, h)
      if h - bottom > threshold {
        isDown = false
        top = h
        return true
      }
    }
    return false
  }
}

/// Combines both signals. When both catch the same rep, it only counts once. Before counting, checks
/// that it was a real rep: the shoulders (or hips) travelled, while the hands (or feet) stayed put.
struct RepStateMachine {
  let exercise: Exercise
  private(set) var count = 0
  private var angleMachine: AngleRepMachine
  private var verticalMachine: VerticalRepMachine
  private var lastRepTime: CFTimeInterval = -10
  /// The last frames (about 2.5 s at 12 fps): long enough for a slow rep, short enough to forget you
  /// walking to your spot before the first one.
  private var window: [PoseSample] = []
  private let maxWindow = 30

  /// Two reps closer than this are the same rep seen by both signals.
  private let minRepInterval: CFTimeInterval = 0.7

  init(exercise: Exercise) {
    self.exercise = exercise
    angleMachine = AngleRepMachine(exercise: exercise)
    verticalMachine = VerticalRepMachine(travel: exercise.verticalTravel)
  }

  /// Feeds one frame. Returns true when it completes a rep (down then back up).
  mutating func process(_ sample: PoseSample, at time: CFTimeInterval) -> Bool {
    if sample.isBodyVisible {
      window.append(sample)
      if window.count > maxWindow { window.removeFirst(window.count - maxWindow) }
    }

    var completed = false
    if let angle = sample.angle, angleMachine.process(angle: angle) { completed = true }
    if let height = sample.height, let scale = sample.scale, scale > 0,
       verticalMachine.process(height: height, scale: scale) {
      completed = true
    }
    guard completed, time - lastRepTime > minRepInterval else { return false }

    let genuine = isGenuineRep(window)
    window.removeAll()
    guard genuine else { return false }
    lastRepTime = time
    count += 1
    return true
  }

  /// The phone itself moved (picked up, pushed, shaken): everything in the image slid, so the half-done
  /// rep is forgotten instead of counted.
  mutating func phoneMoved() {
    angleMachine = AngleRepMachine(exercise: exercise)
    verticalMachine = VerticalRepMachine(travel: exercise.verticalTravel)
    window.removeAll()
  }

  /// Real rep: the mover travelled far enough, and the hands (or feet) stayed much stiller than the mover.
  private func isGenuineRep(_ frames: [PoseSample]) -> Bool {
    let movers = frames.compactMap(\.mover)
    let scales = frames.compactMap(\.scale).sorted()
    guard movers.count >= 4, !scales.isEmpty else { return false }
    let scale = scales[scales.count / 2]
    guard scale > 0 else { return false }

    let moverTravel = Self.extent(movers, trim: 0)
    guard moverTravel >= exercise.minMoverTravel * scale else { return false }

    // Each hand (or foot) seen in enough frames gives its own travel; the stillest one is the one on the floor.
    let anchorTravels = (0..<2).compactMap { side -> Double? in
      let points = frames.compactMap { $0.anchors.indices.contains(side) ? $0.anchors[side] : nil }
      guard Double(points.count) >= Double(frames.count) * 0.4 else { return nil }
      return Self.extent(points, trim: 0.15)
    }
    // Hands not seen well enough (often the case from the front): trust the rep. A moving phone is already
    // caught by the phone's motion sensors (see RepCounterView).
    guard let anchorTravel = anchorTravels.min() else { return true }
    return anchorTravel <= moverTravel * 0.6
  }

  /// Size of the box that contains the positions: how far a point moved over the window. `trim` ignores that
  /// share of the most extreme positions on each side, because Vision sometimes jumps for a single frame.
  private static func extent(_ points: [CGPoint], trim: Double) -> Double {
    guard !points.isEmpty else { return 0 }
    let xs = points.map(\.x).sorted()
    let ys = points.map(\.y).sorted()
    let cut = Int(Double(points.count) * trim)
    let low = cut
    let high = points.count - 1 - cut
    guard high > low else { return 0 }
    return Double(hypot(xs[high] - xs[low], ys[high] - ys[low]))
  }
}
