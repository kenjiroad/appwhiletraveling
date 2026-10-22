import AVFoundation
import ExpoModulesCore

public final class RepCounterModule: Module {
  public func definition() -> ModuleDefinition {
    Name("RepCounter")

    AsyncFunction("requestCameraPermissionAsync") { (promise: Promise) in
      AVCaptureDevice.requestAccess(for: .video) { granted in
        promise.resolve(granted)
      }
    }

    View(RepCounterView.self) {
      Events("onRep", "onBodyVisibilityChange")

      Prop("exercise") { (view: RepCounterView, exercise: String) in
        view.setExercise(exercise)
      }

      Prop("active") { (view: RepCounterView, active: Bool) in
        view.setActive(active)
      }
    }
  }
}
