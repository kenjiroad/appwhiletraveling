import ActivityKit
import Foundation

/// Shared with the widget extension (`app/targets/sleep/SleepLiveActivity.swift`): ActivityKit matches
/// the two by name, so both copies must stay identical.
struct DeboutSleepAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    /// When the alarm rings.
    var alarmDate: Date
    /// When you said good night: the start of the progress bar.
    var bedtimeDate: Date
  }

  /// What stops the alarm, e.g. "15 pompes".
  var challenge: String
}

enum SleepActivityController {
  static var isEnabled: Bool {
    ActivityAuthorizationInfo().areActivitiesEnabled
  }

  /// Replaces any running sleep activity. Returns false if the user turned Live Activities off.
  static func start(alarm: Date, challenge: String) throws -> Bool {
    guard isEnabled, alarm > Date() else { return false }
    endAll()
    let state = DeboutSleepAttributes.ContentState(alarmDate: alarm, bedtimeDate: Date())
    // Stale from the alarm time on: the lock screen then switches to "Debout !".
    let content = ActivityContent(state: state, staleDate: alarm)
    _ = try Activity.request(attributes: DeboutSleepAttributes(challenge: challenge), content: content, pushType: nil)
    return true
  }

  static func endAll() {
    for activity in Activity<DeboutSleepAttributes>.activities {
      Task { await activity.end(nil, dismissalPolicy: .immediate) }
    }
  }
}
