plugins {
    id("com.android.application")
    id("com.google.gms.google-services")
    id("com.google.firebase.crashlytics")
    id("com.android.legacy-kapt")
    id("com.google.secrets_gradle_plugin") version "0.6.1"
}

android {
    namespace = "com.makienkovs.seabattle"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.makienkovs.seabattle"
        minSdk = 29
        targetSdk = 36
        versionCode = 23
        versionName = "1.1.3"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            isDebuggable = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            buildConfigField(type = "String", name = "STORE_TYPE", value = "\"RELEASE\"")
        }

        debug {
            isDebuggable = true
            buildConfigField(type = "String", name = "STORE_TYPE", value = "\"DEBUG\"")
        }

        create("google") {
            initWith(getByName("release"))
            buildConfigField(type = "String", name = "STORE_TYPE", value = "\"GOOGLE\"")
        }

        create("rustore") {
            initWith(getByName("release"))
            buildConfigField(type = "String", name = "STORE_TYPE", value = "\"RUSTORE\"")
        }

        create("nashstore") {
            initWith(getByName("release"))
            buildConfigField(type = "String", name = "STORE_TYPE", value = "\"NASHSTORE\"")
        }

        androidComponents {
            onVariants { variant ->
                variant.outputs
                    .map { it as com.android.build.api.variant.impl.VariantOutputImpl }
                    .forEach { output ->
                        val outputFileName = "SeaBattle_${output.baseName}_${output.versionName.get()}.apk"
                        println("OutputFileName: $outputFileName")
                        output.outputFileName = outputFileName
                    }
            }
        }

        compileOptions {
            sourceCompatibility = JavaVersion.VERSION_17
            targetCompatibility = JavaVersion.VERSION_17
        }
        buildFeatures {
            buildConfig = true
            dataBinding = true
            viewBinding = true
        }
        composeOptions {
            kotlinCompilerExtensionVersion = "1.5.4"
        }
        packaging {
            resources {
                excludes += "/META-INF/{AL2.0,LGPL2.1}"
            }
        }
        lint {
            baseline = file("lint-baseline.xml")
        }
    }
}

dependencies {
    implementation(platform("org.jetbrains.kotlin:kotlin-bom:2.1.0"))
    implementation("androidx.core:core-ktx:1.17.0")
    implementation("androidx.appcompat:appcompat:1.7.1")
    implementation("com.google.android.material:material:1.13.0")
    implementation("androidx.legacy:legacy-support-v4:1.0.0")
    implementation("androidx.window:window:1.5.1")
    implementation("com.android.databinding:viewbinding:9.0.1")

    implementation("androidx.lifecycle:lifecycle-extensions:2.2.0")

    implementation(platform("com.google.firebase:firebase-bom:34.10.0"))
    implementation("com.google.firebase:firebase-crashlytics-ktx:19.4.4")
    implementation("com.google.firebase:firebase-analytics-ktx:22.5.0")

    //Yandex Ads
    implementation("com.yandex.android:mobileads:7.18.2")

    //Rustore updates
    implementation("ru.rustore.sdk:appupdate:6.0.0")

    //Google updates
    implementation("com.google.android.play:app-update-ktx:2.1.0")
}
