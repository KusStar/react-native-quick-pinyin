#import "react-native-quick-pinyin.h"

using namespace facebook;

void installPinyin(jsi::Runtime& jsiRuntime) {
  std::cout << "Initializing react-native-quick-pinyin" << "\n";

  auto hello = jsi::Function::createFromHostFunction(jsiRuntime, jsi::PropNameID::forAscii(jsiRuntime, "helloWorld"), 0, [](jsi::Runtime& runtime,
      const jsi::Value& thisValue,
          const jsi::Value* arguments, size_t count) -> jsi::Value {
      string helloworld = "This is react-native-quick-pinyin";
      return Value(runtime, jsi::String::createFromUtf8(runtime, helloworld));
  });

  jsiRuntime.global().setProperty(jsiRuntime, "pinyin", std::move(hello));
}
