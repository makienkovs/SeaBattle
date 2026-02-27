package com.makienkovs.seabattle

import android.content.Intent
import android.content.pm.ActivityInfo
import android.graphics.Color
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.ProgressBar
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isGone
import com.yandex.mobile.ads.common.AdError
import com.yandex.mobile.ads.common.AdRequestConfiguration
import com.yandex.mobile.ads.common.AdRequestError
import com.yandex.mobile.ads.common.ImpressionData
import com.yandex.mobile.ads.interstitial.InterstitialAd
import com.yandex.mobile.ads.interstitial.InterstitialAdEventListener
import com.yandex.mobile.ads.interstitial.InterstitialAdLoadListener
import com.yandex.mobile.ads.interstitial.InterstitialAdLoader

class AdsActivity : AppCompatActivity() {

    private var mInterstitialAd: InterstitialAd? = null
    private var mInterstitialAdLoader: InterstitialAdLoader? = null

    @Suppress("DEPRECATION")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE
        setContentView(R.layout.activity_ads)
        window.navigationBarColor = Color.BLACK
        val info = intent.getStringExtra("info") ?: "0"
        val progress: ProgressBar = findViewById(R.id.ads_progress)
        var isShow = false

        mInterstitialAdLoader = InterstitialAdLoader(this).apply {
            setAdLoadListener(object : InterstitialAdLoadListener {
                override fun onAdLoaded(interstitialAd: InterstitialAd) {
                    Log.d("AdsActivity", "onAdLoaded")
                    mInterstitialAd = interstitialAd
                    isShow = true
                    progress.isGone = true
                    interstitialAd.show(this@AdsActivity)
                    interstitialAd.setAdEventListener(object : InterstitialAdEventListener {
                        override fun onAdShown() {
                            Log.d("AdsActivity", "onAdShown")
                        }

                        override fun onAdFailedToShow(adError: AdError) {
                            Log.d("AdsActivity", "onAdFailedToShow")
                        }

                        override fun onAdDismissed() {
                            Log.d("AdsActivity", "onAdDismissed")
                            continueGame(info)
                        }

                        override fun onAdClicked() {
                            Log.d("AdsActivity", "onAdClicked")
                        }

                        override fun onAdImpression(impressionData: ImpressionData?) {
                            Log.d("AdsActivity", "ImpressionData ${impressionData?.rawData}")
                        }
                    })
                }

                override fun onAdFailedToLoad(error: AdRequestError) {
                    Log.d("AdsActivity", "AdRequestError ${error.description}")
                    continueGame(info)
                }
            })
        }
        val adRequestConfiguration = AdRequestConfiguration.Builder(getString(R.string.ads_id)).build()
        mInterstitialAdLoader?.loadAd(adRequestConfiguration)

        Handler(Looper.getMainLooper()).postDelayed({
             if (!isShow) {
                 continueGame(info)
             }
        }, 5000)
    }

    override fun onDestroy() {
        super.onDestroy()
        mInterstitialAdLoader?.setAdLoadListener(null)
        mInterstitialAdLoader = null
        mInterstitialAd?.setAdEventListener(null)
        mInterstitialAd = null
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