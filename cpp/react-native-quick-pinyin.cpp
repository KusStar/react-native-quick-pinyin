#import "react-native-quick-pinyin.h"

#include <iostream>
#include <sstream>

using namespace facebook::jsi;

void install(Runtime &jsiRuntime) {
  auto hello = Function::createFromHostFunction(
      jsiRuntime, PropNameID::forAscii(jsiRuntime, "quickpinyin"), 1,
      [](Runtime &rt, const Value &thisValue, const Value *arguments,
         size_t count) -> Value {
        if (count != 1) {
          detail::throwJSError(
              rt, "[react-native-quick-pinyin] arg count must be 1");
        }
        std::string str = arguments[0].getString(rt).utf8(rt);
        return Value(String::createFromUtf8(rt, str));
      });

  jsiRuntime.global().setProperty(jsiRuntime, "quickpinyin", std::move(hello));
}
