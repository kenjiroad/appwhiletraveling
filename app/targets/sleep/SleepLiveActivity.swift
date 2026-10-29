import ActivityKit
import SwiftUI
import WidgetKit

/// Same struct as `app/modules/debout-alarm/ios/SleepActivity.swift`: ActivityKit matches them by name.
struct DeboutSleepAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var alarmDate: Date
    var bedtimeDate: Date
  }

  var challenge: String
}

@main
struct DeboutWidgets: WidgetBundle {
  var body: some Widget {
    SleepLiveActivity()
  }
}

// "Aube" colors from the app theme.
private enum Aube {
  static let night = Color(red: 0.04, green: 0.04, blue: 0.10)
  static let text = Color(red: 0.96, green: 0.95, blue: 0.92)
  static let muted = Color(red: 0.96, green: 0.95, blue: 0.92).opacity(0.6)
  static let gold = Color(red: 1.0, green: 0.77, blue: 0.42)
  static let sun = Color(red: 1.0, green: 0.48, blue: 0.27)
}

struct SleepLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: DeboutSleepAttributes.self) { context in
      SleepLockScreenView(context: context)
        .activityBackgroundTint(Aube.night)
        .activitySystemActionForegroundColor(Aube.text)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          Marmot(awake: context.isStale).frame(width: 54, height: 54)
        }
        DynamicIslandExpandedRegion(.trailing) {
          if context.isStale {
            Text("Debout !").font(.system(.title3, design: .serif).italic()).foregroundStyle(Aube.gold)
          } else {
            Countdown(to: context.state.alarmDate)
              .font(.system(.title3, design: .rounded).weight(.semibold))
              .foregroundStyle(Aube.gold)
          }
        }
        DynamicIslandExpandedRegion(.bottom) {
          if context.isStale {
            Text("\(context.attributes.challenge) pour arrêter le réveil").font(.subheadline).foregroundStyle(Aube.muted)
          } else {
            SleepProgress(state: context.state)
          }
        }
      } compactLeading: {
        Marmot(awake: context.isStale).frame(width: 24, height: 24)
      } compactTrailing: {
        if context.isStale {
          Text("☀︎").foregroundStyle(Aube.gold)
        } else {
          Countdown(to: context.state.alarmDate).frame(maxWidth: 56).foregroundStyle(Aube.gold)
        }
      } minimal: {
        Marmot(awake: context.isStale).frame(width: 22, height: 22)
      }
      .keylineTint(Aube.sun)
    }
  }
}

struct SleepLockScreenView: View {
  let context: ActivityViewContext<DeboutSleepAttributes>

  var body: some View {
    HStack(spacing: 14) {
      Marmot(awake: context.isStale).frame(width: 64, height: 64)

      VStack(alignment: .leading, spacing: 6) {
        if context.isStale {
          Text("Debout !")
            .font(.system(size: 26, design: .serif).italic())
            .foregroundStyle(Aube.text)
          Text("\(context.attributes.challenge) pour arrêter le réveil")
            .font(.subheadline)
            .foregroundStyle(Aube.muted)
        } else {
          HStack(alignment: .firstTextBaseline, spacing: 4) {
            Text("Réveil à").font(.subheadline).foregroundStyle(Aube.muted)
            Text(context.state.alarmDate, style: .time)
              .font(.system(size: 22, design: .serif).italic())
              .foregroundStyle(Aube.text)
          }
          HStack(spacing: 4) {
            Text("Encore").foregroundStyle(Aube.muted)
            Countdown(to: context.state.alarmDate).foregroundStyle(Aube.gold).fontWeight(.semibold)
            Text("de sommeil").foregroundStyle(Aube.muted)
          }
          .font(.subheadline)
          SleepProgress(state: context.state)
        }
      }
    }
    .padding(16)
  }
}

/// The night filling up until the alarm, updated live by the system.
struct SleepProgress: View {
  let state: DeboutSleepAttributes.ContentState

  var body: some View {
    let start = min(state.bedtimeDate, state.alarmDate)
    ProgressView(timerInterval: start...state.alarmDate, countsDown: false) {
      EmptyView()
    } currentValueLabel: {
      EmptyView()
    }
    .tint(Aube.gold)
  }
}

/// Hours left before the alarm, ticking live on the lock screen.
struct Countdown: View {
  let to: Date

  var body: some View {
    Text(timerInterval: Date.now...max(to, Date.now), countsDown: true)
      .monospacedDigit()
      .multilineTextAlignment(.leading)
  }
}

struct Marmot: View {
  let awake: Bool

  var body: some View {
    Image(awake ? "marmotte-reveil" : "marmotte-dort")
      .resizable()
      .scaledToFit()
  }
}
