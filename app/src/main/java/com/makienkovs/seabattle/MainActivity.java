package com.makienkovs.seabattle;

import static com.makienkovs.seabattle.ExtensionsKt.setEdgeToEdge;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SwitchCompat;
import androidx.constraintlayout.widget.ConstraintLayout;

public class MainActivity extends AppCompatActivity {
    public static boolean sound = true;
    public static boolean vibration = true;
    public static final String APP_PREFERENCES = "settings";
    public static final String APP_PREFERENCES_SOUND = "sound";
    public static final String APP_PREFERENCES_VIBRATION = "vibration";
    private SharedPreferences settings;
    private SharedPreferences.Editor editor;
    private Sound soundButtons;
    private Vibration vibrationButtons;

    @SuppressLint({"SourceLockedOrientationActivity", "CommitPrefEdits"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        setContentView(R.layout.activity_main);
        ConstraintLayout layout = findViewById(R.id.main_all);
        setEdgeToEdge(layout);

        new UpdateUtil(this);
        settings = getSharedPreferences(APP_PREFERENCES, Context.MODE_PRIVATE);
        editor = settings.edit();
        soundButtons = new Sound(this, true);
        vibrationButtons = new Vibration(this, true);

        findViewById(R.id.mvsa).setOnClickListener(v -> changeActivity(v, "file:///android_asset/www/setting_man.html"));
        findViewById(R.id.mvsm).setOnClickListener(v -> changeActivity(v, "file:///android_asset/www/setting_man1.html"));
        findViewById(R.id.continueGame).setOnClickListener(v -> changeActivity(v, "file:///android_asset/www/continue.html"));
        readParams();
    }

    @Override
    protected void onStop() {
        super.onStop();
        writeParams();
        if (soundButtons != null) {
            soundButtons.release();
        }
    }

    @Override
    protected void onStart() {
        super.onStart();
        readParams();
        soundButtons = new Sound(this, true);
    }

    @SuppressLint("NonConstantResourceId")
    public void changeActivity(@NonNull View v, String url) {
        final Animation animScale = AnimationUtils.loadAnimation(this, R.anim.scale);
        v.startAnimation(animScale);
        Intent web = new Intent(MainActivity.this, WebActivity.class);
        if (sound) {
            web.putExtra("Sound", "on");
            soundButtons.play("tap");
        } else web.putExtra("Sound", "off");

        if (vibration) {
            web.putExtra("Vibration", "on");
            vibrationButtons.vibrate(Vibration.VIBRATION_SHORT);
        } else web.putExtra("Vibration", "off");

        web.putExtra("URL", url);
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
        if (editor != null) {
            editor.putBoolean(APP_PREFERENCES_SOUND, sound);
            editor.putBoolean(APP_PREFERENCES_VIBRATION, vibration);
            editor.apply();
        }
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

    public void settings(@NonNull View v) {
        final Animation animScale = AnimationUtils.loadAnimation(this, R.anim.scale);
        v.startAnimation(animScale);

        if (sound)
            soundButtons.play("tap");
        if (vibration)
            vibrationButtons.vibrate(Vibration.VIBRATION_SHORT);

        final View settingsView = getLayoutInflater().inflate(R.layout.settings, null);
        final SwitchCompat soundSwitch = settingsView.findViewById(R.id.soundSwitch);
        soundSwitch.setChecked(sound);
        soundSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> setSound());

        final SwitchCompat vibrationSwitch = settingsView.findViewById(R.id.vibrationSwitch);
        vibrationSwitch.setChecked(vibration);
        vibrationSwitch.setOnCheckedChangeListener((buttonView, isChecked) -> setVibration());

        new AlertDialog.Builder(this)
                .setPositiveButton("OK",
                        (dialog, which) -> {
                            sound = soundSwitch.isChecked();
                            vibration = vibrationSwitch.isChecked();
                            if (sound)
                                soundButtons.play("tap");
                            if (vibration)
                                vibrationButtons.vibrate(Vibration.VIBRATION_SHORT);
                        })
                .setView(settingsView)
                .setTitle(R.string.Settings)
                .setIcon(R.drawable.settings)
                .create()
                .show();
    }
}