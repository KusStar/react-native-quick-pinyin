#include <jni.h>
#include "react-native-quick-pinyin.h"

extern "C"
JNIEXPORT jint JNICALL
Java_com_reactnativepinyin_PinyinModule_initialize(JNIEnv* env, jclass clazz, jlong jsiPtr) {
    auto runtime = reinterpret_cast<facebook::jsi::Runtime *>(jsiPtr);

    if (runtime) {
      installPinyin(*runtime);
    }
}
