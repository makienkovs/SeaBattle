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

enum class AppStore {
    GOOGLE,
    RUSTORE,
    NASHSTORE
}

class UpdateUtil(private val activity: AppCompatActivity) {

    companion object {
        private const val RC_APP_UPDATE = 121
        private const val TAG = "UpdateUtil"
        val appStore = AppStore.GOOGLE
    }

    private var googleUpdateManager: AppUpdateManager? = null
    private var rustoreUpdateManager: RuStoreAppUpdateManager? = null

    init {
        activity.lifecycle.addObserver(object : LifecycleEventObserver {
            override fun onStateChanged(source: LifecycleOwner, event: Lifecycle.Event) {
                if (event == Lifecycle.Event.ON_CREATE) {
                    when (appStore) {
                        AppStore.GOOGLE -> checkUpdatesGoogle()
                        AppStore.RUSTORE -> checkUpdatesRustore()
                        else -> Log.d(TAG, "NO IN APP UPDATE")
                    }
                }
            }
        })
    }

    private fun checkUpdatesRustore() {
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
        googleUpdateManager = AppUpdateManagerFactory.create(activity)
        googleUpdateManager?.appUpdateInfo?.addOnSuccessListener { appUpdateInfo: AppUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                Log.d(TAG, "UpdateAvailability.UPDATE_AVAILABLE && AppUpdateType.IMMEDIATE")
                try {
                    googleUpdateManager?.startUpdateFlowForResult(
                        appUpdateInfo,
                        activity,
                        AppUpdateOptions.newBuilder(AppUpdateType.IMMEDIATE).build(),
                        RC_APP_UPDATE
                    )
                    Log.d(TAG, "mAppUpdateManager.startUpdateFlowForResult: something else")
                } catch (e: SendIntentException) {
                    Log.d(TAG, "IntentSender.SendIntentException: " + e.message)
                }
            } else if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
                Log.d(TAG, "appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED")
                googleUpdateManager?.completeUpdate()
            } else {
                Log.d(TAG, "checkForAppUpdateAvailability: something else " + appUpdateInfo.updateAvailability())
            }
        }
    }
}