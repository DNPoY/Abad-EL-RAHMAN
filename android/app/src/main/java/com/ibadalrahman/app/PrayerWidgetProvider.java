package com.ibadalrahman.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import com.ibadalrahman.app.R;

public class PrayerWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    public static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        // Retrieve data from SharedPreferences
        SharedPreferences prefs = context.getSharedPreferences("PrayerWidgetPrefs", Context.MODE_PRIVATE);
        
        String fajr = prefs.getString("fajr", "--:--");
        String dhuhr = prefs.getString("dhuhr", "--:--");
        String asr = prefs.getString("asr", "--:--");
        String maghrib = prefs.getString("maghrib", "--:--");
        String isha = prefs.getString("isha", "--:--");
        String hijriDate = prefs.getString("hijriDate", "--");
        String locationName = prefs.getString("locationName", "--");
        
        String nextPrayerName = prefs.getString("nextPrayerName", ""); 
        
        int dhikrProgress = prefs.getInt("dhikrProgress", 0);
        String currentDhikr = prefs.getString("currentDhikr", "--");
        int dhikrTarget = prefs.getInt("dhikrTarget", 0);

        String language = prefs.getString("language", "ar");
        String labelFajr = prefs.getString("labelFajr", "Fajr");
        String labelDhuhr = prefs.getString("labelDhuhr", "Dhuhr");
        String labelAsr = prefs.getString("labelAsr", "Asr");
        String labelMaghrib = prefs.getString("labelMaghrib", "Maghrib");
        String labelIsha = prefs.getString("labelIsha", "Isha");
        String labelNext = prefs.getString("labelNext", "Next");
        String labelProtection = prefs.getString("labelProtection", "Protection");
        String labelDhikr = prefs.getString("labelDhikr", "Dhikr");

        // Construct the RemoteViews object
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.prayer_widget);
        
        // Handle RTL / Layout Direction
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.JELLY_BEAN_MR1) {
            int layoutDir = language.equals("ar") ? android.view.View.LAYOUT_DIRECTION_RTL : android.view.View.LAYOUT_DIRECTION_LTR;
            // views.setLayoutDirection(layoutDir); // Not available for RemoteViews in older API versions
            // However, most modern Android versions handle layoutDirection="locale" in XML if we set it.
        }

        // Set Localized Labels
        views.setTextViewText(R.id.widget_fajr_label, labelFajr);
        views.setTextViewText(R.id.widget_dhuhr_label, labelDhuhr);
        views.setTextViewText(R.id.widget_asr_label, labelAsr);
        views.setTextViewText(R.id.widget_maghrib_label, labelMaghrib);
        views.setTextViewText(R.id.widget_isha_label, labelIsha);

        // Set Texts
        views.setTextViewText(R.id.widget_fajr_time, fajr);
        views.setTextViewText(R.id.widget_dhuhr_time, dhuhr);
        views.setTextViewText(R.id.widget_asr_time, asr);
        views.setTextViewText(R.id.widget_maghrib_time, maghrib);
        views.setTextViewText(R.id.widget_isha_time, isha);
        
        views.setTextViewText(R.id.widget_hijri_date, hijriDate);

        // Update Protection Status
        views.setTextViewText(R.id.widget_protection_label, labelProtection);
        views.setTextViewText(R.id.widget_next_prayer_info, labelNext + ": " + nextPrayerName);
        
        views.setTextViewText(R.id.widget_current_dhikr, currentDhikr);
        views.setTextViewText(R.id.widget_dhikr_count, dhikrProgress + "/" + dhikrTarget);
        
        views.setProgressBar(R.id.widget_dhikr_progress, dhikrTarget, dhikrProgress, false);

        // Colors
        int white = android.graphics.Color.WHITE;
        int gold = 0xFFC5A059; // Matte Gold Color
        int goldLabel = 0xFFC5A059;

        // Reset all time colors to white and labels to gold
        views.setTextColor(R.id.widget_fajr_time, white);
        views.setTextColor(R.id.widget_dhuhr_time, white);
        views.setTextColor(R.id.widget_asr_time, white);
        views.setTextColor(R.id.widget_maghrib_time, white);
        views.setTextColor(R.id.widget_isha_time, white);

        // Reset all backgrounds to normal
        views.setInt(R.id.layout_fajr, "setBackgroundResource", R.drawable.widget_prayer_card);
        views.setInt(R.id.layout_dhuhr, "setBackgroundResource", R.drawable.widget_prayer_card);
        views.setInt(R.id.layout_asr, "setBackgroundResource", R.drawable.widget_prayer_card);
        views.setInt(R.id.layout_maghrib, "setBackgroundResource", R.drawable.widget_prayer_card);
        views.setInt(R.id.layout_isha, "setBackgroundResource", R.drawable.widget_prayer_card);

        // Highlight Next Prayer with active card style
        if (nextPrayerName.equals("Fajr") || nextPrayerName.equals("الفجر")) {
            views.setInt(R.id.layout_fajr, "setBackgroundResource", R.drawable.widget_prayer_card_active);
            views.setTextColor(R.id.widget_fajr_time, gold);
        }
        if (nextPrayerName.equals("Dhuhr") || nextPrayerName.equals("الظهر")) {
            views.setInt(R.id.layout_dhuhr, "setBackgroundResource", R.drawable.widget_prayer_card_active);
            views.setTextColor(R.id.widget_dhuhr_time, gold);
        }
        if (nextPrayerName.equals("Asr") || nextPrayerName.equals("العصر")) {
            views.setInt(R.id.layout_asr, "setBackgroundResource", R.drawable.widget_prayer_card_active);
            views.setTextColor(R.id.widget_asr_time, gold);
        }
        if (nextPrayerName.equals("Maghrib") || nextPrayerName.equals("المغرب")) {
            views.setInt(R.id.layout_maghrib, "setBackgroundResource", R.drawable.widget_prayer_card_active);
            views.setTextColor(R.id.widget_maghrib_time, gold);
        }
        if (nextPrayerName.equals("Isha") || nextPrayerName.equals("العشاء")) {
            views.setInt(R.id.layout_isha, "setBackgroundResource", R.drawable.widget_prayer_card_active);
            views.setTextColor(R.id.widget_isha_time, gold);
        }

        // App Launch Intent
        Intent intent = new Intent(context, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        views.setOnClickPendingIntent(R.id.top_bar, pendingIntent);
        
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onEnabled(Context context) {
        // Enter relevant functionality for when the first widget is created
    }

    @Override
    public void onDisabled(Context context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}
