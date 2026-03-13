package com.boxoalnative;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import com.boxoalnative.BackgroundModule;
import javax.annotation.Nonnull;
import com.facebook.react.module.model.ReactModuleInfo;         
import com.facebook.react.module.model.ReactModuleInfoProvider;
import java.util.Map;
import com.facebook.react.BaseReactPackage;
import java.util.HashMap;

public class BackgroundPackage extends BaseReactPackage {
    @Override
    public NativeModule getModule(String name, @Nonnull ReactApplicationContext reactContext) {
        if (name.equals(BackgroundModule.MODULE_NAME)) {
            return new BackgroundModule(reactContext);
        }
        return null;
    }
    
    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> map = new HashMap<>();
            map.put(BackgroundModule.MODULE_NAME, new ReactModuleInfo(
                BackgroundModule.MODULE_NAME,
                BackgroundModule.MODULE_NAME,
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                false,  // isCXXModule
                true    // isTurboModule  ← key flag
            ));
            return map;
        };
    }

    @Nonnull
    @Override
    public List<ViewManager> createViewManagers(@Nonnull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
