package com.boxoalnative2;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import javax.annotation.Nonnull;
import com.boxoalnative2.BackgroundWorker;

public class BackgroundModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "BackgroundWorkManager";

    private Context mContext;
    private OneTimeWorkRequest workRequest;

    BackgroundModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        workRequest = new OneTimeWorkRequest.Builder(BackgroundWorker.class).build();
    }

    @ReactMethod
    public void startBackgroundWork() {
        WorkManager.getInstance(mContext).enqueue(workRequest);
    }

    @ReactMethod
    public void stopBackgroundWork() {
        WorkManager.getInstance(mContext).cancelUniqueWork("testWork");
    }

    @Nonnull
    @Override
    public String getName() {
        return MODULE_NAME;
    }
}