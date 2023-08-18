package com.makienkovs.seabattle;

import android.content.Context;
import android.os.Vibrator;

public class Vibration {
    private final Context context;
    private final boolean vibration;

    final static int VIBRATION_SHORT = 50;
    final static int VIBRATION_LONG = 500;

    Vibration(Context context, boolean vibration) {
        this.context = context;
        this.vibration = vibration;
    }

    void vibrate(int duration) {
        Vibrator vibrator = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
        assert vibrator != null;
        if (vibrator.hasVibrator() && vibration) {
            vibrator.vibrate(duration);
        }
    }
}
