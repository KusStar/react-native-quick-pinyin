#import "react-native-quick-pinyin.h"

#include <iostream>
#include <sstream>

using namespace facebook;

void install(jsi::Runtime& jsiRuntime) {
  auto hello = jsi::Function::createFromHostFunction(
      jsiRuntime,
      jsi::PropNameID::forAscii(jsiRuntime, "quickpinyin"),
      1,
      [](jsi::Runtime& rt, const jsi::Value& thisValue, const jsi::Value* arguments, size_t count) -> jsi::Value {
      if (count != 1) {
        jsi::detail::throwJSError(rt, "[react-native-quick-pinyin] arg count must be 1");
      }
      std::string str = arguments[0].getString(rt).utf8(rt);
      return jsi::Value(jsi::String::createFromUtf8(rt, str));
  });

  jsiRuntime.global().setProperty(jsiRuntime, "quickpinyin", std::move(hello));
}
