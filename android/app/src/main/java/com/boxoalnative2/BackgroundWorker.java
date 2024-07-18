package com.boxoalnative2;
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
            int totalPercentage = 0;
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

                int differenceInMinutes = currentTimeInMinutes - recordingStartTimeInMinutes;
                totalPercentage = (differenceInMinutes / timeboxSizeInMinutes) * 100;

                if (totalPercentage >= 100) {
                    displayNotification(timeboxObj.getString("title") + " has gone over number of boxes...", totalPercentage, false, timeboxObj);
                    break;
                } else {
                    displayNotification("for " + timeboxObj.getString("title"), totalPercentage, true, timeboxObj);
                }
                Thread.sleep(10000);
                
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

    private void displayNotification(String message, int progress, boolean showProgress, JSONObject timebox ) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        String channelId = "boxoal";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId, "Boxoal Channel", NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }

        Intent intent = new Intent(getApplicationContext(), MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        try {
            intent.putExtra("params", "stopRecording+"+timebox.getString("id")+"+"+timebox.getString("id")+"+"+this.inputData.getString("recordingStartTime"));
        } catch (JSONException e) {
            Log.w("bg", e.getMessage());
            e.printStackTrace();
        }

        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("Recording...")
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Stop", pendingIntent);

        if (showProgress) {
            builder.setProgress(100, progress, false);
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