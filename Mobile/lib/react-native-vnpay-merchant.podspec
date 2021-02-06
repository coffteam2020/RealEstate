require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-vnpay-merchant"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-vnpay-merchant
                   DESC
  s.homepage     = "https://github.com/kida7/react-native-vnpay-merchant"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Vinh Le" => "vinhlv@vnpay.vn" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/kida7/react-native-vnpay-merchant.git", :tag => "#{s.version}" }

  s.source_files = "ios/*.{h,m}"
  s.vendored_frameworks = 'ios/Frameworks/CallAppSDK.framework'
  s.requires_arc = true

  s.dependency "React"
  s.static_framework = true
  # ...
  # s.dependency "..."
end

