Pod::Spec.new do |s|
  s.name           = 'RepCounter'
  s.version        = '1.0.0'
  s.summary        = 'Counts push-ups and squats from the front camera with Apple Vision body pose.'
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
