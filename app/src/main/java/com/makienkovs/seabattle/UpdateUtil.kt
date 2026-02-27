package com.makienkovs.seabattle

import android.content.IntentSender.SendIntentException
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleOwner
import com.google.android.play.core.appupdate.AppUpdateInfo
import com.google.android.play.core.appupdate.AppUpdateManager
import com.google.android.play.core.appupdate.AppUpdateManagerFactory
import com.google.android.play.core.appupdate.AppUpdateOptions
import com.google.android.play.core.install.model.AppUpdateType
import com.google.android.play.core.install.model.InstallStatus
import com.google.android.play.core.install.model.UpdateAvailability
import ru.rustore.sdk.appupdate.manager.RuStoreAppUpdateManager
import ru.rustore.sdk.appupdate.manager.factory.RuStoreAppUpdateManagerFactory

class UpdateUtil(private val activity: AppCompatActivity) {

    companion object {
        private const val RC_APP_UPDATE = 121
        private const val TAG = "UpdateUtil"
    }

    private var googleUpdateManager: AppUpdateManager? = null
    private var rustoreUpdateManager: RuStoreAppUpdateManager? = null

    init {
        Log.d(TAG, "UpdateUtil init")
        @Suppress("KotlinConstantConditions")
        activity.lifecycle.addObserver(object : LifecycleEventObserver {
            override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
                if (event == Lifecycle.Event.ON_CREATE) {
                    when (BuildConfig.STORE_TYPE) {
                        "GOOGLE" -> checkUpdatesGoogle()
                        "RUSTORE" -> checkUpdatesRustore()
                        else -> Log.d(TAG, "NO IN APP UPDATE")
                    }
                }
            }
        })
    }

    private fun checkUpdatesRustore() {
        Log.d(TAG, "checkUpdatesRustore")
        rustoreUpdateManager = RuStoreAppUpdateManagerFactory.create(activity)
        rustoreUpdateManager?.getAppUpdateInfo()
            ?.addOnSuccessListener { appUpdateInfo ->
                if (appUpdateInfo.updateAvailability == ru.rustore.sdk.appupdate.model.UpdateAvailability.UPDATE_AVAILABLE) {
                    Log.d(TAG, "checkUpdatesRustore UPDATE_AVAILABLE")
                    try {
                        rustoreUpdateManager?.startUpdateFlow(
                            appUpdateInfo,
                            ru.rustore.sdk.appupdate.model.AppUpdateOptions.Builder()
                                .appUpdateType(ru.rustore.sdk.appupdate.model.AppUpdateType.IMMEDIATE)
                                .build()
                        )?.addOnSuccessListener { resultCode ->
                            Log.d(TAG, "checkUpdatesRustore addOnSuccessListener resultCode $resultCode")
                        }
                    } catch (e: Exception) {
                        Log.d(TAG, "checkUpdatesRustore Exception: " + e.message)
                    }
                }
            }
            ?.addOnFailureListener { error ->
                Log.d(TAG, "checkUpdatesRustore addOnFailureListener error: $error")
            }
    }


    private fun checkUpdatesGoogle() {
        Log.d(TAG, "checkUpdatesGoogle")
        googleUpdateManager = AppUpdateManagerFactory.create(activity)
        Log.d(TAG, "$googleUpdateManager")
        googleUpdateManager?.appUpdateInfo?.addOnSuccessListener { appUpdateInfo: AppUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                Log.d(TAG, "checkUpdatesGoogle UPDATE_AVAILABLE")
                try {
                    googleUpdateManager?.startUpdateFlowForResult(
                        appUpdateInfo,
                        activity,
                        AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build(),
                        RC_APP_UPDATE
                    )
                    Log.d(TAG, "checkUpdatesGoogle startUpdateFlowForResult")
                } catch (e: SendIntentException) {
                    Log.d(TAG, "checkUpdatesGoogle SendIntentException: ${e.message}")
                }
            } else if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
                Log.d(TAG, "checkUpdatesGoogle DOWNLOADED")
                googleUpdateManager?.completeUpdate()
            } else {
                Log.d(TAG, "checkUpdatesGoogle: something else ${appUpdateInfo.updateAvailability()}")
            }
        }?.addOnFailureListener { error ->
            Log.d(TAG, "checkUpdatesGoogle addOnFailureListener error: $error")
        }
    }
}