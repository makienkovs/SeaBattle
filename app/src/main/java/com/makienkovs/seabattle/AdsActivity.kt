package com.makienkovs.seabattle

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isGone
import com.google.firebase.crashlytics.ktx.crashlytics
import com.google.firebase.ktx.Firebase
import com.yandex.mobile.ads.common.AdRequest
import com.yandex.mobile.ads.common.AdRequestError
import com.yandex.mobile.ads.common.ImpressionData
import com.yandex.mobile.ads.interstitial.InterstitialAd
import com.yandex.mobile.ads.interstitial.InterstitialAdEventListener

class AdsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_ads)
        window.navigationBarColor = Color.BLACK
        val info = intent.getStringExtra("info") ?: "0"
        val progress: ProgressBar = findViewById(R.id.ads_progress)
        val mInterstitialAd = InterstitialAd(this)
        mInterstitialAd.setAdUnitId(getString(R.string.ads_id))
        val adRequest = AdRequest.Builder().build()
        var isShow = false
        mInterstitialAd.setInterstitialAdEventListener( object : InterstitialAdEventListener{
            override fun onAdLoaded() {
                Log.d("AdsActivity", "onAdLoaded")
                isShow = true
                progress.isGone = true
                mInterstitialAd.show()
            }

            override fun onAdFailedToLoad(error: AdRequestError) {
                Log.d("AdsActivity", "AdRequestError ${error.description}")
                Firebase.crashlytics.recordException(IllegalStateException("AdRequestError ${error.description}"))
                continueGame(info)
            }

            override fun onAdShown() {
                Log.d("AdsActivity", "onAdShown")
            }

            override fun onAdDismissed() {
                Log.d("AdsActivity", "onAdDismissed")
                continueGame(info)
            }

            override fun onAdClicked() {
                Log.d("AdsActivity", "onAdClicked")
            }

            override fun onLeftApplication() {
                Log.d("AdsActivity", "onLeftApplication")
            }

            override fun onReturnedToApplication() {
                Log.d("AdsActivity", "onReturnedToApplication")
            }

            override fun onImpression(impressionData: ImpressionData?) {
                Log.d("AdsActivity", "ImpressionData ${impressionData?.rawData}")
            }
        })
        mInterstitialAd.loadAd(adRequest)
        Handler(Looper.getMainLooper()).postDelayed({
             if (!isShow) {
                 continueGame(info)
             }
        }, 5000)
    }

    private fun continueGame(info: String) {
        val web = Intent(this@AdsActivity, WebActivity::class.java)
        if (MainActivity.sound) {
            web.putExtra("Sound", "on")
        } else web.putExtra("Sound", "off")

        if (MainActivity.vibration) {
            web.putExtra("Vibration", "on")
        } else web.putExtra("Vibration", "off")

        when (info) {
            "0" -> web.putExtra("URL", "file:///android_asset/www/setting_man.html")
            "1" -> web.putExtra("URL", "file:///android_asset/www/setting_man1.html")
        }
        startActivity(web)
        finish()
    }
}