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
  static let card = Color(red: 0.07, green: 0.07, blue: 0.11)
  static let text = Color.white
  static let muted = Color.white.opacity(0.55)
  static let passed = Color.white.opacity(0.22)
  static let gold = Color(red: 1.0, green: 0.77, blue: 0.42)
  static let sun = Color(red: 1.0, green: 0.48, blue: 0.27)
  static let rose = Color(red: 1.0, green: 0.37, blue: 0.54)
  static let violet = Color(red: 0.42, green: 0.36, blue: 1.0)
}

/// One sleep cycle lasts about 90 minutes: the stops along the night, like stations on a line.
private let sleepCycle: TimeInterval = 90 * 60

private extension DeboutSleepAttributes.ContentState {
  var alarm: Date { Date(timeIntervalSince1970: alarmAt) }
  var bedtime: Date { Date(timeIntervalSince1970: min(bedtimeAt, alarmAt - 1)) }
  var night: TimeInterval { max(alarmAt - bedtimeAt, 1) }

  /// Where the marmot is: what the server last sent, or where the night was when this view was drawn.
  var position: Double {
    if progress >= 0 { return min(1, progress) }
    return min(1, max(0, (Date().timeIntervalSince1970 - bedtimeAt) / night))
  }

  /// Cycle boundaries as fractions of the night (stations on the line).
  var stops: [Double] {
    stride(from: sleepCycle, to: night, by: sleepCycle).map { $0 / night }
  }

  var cyclesLeft: Int {
    Int(((1 - position) * night / sleepCycle).rounded(.up))
  }

  var nightLength: String {
    let minutes = Int(night / 60)
    return minutes % 60 == 0 ? "\(minutes / 60) H DE NUIT" : "\(minutes / 60) H \(minutes % 60) DE NUIT"
  }
}

struct SleepLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: DeboutSleepAttributes.self) { context in
      LockScreenView(context: context)
        .activityBackgroundTint(Aube.card)
        .activitySystemActionForegroundColor(Aube.text)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) {
          AppBadge().frame(width: 40, height: 40).padding(.leading, 4)
        }
        DynamicIslandExpandedRegion(.center) {
          Headline(context: context, size: 17)
        }
        DynamicIslandExpandedRegion(.trailing) {
          Marmot(awake: context.isStale).frame(width: 48, height: 48)
        }
        DynamicIslandExpandedRegion(.bottom) {
          VStack(spacing: 8) {
            NightLine(state: context.state, awake: context.isStale)
            Footer(context: context)
          }
          .padding(.horizontal, 4)
        }
      } compactLeading: {
        AppBadge().frame(width: 22, height: 22)
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
        AppBadge().frame(width: 22, height: 22)
      }
      .keylineTint(Aube.gold)
    }
  }
}

/// Like a transport tracker: app badge + big headline on the left, the sleeping marmot spilling off the
/// right edge, the night as a line with stops (sleep cycles), and the key numbers underneath.
struct LockScreenView: View {
  let context: ActivityViewContext<DeboutSleepAttributes>

  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      HStack(alignment: .top, spacing: 12) {
        AppBadge().frame(width: 46, height: 46)
        Headline(context: context, size: 22)
          .padding(.trailing, 64) // room for the big marmot
        Spacer(minLength: 0)
      }
      .overlay(alignment: .topTrailing) {
        Marmot(awake: context.isStale)
          .frame(width: 96, height: 96)
          .offset(x: 30, y: -28)
      }

      NightLine(state: context.state, awake: context.isStale)
      Footer(context: context)
    }
    .padding(.horizontal, 18)
    .padding(.vertical, 16)
  }
}

struct Headline: View {
  let context: ActivityViewContext<DeboutSleepAttributes>
  let size: CGFloat

  var body: some View {
    VStack(alignment: .leading, spacing: 2) {
      if context.isStale {
        Text("Debout !")
          .font(.system(size: size + 2, weight: .bold))
          .foregroundStyle(Aube.text)
        Text("\(context.attributes.challenge) pour l’arrêter")
          .font(.system(size: size * 0.78, weight: .medium))
          .foregroundStyle(Aube.muted)
      } else {
        (Text("Debout dans ") + Text(context.state.alarm, style: .relative))
          .font(.system(size: size, weight: .bold))
          .foregroundStyle(Aube.text)
          .lineLimit(1)
          .minimumScaleFactor(0.7)
        (Text("Réveil à ") + Text(context.state.alarm, style: .time) + Text(" · \(context.attributes.challenge)"))
          .font(.system(size: size * 0.78, weight: .medium))
          .foregroundStyle(Aube.muted)
          .lineLimit(1)
      }
    }
  }
}

/// The night as a line: grey behind the marmot (already slept), gold ahead with a stop at each sleep
/// cycle, and the sun at the end (the alarm).
struct NightLine: View {
  let state: DeboutSleepAttributes.ContentState
  let awake: Bool

  private let line: CGFloat = 5
  private let marmot: CGFloat = 30

  var body: some View {
    let position = awake ? 1 : state.position
    GeometryReader { geo in
      let width = geo.size.width
      let x = position * width
      ZStack(alignment: .leading) {
        Capsule().fill(Aube.passed).frame(width: max(x, 0), height: line)

        Capsule()
          .fill(LinearGradient(colors: [Aube.gold, Aube.sun], startPoint: .leading, endPoint: .trailing))
          .frame(width: max(width - x, 0), height: line)
          .offset(x: x)

        ForEach(state.stops.filter { $0 > position + 0.02 }, id: \.self) { stop in
          Station(size: 12).offset(x: stop * width - 6)
        }

        Station(size: 16, sun: true).offset(x: width - 8)

        Marmot(awake: awake)
          .frame(width: marmot, height: marmot)
          .offset(x: min(max(x - marmot / 2, 0), width - marmot))
      }
      .frame(width: width, height: geo.size.height)
    }
    .frame(height: 30)
  }
}

struct Station: View {
  let size: CGFloat
  var sun = false

  var body: some View {
    Circle()
      .fill(sun ? Aube.sun : Aube.gold)
      .frame(width: size, height: size)
      .overlay(Circle().stroke(Aube.card, lineWidth: 3).padding(size * 0.28))
  }
}

struct Footer: View {
  let context: ActivityViewContext<DeboutSleepAttributes>

  var body: some View {
    HStack {
      Text(context.state.nightLength)
      Spacer()
      if context.isStale {
        Text("C’EST L’HEURE")
      } else {
        let left = context.state.cyclesLeft
        Text(left > 1 ? "\(left) CYCLES DE SOMMEIL" : "DERNIER CYCLE")
      }
      Spacer()
      Text(context.state.alarm, style: .time)
    }
    .font(.system(size: 13, weight: .semibold))
    .foregroundStyle(Aube.muted)
  }
}

/// The Debout badge: dawn gradient and a rising sun, like an app icon.
struct AppBadge: View {
  var body: some View {
    GeometryReader { geo in
      RoundedRectangle(cornerRadius: geo.size.width * 0.26, style: .continuous)
        .fill(LinearGradient(colors: [Aube.violet, Aube.rose, Aube.gold], startPoint: .topLeading, endPoint: .bottomTrailing))
        .overlay(
          Image(systemName: "sun.horizon.fill")
            .font(.system(size: geo.size.width * 0.5, weight: .bold))
            .foregroundStyle(.white)
        )
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
