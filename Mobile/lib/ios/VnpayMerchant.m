#import "VnpayMerchant.h"
#import <CallAppSDK/CallAppInterface.h>

@implementation VnpayMerchant

RCT_EXPORT_MODULE();
- (NSArray<NSString *> *)supportedEvents
{
  return @[@"PaymentBack"];
}
RCT_EXPORT_METHOD(show:(NSString *)scheme 
                    isSandbox:(BOOL )isSandbox
                    paymentUrl:(NSString *)paymentUrl
                    tmn_code:(NSString *)tmn_code 
                    backAlert:(NSString *)backAlert 
                    title:(NSString *)title 
                    titleColor:(NSString *)titleColor
                    beginColor:(NSString *)beginColor
                    endColor:(NSString *)endColor
                    iconBackName:(NSString *)iconBackName
                    )
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sdkAction:)
                                                 name:@"SDK_COMPLETED" object:nil];
    [CallAppInterface setSchemes:scheme];
    [CallAppInterface setIsSandbox:isSandbox];
    [CallAppInterface setAppBackAlert:backAlert];
    [CallAppInterface showPushPaymentwithPaymentURL:paymentUrl
                                          withTitle:title
                                       iconBackName:iconBackName
                                         beginColor:beginColor
                                           endColor:endColor
                                         titleColor:titleColor
                                           tmn_code:tmn_code];
  });
}

-(void)sdkAction:(NSNotification*)notification{
    if([notification.name isEqualToString:@"SDK_COMPLETED"]){
        NSString *actionValue=[notification.object valueForKey:@"Action"];
        if ([@"AppBackAction" isEqualToString:actionValue]) {//Người dùng nhấn back từ sdk để quay lại
          [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@-1}];
          return;
        }
        if ([@"WebBackAction" isEqualToString:actionValue]) {//Người dùng nhấn back từ trang thanh toán thành công khi thanh toán qua thẻ khi gọi đến http://sdk.merchantbackapp
          [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@10}];
          return;
        }
        
        if ([@"CallMobileBankingApp" isEqualToString:actionValue]) {//Người dùng nhấn chọn thanh toán qua app thanh toán (Mobile Banking, Ví...)
          [self sendEventWithName:@"PaymentBack" body:@{@"resultCode":@99}];
          return;
        }
    }
}
@end
