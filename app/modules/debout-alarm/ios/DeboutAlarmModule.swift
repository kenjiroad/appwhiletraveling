import ExpoModulesCore
import Foundation

#if canImport(AlarmKit)
import AlarmKit
import AppIntents
import SwiftUI
#endif

/// AlarmKit (iOS 26+) rings like the Clock app: full screen, even in silent mode or with a Focus on.
/// On older iOS versions every function is a no-op and JS falls back to notifications.
public final class DeboutAlarmModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DeboutAlarm")

    Function("isSupported") { () -> Bool in
      #if canImport(AlarmKit)
      if #available(iOS 26.0, *) { return true }
      #endif
      return false
    }

    AsyncFunction("requestAuthorizationAsync") { () async throws -> Bool in
      #if canImport(AlarmKit)
      if #available(iOS 26.0, *) { return try await DeboutAlarmScheduler.requestAuthorization() }
      #endif
      return false
    }

    Function("isAuthorized") { () -> Bool in
      #if canImport(AlarmKit)
      if #available(iOS 26.0, *) { return AlarmManager.shared.authorizationState == .authorized }
      #endif
      return false
    }

    /// Replaces every planned alarm by one alarm per timestamp (milliseconds since 1970).
    AsyncFunction("scheduleAsync") { (timestamps: [Double], title: String) async throws in
      #if canImport(AlarmKit)
      if #available(iOS 26.0, *) { try await DeboutAlarmScheduler.schedule(timestamps: timestamps, title: title) }
      #endif
    }

    /// Cancels the planned alarms between two timestamps, e.g. the rest of today once the challenge is done.
    Function("cancelBetween") { (start: Double, end: Double) in
      #if canImport(AlarmKit)
      if #available(iOS 26.0, *) { DeboutAlarmScheduler.cancel { $0 >= start && $0 < end } }
      #endif
    }

    Function("cancelAll") {
      #if canImport(AlarmKit)
      if #available(iOS 26.0, *) { DeboutAlarmScheduler.cancelAll() }
      #endif
    }
  }
}

#if canImport(AlarmKit)
@available(iOS 26.0, *)
struct DeboutAlarmMetadata: AlarmMetadata {}

@available(iOS 26.0, *)
enum DeboutAlarmScheduler {
  /// AlarmKit only knows ids, so we remember when each of our alarms rings: [uuid: timestamp ms].
  private static let storeKey = "debout.alarms"

  private static var store: [String: Double] {
    get { UserDefaults.standard.dictionary(forKey: storeKey) as? [String: Double] ?? [:] }
    set { UserDefaults.standard.set(newValue, forKey: storeKey) }
  }

  // Dawn orange from the app theme (#FF7A45).
  private static let tint = Color(red: 1, green: 0.478, blue: 0.271)

  static func requestAuthorization() async throws -> Bool {
    let manager = AlarmManager.shared
    switch manager.authorizationState {
    case .authorized: return true
    case .denied: return false
    case .notDetermined: return try await manager.requestAuthorization() == .authorized
    @unknown default: return false
    }
  }

  static func schedule(timestamps: [Double], title: String) async throws {
    cancelAll()
    let manager = AlarmManager.shared
    guard manager.authorizationState == .authorized else { return }

    var planned: [String: Double] = [:]
    for timestamp in timestamps {
      let id = UUID()
      let alert = AlarmPresentation.Alert(
        title: LocalizedStringResource(stringLiteral: title),
        stopButton: AlarmButton(text: "Arrêter", textColor: .white, systemImageName: "xmark"),
        secondaryButton: AlarmButton(text: "Mes pompes", textColor: .white, systemImageName: "figure.strengthtraining.functional"),
        secondaryButtonBehavior: .custom
      )
      let attributes = AlarmAttributes<DeboutAlarmMetadata>(
        presentation: AlarmPresentation(alert: alert),
        tintColor: tint
      )
      let configuration = AlarmManager.AlarmConfiguration<DeboutAlarmMetadata>(
        schedule: .fixed(Date(timeIntervalSince1970: timestamp / 1000)),
        attributes: attributes,
        secondaryIntent: OpenChallengeIntent(alarmID: id.uuidString)
      )
      _ = try await manager.schedule(id: id, configuration: configuration)
      planned[id.uuidString] = timestamp
    }
    store = planned
  }

  static func cancel(where shouldCancel: (Double) -> Bool) {
    var planned = store
    for (key, timestamp) in planned where shouldCancel(timestamp) {
      if let id = UUID(uuidString: key) { try? AlarmManager.shared.cancel(id: id) }
      planned.removeValue(forKey: key)
    }
    store = planned
  }

  static func cancelAll() {
    // Also catches alarms left over from an older install whose ids we no longer have.
    for alarm in (try? AlarmManager.shared.alarms) ?? [] {
      try? AlarmManager.shared.cancel(id: alarm.id)
    }
    store = [:]
  }
}

/// The "Mes pompes" button: stops the ringing and opens the app, which shows the challenge
/// because an alarm is due and today's challenge isn't done yet (see `useAlarmResponse`).
@available(iOS 26.0, *)
struct OpenChallengeIntent: LiveActivityIntent {
  static let title: LocalizedStringResource = "Faire mes pompes"
  static let openAppWhenRun = true

  @Parameter(title: "Alarme")
  var alarmID: String

  init() {}

  init(alarmID: String) {
    self.alarmID = alarmID
  }

  func perform() async throws -> some IntentResult {
    if let id = UUID(uuidString: alarmID) {
      try? AlarmManager.shared.stop(id: id)
    }
    return .result()
  }
}
#endif
