#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import "react-native-quick-pinyin.h"

@interface Pinyin : NSObject <RCTBridgeModule>

@property (nonatomic, assign) BOOL setBridgeOnMainQueue;

@end
