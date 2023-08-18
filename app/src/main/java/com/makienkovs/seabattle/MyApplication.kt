package com.makienkovs.seabattle

import android.app.Application
import android.util.Log
import com.google.firebase.FirebaseApp
import com.google.firebase.crashlytics.FirebaseCrashlytics
import com.yandex.mobile.ads.common.MobileAds

class MyApplication: Application() {

    override fun onCreate() {
        super.onCreate()

        FirebaseApp.initializeApp(this)
        MobileAds.initialize(this) {
            Log.d("MyApplication", "SDK initialized");
        }
    }
}