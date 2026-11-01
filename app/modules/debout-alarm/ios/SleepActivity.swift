import ActivityKit
import Foundation

/// Shared with the widget extension (`app/targets/sleep/SleepLiveActivity.swift`): ActivityKit matches
/// the two by name, so both copies must stay identical. Times are Unix seconds so the server can send
/// the same JSON in push updates.
struct DeboutSleepAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    /// When the alarm rings (Unix seconds).
    var alarmAt: Double
    /// When you said good night: the start of the night track (Unix seconds).
    var bedtimeAt: Double
    /// Where the marmot is on the night track, 0…1. Negative until a first update: the widget then places it
    /// where the night was when it drew the view.
    var progress: Double
  }

  /// What stops the alarm, e.g. "15 pompes".
  var challenge: String
}

enum SleepActivityController {
  static var isEnabled: Bool {
    ActivityAuthorizationInfo().areActivitiesEnabled
  }

  /// Replaces any running sleep activity. With `withPush`, iOS gives a push token so the server can move
  /// the marmot during the night; `onToken` receives it (and any later renewal).
  static func start(alarm: Date, challenge: String, withPush: Bool, onToken: @escaping (String) -> Void) throws -> Bool {
    guard isEnabled, alarm > Date() else { return false }
    endAll()
    let state = DeboutSleepAttributes.ContentState(
      alarmAt: alarm.timeIntervalSince1970,
      bedtimeAt: Date().timeIntervalSince1970,
      progress: withPush ? 0 : -1
    )
    // Stale from the alarm time on: the lock screen then switches to "Debout !".
    let content = ActivityContent(state: state, staleDate: alarm)
    let activity = try Activity.request(
      attributes: DeboutSleepAttributes(challenge: challenge),
      content: content,
      pushType: withPush ? .token : nil
    )
    if withPush {
      Task {
        for await token in activity.pushTokenUpdates {
          onToken(token.map { String(format: "%02x", $0) }.joined())
        }
      }
    }
    return true
  }

  /// Moves the marmot to where the night is now: called when the app opens during the night.
  static func refreshProgress() {
    for activity in Activity<DeboutSleepAttributes>.activities {
      var state = activity.content.state
      let span = max(state.alarmAt - state.bedtimeAt, 1)
      state.progress = min(1, max(0, (Date().timeIntervalSince1970 - state.bedtimeAt) / span))
      let content = ActivityContent(state: state, staleDate: Date(timeIntervalSince1970: state.alarmAt))
      Task { await activity.update(content) }
    }
  }

  static func endAll() {
    for activity in Activity<DeboutSleepAttributes>.activities {
      Task { await activity.end(nil, dismissalPolicy: .immediate) }
    }
  }
}
