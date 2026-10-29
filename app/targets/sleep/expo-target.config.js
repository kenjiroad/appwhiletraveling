// Lock screen + Dynamic Island "sleep" Live Activity: the sleeping marmot and the countdown to the alarm.
// Generated into the Xcode project by @bacons/apple-targets at build time.
/** @type {import('@bacons/apple-targets/app.plugin').Config} */
module.exports = {
  type: 'widget',
  name: 'DeboutSleep',
  displayName: 'Debout',
  bundleIdentifier: '.sleep',
  deploymentTarget: '16.2',
  frameworks: ['SwiftUI', 'WidgetKit', 'ActivityKit'],
  images: {
    'marmotte-dort': './images/marmotte-dort.png',
    'marmotte-reveil': './images/marmotte-reveil.png',
  },
};
