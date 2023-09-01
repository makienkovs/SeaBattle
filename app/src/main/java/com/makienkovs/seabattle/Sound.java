package com.makienkovs.seabattle;

import android.content.Context;
import android.media.AudioAttributes;
import android.media.SoundPool;
import android.util.Log;

import androidx.annotation.NonNull;

public class Sound {
    private final boolean sound;
    private SoundPool sounds;
    private int winSound;
    private int loseSound;
    private int awaySound;
    private int clickSound;
    private int clickclackSound;
    private int hitSound;
    private int setSound;
    private int messageSound;
    private int tapSound;
    private int destroySound;
    private final Context context;

    Sound(Context context, boolean sound) {
        this.context = context;
        this.sound = sound;
        createSoundPool();
    }

    private void createSoundPool() {
        AudioAttributes attributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build();
        sounds = new SoundPool.Builder()
                .setAudioAttributes(attributes)
                .setMaxStreams(20)
                .build();

        winSound = sounds.load(context, R.raw.win, 1);
        loseSound = sounds.load(context, R.raw.lose, 1);
        awaySound = sounds.load(context, R.raw.away, 1);
        clickSound = sounds.load(context, R.raw.click, 1);
        clickclackSound = sounds.load(context, R.raw.clickclack, 1);
        setSound = sounds.load(context, R.raw.set, 1);
        hitSound = sounds.load(context, R.raw.hit, 1);
        messageSound = sounds.load(context, R.raw.message, 1);
        tapSound = sounds.load(context, R.raw.tap, 1);
        destroySound = sounds.load(context, R.raw.destroy, 1);
    }

    void play(@NonNull String soundName) {
        int s;
        switch (soundName) {
            case "win" -> s = winSound;
            case "lose" -> s = loseSound;
            case "away" -> s = awaySound;
            case "click" -> s = clickSound;
            case "clickclack" -> s = clickclackSound;
            case "set" -> s = setSound;
            case "hit" -> s = hitSound;
            case "message" -> s = messageSound;
            case "tap" -> s = tapSound;
            case "destroy" -> s = destroySound;
            default -> {
                s = 0;
                Log.d("Unexpected value: ", "" + soundName);
            }
        }

        if (s > 0 && sound) {
            float volume = 1;
            try {
                sounds.play(s, volume, volume, 1, 0, 1);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    void release() {
        if (sounds != null) {
            sounds.release();
            sounds = null;
        }
    }
}
