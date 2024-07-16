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
            Log.w("bg", recordingStartTime.toString());
            long recordingTimeInMillis = recordingStartTime.getTime();
            Log.w("bg", "running2");
            int recordingStartTimeInMinutes = this.getTimeInMinutes(recordingTimeInMillis);
            Log.w("bg", "running3");
            JSONObject timeboxObj = new JSONObject(timebox);
            JSONObject scheduleObj = new JSONObject(schedule);

            while(!isStopped()) {
                Log.w("bg", "running");
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
                    displayNotification(timeboxObj.getString("title") + " has gone over number of boxes...", totalPercentage, false);
                    break;
                } else {
                    displayNotification("for " + timeboxObj.getString("title"), totalPercentage, true);
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
        Log.w("bg", "running");
        Calendar calendar = Calendar.getInstance();
        Log.w("bg", "running");
        calendar.setTimeInMillis(timeInMillis);
        Log.w("bg", "running");
        int hours = calendar.get(Calendar.HOUR_OF_DAY);
        int minutes = calendar.get(Calendar.MINUTE);
        return hours * 60 + minutes;
    }

    private void displayNotification(String message, int progress, boolean showProgress) {
        NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        String channelId = "boxoal";
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId, "Boxoal Channel", NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle("Recording...")
                .setContentText(message)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);

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