package com.reactnativepinyin;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = PinyinModule.NAME)
public class PinyinModule extends ReactContextBaseJavaModule {
    public static final String NAME = "RNPinyin";

    public PinyinModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    static {
        try {
            // Used to load the 'native-lib' library on application startup.
            System.loadLibrary("quickpinyin");
        } catch (Exception ignored) {
        }
    }

    public static native void initialize(long jsiPtr, String docDir);

    @Override
    public void initialize() {
      super.initialize();

      PinyinModule.initialize(
        this.getReactApplicationContext().getJavaScriptContextHolder().get(),
        this.getReactApplicationContext().getFilesDir().getAbsolutePath());
    }
}
