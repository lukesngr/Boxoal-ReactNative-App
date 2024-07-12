package com.boxoalnative2;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import android.content.Intent;
import android.os.Bundle;
import javax.annotation.Nullable;

public class BackgroundHeadlessTaskService extends HeadlessJsTaskService {
    @Override
    protected @Nullable
    HeadlessJsTaskConfig getTaskConfig(Intent intent) {

        Bundle extras = intent.getExtras();
        if (extras != null) {
            return new HeadlessJsTaskConfig(
                    "BackgroundHeadlessTask",
                    Arguments.fromBundle(extras),
                    0, // timeout for the task
                    true // optional: defines whether or not  the task is allowed in foreground. Default is false
            );
        }
        return null;
    }
}
