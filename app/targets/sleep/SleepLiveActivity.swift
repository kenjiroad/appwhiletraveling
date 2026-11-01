import ActivityKit
import SwiftUI
import WidgetKit

/// Same struct as `app/modules/debout-alarm/ios/SleepActivity.swift`: ActivityKit matches them by name.
struct DeboutSleepAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    var alarmAt: Double
    var bedtimeAt: Double
    var progress: Double
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
  static let muted = Color(red: 0.96, green: 0.95, blue: 0.92).opacity(0.55)
  static let track = Color.white.opacity(0.14)
  static let gold = Color(red: 1.0, green: 0.77, blue: 0.42)
  static let rose = Color(red: 1.0, green: 0.37, blue: 0.54)
  static let violet = Color(red: 0.42, green: 0.36, blue: 1.0)
}

private extension DeboutSleepAttributes.ContentState {
  var alarm: Date { Date(timeIntervalSince1970: alarmAt) }
  var bedtime: Date { Date(timeIntervalSince1970: min(bedtimeAt, alarmAt - 1)) }
}

struct SleepLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: DeboutSleepAttributes.self) { context in
      LockScreenView(context: context)
        .activityBackgroundTint(Aube.night)
        .activitySystemActionForegroundColor(Aube.text)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          HStack(spacing: 8) {
            Marmot(awake: context.isStale).frame(width: 36, height: 36)
            Text("Debout").font(.system(size: 15, weight: .semibold)).foregroundStyle(Aube.text)
          }
        }
        DynamicIslandExpandedRegion(.trailing) {
          if context.isStale {
            Text("Debout !").font(.system(size: 20, weight: .bold, design: .rounded)).foregroundStyle(Aube.gold)
          } else {
            Text(context.state.alarm, style: .relative)
              .font(.system(size: 20, weight: .bold, design: .rounded))
              .foregroundStyle(Aube.gold)
              .multilineTextAlignment(.trailing)
          }
        }
        DynamicIslandExpandedRegion(.bottom) {
          NightTrack(state: context.state, awake: context.isStale).padding(.top, 6)
        }
      } compactLeading: {
        Marmot(awake: context.isStale).frame(width: 24, height: 24)
      } compactTrailing: {
        if context.isStale {
          Image(systemName: "sun.max.fill").foregroundStyle(Aube.gold)
        } else {
          Text(timerInterval: Date.now...max(context.state.alarm, Date.now), countsDown: true, showsHours: true)
            .monospacedDigit()
            .frame(maxWidth: 56)
            .foregroundStyle(Aube.gold)
        }
      } minimal: {
        Marmot(awake: context.isStale).frame(width: 22, height: 22)
      }
      .keylineTint(Aube.gold)
    }
  }
}

/// Uber-style: what matters in big (time left), the destination on the right (alarm time),
/// and the trip underneath (the night, with the marmot travelling from the moon to the sun).
struct LockScreenView: View {
  let context: ActivityViewContext<DeboutSleepAttributes>

  var body: some View {
    let state = context.state
    VStack(alignment: .leading, spacing: 12) {
      HStack(alignment: .center) {
        Text("DEBOUT")
          .font(.system(size: 12, weight: .bold))
          .tracking(2)
          .foregroundStyle(Aube.muted)
        Spacer()
        HStack(spacing: 4) {
          Image(systemName: "alarm.fill").font(.system(size: 13))
          Text(state.alarm, style: .time).font(.system(size: 15, weight: .semibold))
        }
        .foregroundStyle(Aube.text)
      }

      if context.isStale {
        VStack(alignment: .leading, spacing: 2) {
          Text("Debout !")
            .font(.system(size: 34, weight: .heavy, design: .rounded))
            .foregroundStyle(Aube.gold)
          Text("\(context.attributes.challenge) pour arrêter le réveil")
            .font(.system(size: 15, weight: .medium))
            .foregroundStyle(Aube.muted)
        }
      } else {
        VStack(alignment: .leading, spacing: 2) {
          Text(state.alarm, style: .relative)
            .font(.system(size: 34, weight: .heavy, design: .rounded))
            .foregroundStyle(Aube.text)
            .monospacedDigit()
          Text("de sommeil avant ton défi")
            .font(.system(size: 15, weight: .medium))
            .foregroundStyle(Aube.muted)
        }
      }

      NightTrack(state: state, awake: context.isStale)

      HStack {
        Text(state.bedtime, style: .time)
        Spacer()
        Text(context.attributes.challenge)
      }
      .font(.system(size: 12, weight: .medium))
      .foregroundStyle(Aube.muted)
    }
    .padding(16)
  }
}

/// The night as a trip: moon → sun. The bar fills by itself (system timer); the marmot sits where the
/// server last put it (`progress`), or waits at the sun when there's no server to move it.
struct NightTrack: View {
  let state: DeboutSleepAttributes.ContentState
  let awake: Bool

  private let height: CGFloat = 8
  private let marmot: CGFloat = 34

  var body: some View {
    let position = awake ? 1 : (state.progress >= 0 ? min(1, state.progress) : 1)
    HStack(spacing: 8) {
      Image(systemName: "moon.fill").font(.system(size: 13)).foregroundStyle(Aube.violet)
      GeometryReader { geo in
        let travel = max(geo.size.width - marmot, 0)
        ZStack(alignment: .leading) {
          Capsule().fill(Aube.track).frame(height: height)
          if awake {
            Capsule()
              .fill(LinearGradient(colors: [Aube.violet, Aube.rose, Aube.gold], startPoint: .leading, endPoint: .trailing))
              .frame(height: height)
          } else {
            ProgressView(timerInterval: state.bedtime...state.alarm, countsDown: false) {
              EmptyView()
            } currentValueLabel: {
              EmptyView()
            }
            .progressViewStyle(.linear)
            .tint(Aube.gold)
            .scaleEffect(x: 1, y: 2, anchor: .center)
          }
          Marmot(awake: awake)
            .frame(width: marmot, height: marmot)
            .offset(x: travel * position)
        }
        .frame(height: geo.size.height)
      }
      .frame(height: marmot)
      Image(systemName: "sun.max.fill").font(.system(size: 14)).foregroundStyle(Aube.gold)
    }
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
