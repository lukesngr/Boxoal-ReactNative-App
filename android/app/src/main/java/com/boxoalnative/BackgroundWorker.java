package com.boxoalnative;
import android.content.Context;
import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import android.util.Log;
import androidx.work.Worker;
import androidx.work.WorkerParameters;
import android.content.Context;
import androidx.annotation.NonNull;
import android.os.Bundle;
import android.content.Intent;
import android.os.Build;
import androidx.work.Data;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import org.json.JSONException;
import org.json.JSONObject;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;
import android.app.PendingIntent;
import android.app.NotificationManager;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskContext;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import android.net.Uri;

public class BackgroundWorker extends Worker {
    private final Context context;
    private Data inputData;

    public BackgroundWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        this.inputData = workerParams.getInputData();
        this.context = context;
    }

    @NonNull
    @Override
    public Result doWork() {

        // background work will take place here
        try {
            String timebox = inputData.getString("timebox");
            String schedule = inputData.getString("schedule");
            Date recordingStartTime = this.convertISOToDate(inputData.getString("recordingStartTime"));
            Double totalPercentage = 0.0;
            long recordingTimeInMillis = recordingStartTime.getTime();
            int recordingStartTimeInMinutes = this.getTimeInMinutes(recordingTimeInMillis);
            JSONObject timeboxObj = new JSONObject(timebox);
            JSONObject scheduleObj = new JSONObject(schedule);

            while(!isStopped()) {
                int currentTimeInMinutes = getTimeInMinutes(System.currentTimeMillis());
                int timeboxSizeInMinutes = 0;

                if (scheduleObj.getString("boxSizeUnit").equals("min")) {
                    timeboxSizeInMinutes = scheduleObj.getInt("boxSizeNumber");
                } else if (scheduleObj.getString("boxSizeUnit").equals("hr")) {
                    timeboxSizeInMinutes = scheduleObj.getInt("boxSizeNumber") * 60;
                }

                Double differenceInMinutes = Double.valueOf(currentTimeInMinutes) - Double.valueOf(recordingStartTimeInMinutes);
                totalPercentage = (differenceInMinutes / Double.valueOf(timeboxSizeInMinutes)) * 100.0;

                if(totalPercentage >= 100) {
                    displayNotification(timeboxObj.getString("title")+" has gone over number of boxes...", differenceInMinutes, false, timeboxObj.getString("id"), scheduleObj.getString("id"));
                }else{
                    displayNotification("For "+timeboxObj.getString("title"), totalPercentage, true, timeboxObj.getString("id"), scheduleObj.getString("id"));
                }
                
                Thread.sleep(120000);
                
            }
        } catch (Exception e) {
            Log.w("bg", e.getMessage());
            e.printStackTrace();
            Thread.currentThread().interrupt();
        }
        
        return Result.success();
    }

    private int getTimeInMinutes(long timeInMillis) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTimeInMillis(timeInMillis);
        int hours = calendar.get(Calendar.HOUR_OF_DAY);
        int minutes = calendar.get(Calendar.MINUTE);
        return hours * 60 + minutes;
    }

    private void displayNotification(String message, Double progress, boolean showProgress, String timeboxID, String scheduleID ) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        String channelId = "boxoal";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId, "Boxoal Channel", NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }

        String uri = "boxoal://stopRecording/"+timeboxID+'/'+scheduleID+'/'+this.inputData.getString("recordingStartTime");
        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(uri));

        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("Recording...")
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Stop", pendingIntent);

        if (showProgress) {
            builder.setProgress(100, progress.intValue(), false);
        }

        notificationManager.notify(1, builder.build());
    }

    private Date convertISOToDate(String isoDateString) {
        SimpleDateFormat isoFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        isoFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
        
        try {
            return isoFormat.parse(isoDateString);
        } catch (ParseException e) {
            Log.w("bg", e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}