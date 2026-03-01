package com.makienkovs.seabattle

import android.annotation.SuppressLint
import android.os.Build
import android.view.View
import android.view.WindowInsets
import androidx.core.view.ViewCompat

@SuppressLint("WrongConstant")
fun setEdgeToEdge(rootView: View) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        ViewCompat.setOnApplyWindowInsetsListener(rootView) { _, insets ->
            val systemBars = insets.getInsets(WindowInsets.Type.systemBars())
            val displayCutout = insets.getInsets(WindowInsets.Type.displayCutout())

            val left = maxOf(systemBars.left, displayCutout.left)
            val top = maxOf(systemBars.top, displayCutout.top)
            val right = maxOf(systemBars.right, displayCutout.right)
            val bottom = maxOf(systemBars.bottom, displayCutout.bottom)
            rootView.setPadding(left, top, right, bottom)
            insets
        }
    }
}