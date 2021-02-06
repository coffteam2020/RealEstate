# react-native-vnpay-merchant

## Cài đặt

`$ yarn add <đường dẫn tuyệt đối tới thư mục của module>`

### Với các bản react native cũ (chưa có autolink, thường từ 0.59 trở về trước)

`$ npx react-native link react-native-vnpay-merchant`

## Các bước cài đặt thêm

### Android
Thêm đoạn sau vào `android/build.gradle`
```gradle
allprojects {
    repositories {
        // ...các repo khác
        maven {
                url("$rootDir/../node_modules/react-native-vnpay-merchant/android/repo")
        }
    }
}
```

### IOS
Vào thư mục IOS chạy pod install
```sh
$ cd ios
$ pod install
```
Thêm đoạn sau vào `AppDelegate.m`
```objc
#import <CallAppSDK/CallAppInterface.h>

...


- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    ...
    // 
    [CallAppInterface setHomeViewController:rootViewController];
    return YES;
}
```

## Usage
```javascript
import VnpayMerchant, { VnpayMerchantModule } from 'react-native-vnpay-merchant'

const eventEmitter = new NativeEventEmitter(VnpayMerchantModule);

// sử dụng với hook
useEffect(() => {
    // mở sdk
    eventEmitter.addListener('PaymentBack', (e) => {
        console.log('Sdk back!')

        // Đã available trên cả ios, android
        if(e){
            switch(e.resultCode){
                case 99:
                    console.log('Người dùng nhấn back từ trang thanh toán thành công khi thanh toán qua thẻ khi gọi đến http://sdk.merchantbackapp')
                    break;
                case 0: //ios
                    console.log('Người dùng nhấn chọn thanh toán qua app thanh toán (Mobile Banking, Ví...)')
                    break;
                case 10:
                    console.log('Người dùng nhấn back từ sdk để quay lại')
            }
        }
    })
    return () => {
        // khi tắt sdk
        eventEmitter.removeAllListeners('PaymentBack')
    }
}, [])
// trường hợp sử dụng với class thì viết trong componentDidMount và componentWillUnmount




```
