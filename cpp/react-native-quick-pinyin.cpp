#import "react-native-quick-pinyin.h"
#include "pinyin.h"
#include "react-native-quick-pinyin.h"

using namespace facebook;
using namespace std;

#define MODULE_NAME "quickpinyin"
#define METHOD_GET_FULL_CHARS "getFullChars"

void install(jsi::Runtime &rt) {
  auto thisModule = jsi::Object(rt);

  auto getFullChars = jsi::Function::createFromHostFunction(
      rt, jsi::PropNameID::forAscii(rt, METHOD_GET_FULL_CHARS), 1,
      [](jsi::Runtime &rt, const jsi::Value &thisValue,
         const jsi::Value *arguments, size_t count) -> jsi::Value {
        if (!arguments[0].isString()) {
          throw jsi::JSError(
              rt, "[quickpinyin.getFullChars] First argument must be a string");
        }
        const std::string str = arguments[0].getString(rt).utf8(rt);
        return jsi::Value(jsi::String::createFromUtf8(rt, toFullChars(str)));
      });

  thisModule.setProperty(rt, METHOD_GET_FULL_CHARS, move(getFullChars));

  rt.global().setProperty(rt, MODULE_NAME, move(thisModule));
}
