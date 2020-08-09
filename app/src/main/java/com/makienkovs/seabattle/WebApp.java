package com.makienkovs.seabattle;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.view.Gravity;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

public class WebApp {
    private Context mContext;
    private String sound;
    private String vibration;
    private Sound soundFX;
    private Vibration vibrationFX;

    /**
     * Instantiate the interface and set the context
     */
    WebApp(Context c, String sound, String vibration) {
        mContext = c;
        this.sound = sound;
        this.vibration = vibration;
        initParams();
    }

    void initParams() {
        if (sound.equals("on"))
            soundFX = new Sound(mContext, true);
        else
            soundFX = new Sound(mContext, false);

        if (vibration.equals("on"))
            vibrationFX = new Vibration(mContext, true);
        else
            vibrationFX = new Vibration(mContext, false);
    }

    void release() {
        soundFX.release();
    }

    /**
     * Return titles of game area
     */
    @JavascriptInterface
    public String getTitles(String title) {
        String Pwa = mContext.getResources().getString(R.string.Pwa);
        String Awa = mContext.getResources().getString(R.string.Awa);
        String Fpwa = mContext.getResources().getString(R.string.Fpwa);
        String Spwa = mContext.getResources().getString(R.string.Spwa);
        String Pv = mContext.getResources().getString(R.string.Pv);
        String Av = mContext.getResources().getString(R.string.Av);
        String Fpv = mContext.getResources().getString(R.string.Fpv);
        String Spv = mContext.getResources().getString(R.string.Spv);
        switch (title) {
            case "Pwa": return Pwa;
            case "Awa": return Awa;
            case "Fpwa": return Fpwa;
            case "Spwa": return Spwa;
            case "Pv": return Pv;
            case "Av": return Av;
            case "Fpv": return Fpv;
            case "Spv": return Spv;
            default: return "undefined";
        }
    }

    /**
     * Show a toast from the web page
     */

    @JavascriptInterface
    public void cantRotate() {
        Toast toast = Toast.makeText(mContext, R.string.CantRotate, Toast.LENGTH_SHORT);
        toast.setGravity(Gravity.CENTER, 0, 0);
        toast.show();
        vibrateLong();
    }

    @JavascriptInterface
    public void showWin() {
        Toast toast = Toast.makeText(mContext, R.string.Win, Toast.LENGTH_LONG);
        toast.setGravity(Gravity.CENTER, 0, 0);
        toast.show();
        vibrateLong();
    }

    @JavascriptInterface
    public void showLose() {
        Toast toast = Toast.makeText(mContext, R.string.Lose, Toast.LENGTH_LONG);
        toast.setGravity(Gravity.CENTER, 0, 0);
        toast.show();
        vibrateLong();
    }

    @JavascriptInterface
    public void showLFpw() {
        Toast toast = Toast.makeText(mContext, R.string.Fpw, Toast.LENGTH_LONG);
        toast.setGravity(Gravity.CENTER, 0, 0);
        toast.show();
        vibrateLong();
    }

    @JavascriptInterface
    public void showLSpw() {
        Toast toast = Toast.makeText(mContext, R.string.Spw, Toast.LENGTH_LONG);
        toast.setGravity(Gravity.CENTER, 0, 0);
        toast.show();
        vibrateLong();
    }

    /**
     * Show a dialog
     */
    @JavascriptInterface
    public void information() {
        new AlertDialog.Builder(mContext)
                .setMessage(R.string.NoGame)
                .setCancelable(false)
                .setTitle(R.string.Info)
                .setIcon(R.drawable.info)
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        WebActivity webActivity = (WebActivity) mContext;
                        webActivity.finish();
                        vibrateShort();
                        play("tap");
                    }
                })
                .create()
                .show();
    }

    @JavascriptInterface
    public void rules() {
        new AlertDialog.Builder(mContext)
                .setMessage(R.string.Rules)
                .setCancelable(false)
                .setTitle(R.string.RulesTitle)
                .setIcon(R.drawable.rules)
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        vibrateShort();
                        play("tap");
                    }
                })
                .create()
                .show();
    }

    /**
     * Make a vibration on web page
     */
    @JavascriptInterface
    public void vibrateShort() {
        vibrationFX.vibrate(Vibration.VIBRATION_SHORT);
    }

    @JavascriptInterface
    public void vibrateLong() {
        vibrationFX.vibrate(Vibration.VIBRATION_LONG);
    }

    /**
     * Make a sound on web page
     */
    @JavascriptInterface
    public void play(String soundName) {
        soundFX.play(soundName);
    }
}
