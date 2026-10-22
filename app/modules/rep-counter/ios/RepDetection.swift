import CoreGraphics
import Vision

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

  /// - Parameter aspectRatio: image width / height, because Vision points are normalized
  ///   separately on each axis and angles would otherwise be distorted.
  func jointAngle(in observation: VNHumanBodyPoseObservation, aspectRatio: CGFloat) -> Double? {
    guard let points = try? observation.recognizedPoints(.all) else { return nil }

    var best: (angle: Double, confidence: Float)?
    for (a, b, c) in jointTriples {
      guard let pa = points[a], let pb = points[b], let pc = points[c] else { continue }
      let confidence = min(pa.confidence, pb.confidence, pc.confidence)
      guard confidence > 0.3 else { continue }

      let angle = Self.angle(
        CGPoint(x: pa.location.x * aspectRatio, y: pa.location.y),
        CGPoint(x: pb.location.x * aspectRatio, y: pb.location.y),
        CGPoint(x: pc.location.x * aspectRatio, y: pc.location.y)
      )
      if best == nil || confidence > best!.confidence {
        best = (angle, confidence)
      }
    }
    return best?.angle
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

struct RepStateMachine {
  let exercise: Exercise
  private(set) var count = 0
  private var isDown = false
  private var smoothedAngle: Double?

  init(exercise: Exercise) {
    self.exercise = exercise
  }

  /// Feeds one measured angle. Returns true when it completes a rep (down then back up).
  mutating func process(angle: Double) -> Bool {
    let smoothed = smoothedAngle.map { $0 * 0.6 + angle * 0.4 } ?? angle
    smoothedAngle = smoothed

    if !isDown && smoothed < exercise.downAngle {
      isDown = true
    } else if isDown && smoothed > exercise.upAngle {
      isDown = false
      count += 1
      return true
    }
    return false
  }
}
