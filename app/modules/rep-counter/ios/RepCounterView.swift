import AVFoundation
import CoreMedia
import ExpoModulesCore
import UIKit
import Vision

public final class RepCounterView: ExpoView, AVCaptureVideoDataOutputSampleBufferDelegate {
  let onRep = EventDispatcher()
  let onBodyVisibilityChange = EventDispatcher()

  private let session: AVCaptureSession
  private let previewLayer: AVCaptureVideoPreviewLayer
  // Session setup, frame analysis and the counter state all live on this queue.
  private let videoQueue = DispatchQueue(label: "fr.debout.repcounter.video")
  private let poseRequest = VNDetectHumanBodyPoseRequest()

  private var counter = RepStateMachine(exercise: .pushup)
  private var isConfigured = false
  private var lastAnalysisTime: CFTimeInterval = 0
  private var isBodyVisible = false

  // The raw camera image is sideways compared to the phone held upright. Vision finds people best
  // when they look "upright", so we try the possible orientations and keep the one that sees you
  // best: from the side you look lying down, from the front you look upright.
  private let orientations: [CGImagePropertyOrientation] = [.up, .right, .left]
  private var lockedOrientation: CGImagePropertyOrientation?
  private var framesWithoutBody = 0

  // Analysing ~12 frames per second is plenty to catch every rep and keeps the phone cool.
  private let minFrameInterval: CFTimeInterval = 1.0 / 12.0

  public required init(appContext: AppContext? = nil) {
    let session = AVCaptureSession()
    self.session = session
    previewLayer = AVCaptureVideoPreviewLayer(session: session)
    super.init(appContext: appContext)
    previewLayer.videoGravity = .resizeAspectFill
    layer.addSublayer(previewLayer)
    clipsToBounds = true
  }

  deinit {
    let session = self.session
    videoQueue.async {
      if session.isRunning { session.stopRunning() }
    }
  }

  override public func layoutSubviews() {
    super.layoutSubviews()
    previewLayer.frame = bounds
  }

  func setExercise(_ name: String) {
    let exercise = Exercise(rawValue: name) ?? .pushup
    videoQueue.async {
      self.counter = RepStateMachine(exercise: exercise)
    }
  }

  func setActive(_ active: Bool) {
    videoQueue.async {
      if active {
        if !self.isConfigured { self.configureSession() }
        if !self.session.isRunning { self.session.startRunning() }
      } else if self.session.isRunning {
        self.session.stopRunning()
      }
    }
  }

  private func configureSession() {
    session.beginConfiguration()
    defer { session.commitConfiguration() }

    if session.canSetSessionPreset(.vga640x480) {
      session.sessionPreset = .vga640x480
    }
    guard
      let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front),
      let input = try? AVCaptureDeviceInput(device: device),
      session.canAddInput(input)
    else { return }
    session.addInput(input)

    let output = AVCaptureVideoDataOutput()
    output.alwaysDiscardsLateVideoFrames = true
    output.setSampleBufferDelegate(self, queue: videoQueue)
    guard session.canAddOutput(output) else { return }
    session.addOutput(output)

    isConfigured = true
  }

  public func captureOutput(
    _ output: AVCaptureOutput,
    didOutput sampleBuffer: CMSampleBuffer,
    from connection: AVCaptureConnection
  ) {
    let now = CACurrentMediaTime()
    guard now - lastAnalysisTime >= minFrameInterval,
          let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer)
    else { return }
    lastAnalysisTime = now

    let width = CGFloat(CVPixelBufferGetWidth(pixelBuffer))
    let height = CGFloat(CVPixelBufferGetHeight(pixelBuffer))

    var best: (observation: VNHumanBodyPoseObservation, orientation: CGImagePropertyOrientation, quality: Float)?
    for orientation in lockedOrientation.map({ [$0] }) ?? orientations {
      let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: orientation, options: [:])
      try? handler.perform([poseRequest])
      guard let observation = poseRequest.results?.first else { continue }
      let quality = Exercise.quality(of: observation)
      if best == nil || quality > best!.quality {
        best = (observation, orientation, quality)
      }
    }

    var sample = PoseSample()
    if let best {
      // Vision returns points in the rotated image: portrait for .left / .right.
      let rotated = best.orientation == .left || best.orientation == .right
      let aspectRatio = rotated ? height / width : width / height
      sample = counter.exercise.sample(from: best.observation, aspectRatio: aspectRatio)
      if lockedOrientation == nil, best.quality > 0.5, sample.isBodyVisible {
        lockedOrientation = best.orientation
      }
    }

    // Lost you for ~2 seconds (you moved the phone?): look in every orientation again.
    framesWithoutBody = sample.isBodyVisible ? 0 : framesWithoutBody + 1
    if framesWithoutBody > 24 { lockedOrientation = nil }

    let visible = sample.isBodyVisible
    if visible != isBodyVisible {
      isBodyVisible = visible
      DispatchQueue.main.async { self.onBodyVisibilityChange(["visible": visible]) }
    }

    if counter.process(sample, at: now) {
      let count = counter.count
      DispatchQueue.main.async { self.onRep(["count": count]) }
    }
  }
}
