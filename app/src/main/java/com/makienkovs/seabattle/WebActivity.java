package com.makienkovs.seabattle;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.content.pm.ActivityInfo;
import android.os.Bundle;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class WebActivity extends AppCompatActivity {

    WebApp webApp;

    @SuppressLint({"SourceLockedOrientationActivity", "SetJavaScriptEnabled"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web);
        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        WebView webView = findViewById(R.id.web);
        String url = getIntent().getStringExtra("URL");
        String sound = getIntent().getStringExtra("Sound");
        String vibration = getIntent().getStringExtra("Vibration");
        webApp = new WebApp(this, sound, vibration);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onJsAlert(WebView view, String url, String message, JsResult result)
            { return super.onJsAlert(view, url, message, result); } });
        webView.addJavascriptInterface(webApp, "Android");
        webView.loadUrl(url);
    }

    @Override
    protected void onStop() {
        super.onStop();
        webApp.release();
    }

    @Override
    protected void onResume() {
        super.onResume();
        webApp.initParams();
    }
}
