Pod::Spec.new do |s|
  s.name           = 'DeboutAlarm'
  s.version        = '1.0.0'
  s.summary        = 'Schedules the morning alarm with AlarmKit (iOS 26), so it rings like the Clock app, even in silent mode.'
  s.description    = s.summary
  s.license        = 'UNLICENSED'
  s.author         = 'Debout'
  s.homepage       = 'https://github.com/kenjiroad/appwhiletraveling'
  s.platforms      = { :ios => '16.4' }
  s.source         = { git: '' }
  s.swift_version  = '5.9'

  s.dependency 'ExpoModulesCore'

  s.static_framework = true
  s.source_files = "**/*.{h,m,swift}"
end
