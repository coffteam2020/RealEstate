#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <PushKit/PushKit.h>                    /* <------ add this line */
#import "RNVoipPushNotificationManager.h"
#import <Firebase.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>
#import <PushKit/PushKit.h>                    /* <------ add this line */
#import <GoogleMaps/GoogleMaps.h>
#import "RNCallKeep.h"
#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Mobile"
                                            initialProperties:nil];
  [FIRApp configure];

  //  [RNNotifications startMonitorNotifications];
    if ([UNUserNotificationCenter class] != nil) {
    // iOS 10 or later
    // For iOS 10 display notification (sent via APNS)
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
        UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
    [[UNUserNotificationCenter currentNotificationCenter]
        requestAuthorizationWithOptions:authOptions
        completionHandler:^(BOOL granted, NSError * _Nullable error) {
          // ...
        }];
    } else {
      // iOS 10 notifications aren't available; fall back to iOS 8-9 notifications.
      UIUserNotificationType allNotificationTypes =
      (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
      UIUserNotificationSettings *settings =
      [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
      [application registerUserNotificationSettings:settings];
    }
    [application registerForRemoteNotifications];
  [GMSServices provideAPIKey:@"AIzaSyB5vqnxvHdaTdgKY1E8AsaBxs_FS9HEiCM"];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [FIRMessaging messaging].delegate = self;
       
       [[FIRInstanceID instanceID] instanceIDWithHandler:^(FIRInstanceIDResult * _Nullable result,
                                                           NSError * _Nullable error) {
         if (error != nil) {
           NSLog(@"Error fetching remote instance ID: %@", error);
         } else {
           NSLog(@"Remote instance ID token: %@", result.token);
         }
       }];
       
       [FIRMessaging messaging].autoInitEnabled = YES;
                UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
                center.delegate = self;
                [center requestAuthorizationWithOptions:(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge) completionHandler:^(BOOL granted, NSError * _Nullable error)
                {
                      if (!error)
                      {
                          [[UIApplication sharedApplication] registerForRemoteNotifications];  // required to get the app to do anything at all about push notifications
                          NSLog( @"Push registration success." );
                      }
                      else
                      {
                          NSLog( @"Push registration FAILED" );
                          NSLog( @"ERROR: %@ - %@", error.localizedFailureReason, error.localizedDescription );
                          NSLog( @"SUGGESTIONS: %@ - %@", error.localizedRecoveryOptions, error.localizedRecoverySuggestion );
                      }
                }];
   [[UIApplication sharedApplication] registerForRemoteNotifications];
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
    NSLog(@"FCM registration token: %@", fcmToken);
    // Notify about received token.
    NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
    [[NSNotificationCenter defaultCenter] postNotificationName:
     @"FCMToken" object:nil userInfo:dataDict];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  
  [FIRMessaging messaging].APNSToken = deviceToken;
  [[FIRAuth auth] setAPNSToken:deviceToken type:FIRAuthAPNSTokenTypeSandbox];
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RNCPushNotificationIOS didRegisterUserNotificationSettings:notificationSettings];
}

// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  if ([[FIRAuth auth] canHandleNotification:userInfo]) {
     completionHandler(UIBackgroundFetchResultNoData);
     return;
   }
  [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}

// Required for the localNotification event.
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RNCPushNotificationIOS didReceiveLocalNotification:notification];
}

// Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
  {
    NSDictionary *userInfo = notification.request.content.userInfo;
    [[FIRMessaging messaging] appDidReceiveMessage:userInfo];
    completionHandler(UNAuthorizationOptionSound | UNAuthorizationOptionAlert | UNAuthorizationOptionBadge);
  }
// --- Handle updated push credentials
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type {
  // Register VoIP push token (a property of PKPushCredentials) with server
 [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
}

- (void)pushRegistry:(PKPushRegistry *)registry didInvalidatePushTokenForType:(PKPushType)type
{
  // --- The system calls this method when a previously provided push token is no longer valid for use. No action is necessary on your part to reregister the push type. Instead, use this method to notify your server not to send push notifications using the matching push token.
}
//
//- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
//  // Process the received push
//  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
//
//  // Retrieve information like handle and callerName here
//   NSString *uuid = /* fetch for payload or ... */ [[[NSUUID UUID] UUIDString] lowercaseString];
//   NSString *callerName = @"caller name here";
//   NSString *handle = @"caller number here";
//   NSDictionary *extra = [payload.dictionaryPayload valueForKeyPath:@"custom.path.to.data"]; /* use this to pass any special data (ie. from your notification) down to RN. Can also be `nil` */
//
//  [RNCallKeep reportNewIncomingCall:uuid handle:handle handleType:@"generic" hasVideo:false localizedCallerName:callerName fromPushKit: YES payload:extra withCompletionHandler:completion];
//}
// --- Handle incoming pushes (for ios <= 10)
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type {
   NSLog(@"Ajith");
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
  
//  [RNCallKeep reportNewIncomingCall:uuid handle:handle handleType:@"generic" hasVideo:false localizedCallerName:callerName fromPushKit: YES payload:extra withCompletionHandler:completion];
//  [RNVoipPushKit didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
//  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];

  // Retrieve information like handle and callerName here
   NSString *uuid = /* fetch for payload or ... */ [[[NSUUID UUID] UUIDString] lowercaseString];
   NSString *callerName = @"caller name here";
   NSString *handle = @"caller number here";
   NSDictionary *extra = [payload.dictionaryPayload valueForKeyPath:@"custom.path.to.data"]; /* use this to pass any special data (ie. from your notification) down to RN. Can also be `nil` */

  [RNCallKeep reportNewIncomingCall:uuid handle:handle handleType:@"generic" hasVideo:false localizedCallerName:callerName fromPushKit: YES payload:extra ];
}

// --- Handle incoming pushes (for ios >= 11)
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
  
  // --- NOTE: apple forced us to invoke callkit ASAP when we receive voip push
  // --- see: react-native-callkeep

  // --- Retrieve information from your voip push payload
  NSString *uuid = payload.dictionaryPayload[@"uuid"];
  NSString *callerName = [NSString stringWithFormat:@"%@ (Connecting...)", payload.dictionaryPayload[@"callerName"]];
  NSString *handle = payload.dictionaryPayload[@"handle"];

  // --- this is optional, only required if you want to call `completion()` on the js side
  [RNVoipPushNotificationManager addCompletionHandler:uuid completionHandler:completion];

  // --- Process the received push
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];

  NSDictionary *extra = [payload.dictionaryPayload valueForKeyPath:@"custom.path.to.data"]; /* use this to pass any special data (ie. from your notification) down to RN. Can also be `nil` */

  // --- You should make sure to report to callkit BEFORE execute `completion()`
  [RNCallKeep reportNewIncomingCall:uuid handle:handle handleType:@"generic" hasVideo:false localizedCallerName:callerName fromPushKit: YES payload:extra withCompletionHandler:completion];
  
  // --- You don't need to call it if you stored `completion()` and will call it on the js side.
//  completion();
}
- (BOOL)application:(UIApplication *)application
 continueUserActivity:(NSUserActivity *)userActivity
   restorationHandler:(void(^)(NSArray * __nullable restorableObjects))restorationHandler
 {
   return [RNCallKeep application:application
            continueUserActivity:userActivity
              restorationHandler:restorationHandler];
 }
@end
