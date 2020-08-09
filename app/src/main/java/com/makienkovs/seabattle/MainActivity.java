package com.makienkovs.seabattle;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.Switch;

public class MainActivity extends AppCompatActivity {
    private static boolean sound = true;
    private static boolean vibration = true;
    public static final String APP_PREFERENCES = "settings";
    public static final String APP_PREFERENCES_SOUND = "sound";
    public static final String APP_PREFERENCES_VIBRATION = "vibration";
    private SharedPreferences settings;
    private SharedPreferences.Editor editor;
    Sound soundButtons;
    Vibration vibrationButtons;
    int width;

    @SuppressLint({"SourceLockedOrientationActivity", "CommitPrefEdits"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        DisplayMetrics displaymetrics = getResources().getDisplayMetrics();
        width = displaymetrics.widthPixels;

        settings = getSharedPreferences(APP_PREFERENCES, Context.MODE_PRIVATE);
        editor = settings.edit();
        soundButtons = new Sound(this, true);
        vibrationButtons = new Vibration(this, true);
        readParams();
    }

    @Override
    protected void onStop() {
        super.onStop();
        writeParams();
        soundButtons.release();
    }

    @Override
    protected void onResume() {
        super.onResume();
        readParams();
        soundButtons = new Sound(this, true);
    }

    public void changeActivity(View v) {
        final Animation animScale = AnimationUtils.loadAnimation(this, R.anim.scale);
        v.startAnimation(animScale);
        Button button = (Button) v;
        Intent web = new Intent(MainActivity.this, WebActivity.class);
        if (sound) {
            web.putExtra("Sound", "on");
            soundButtons.play("tap");
        } else web.putExtra("Sound", "off");

        if (vibration) {
            web.putExtra("Vibration", "on");
            vibrationButtons.vibrate(Vibration.VIBRATION_SHORT);
        } else web.putExtra("Vibration", "off");

        switch (button.getId()) {
            case R.id.mvsa:
                web.putExtra("URL", "file:///android_asset/www/setting_man.html");
                break;
            case R.id.mvsm:
                web.putExtra("URL", "file:///android_asset/www/setting_man1.html");
                break;
            case R.id.continueGame:
                web.putExtra("URL", "file:///android_asset/www/continue.html");
                break;
        }
        startActivity(web);
    }

    private void readParams() {
        if (settings.contains(APP_PREFERENCES_SOUND)) {
            sound = settings.getBoolean(APP_PREFERENCES_SOUND, true);
        }
        if (settings.contains(APP_PREFERENCES_VIBRATION)) {
            vibration = settings.getBoolean(APP_PREFERENCES_VIBRATION, true);
        }
    }

    private void writeParams() {
        editor.putBoolean(APP_PREFERENCES_SOUND, sound);
        editor.putBoolean(APP_PREFERENCES_VIBRATION, vibration);
        editor.apply();
    }

    public void setSound() {
        sound = !sound;
        if (sound)
            soundButtons.play("message");
        else
            soundButtons.play("tap");
    }

    public void setVibration() {
        vibration = !vibration;
        if (vibration)
            vibrationButtons.vibrate(Vibration.VIBRATION_LONG);
        else
            vibrationButtons.vibrate(Vibration.VIBRATION_SHORT);
    }

    public void settings(View v) {
        final Animation animScale = AnimationUtils.loadAnimation(this, R.anim.scale);
        v.startAnimation(animScale);

        if (sound)
            soundButtons.play("tap");
        if (vibration)
            vibrationButtons.vibrate(Vibration.VIBRATION_SHORT);

        final View settingsView = getLayoutInflater().inflate(R.layout.settings, null);
        final Switch soundSwitch = settingsView.findViewById(R.id.soundSwitch);
        soundSwitch.setChecked(sound);
        soundSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                setSound();
            }
        });

        final Switch vibrationSwitch = settingsView.findViewById(R.id.vibrationSwitch);
        vibrationSwitch.setChecked(vibration);
        vibrationSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                setVibration();
            }
        });

        new AlertDialog.Builder(this)
                .setPositiveButton("OK",
                        new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                sound = soundSwitch.isChecked();
                                vibration = vibrationSwitch.isChecked();
                                if (sound)
                                    soundButtons.play("tap");
                                if (vibration)
                                    vibrationButtons.vibrate(Vibration.VIBRATION_SHORT);
                            }
                        })
                .setView(settingsView)
                .setTitle(R.string.Settings)
                .setIcon(R.drawable.settings)
                .create()
                .show();
    }
}