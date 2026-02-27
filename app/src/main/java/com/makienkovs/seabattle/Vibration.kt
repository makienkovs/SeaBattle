package com.makienkovs.seabattle

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.Manifest
import android.os.VibratorManager
import androidx.annotation.RequiresPermission

@Suppress("DEPRECATION")
class Vibration(private val context: Context, private val vibration: Boolean) {

    companion object {
        const val VIBRATION_SHORT = 50
        const val VIBRATION_LONG = 500
    }

    @RequiresPermission(Manifest.permission.VIBRATE)
    fun vibrate(duration: Int) {
        val vibrator: Vibrator? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = context.getSystemService(VibratorManager::class.java) as VibratorManager
            vibratorManager.defaultVibrator
        } else {
            context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }

        if (vibrator != null && vibrator.hasVibrator() && this.vibration) {
            vibrator.vibrate(
                VibrationEffect.createOneShot(
                    duration.toLong(),
                    VibrationEffect.DEFAULT_AMPLITUDE
                )
            )
        }
    }
}