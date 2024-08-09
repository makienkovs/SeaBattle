plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.gms.google-services")
    id("com.google.firebase.crashlytics")
    id("kotlin-kapt")
    id("com.google.secrets_gradle_plugin") version "0.6.1"
}

android {
    namespace = "com.makienkovs.seabattle"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.makienkovs.seabattle"
        minSdk = 24
        targetSdk = 34
        versionCode = 21
        versionName = "1.1.1"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        setProperty("archivesBaseName", "SeaBattle_${versionName}_${name}")
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

        applicationVariants.all {
            val variant = this
            variant.outputs
                .map { it as com.android.build.gradle.internal.api.BaseVariantOutputImpl }
                .forEach { output ->
                    val outputFileName =
                        "SeaBattle_${variant.versionName}_${variant.buildType.name}.apk"
                    println("OutputFileName: $outputFileName")
                    output.outputFileName = outputFileName
                }
        }

        compileOptions {
            sourceCompatibility = JavaVersion.VERSION_17
            targetCompatibility = JavaVersion.VERSION_17
        }
        kotlinOptions {
            jvmTarget = "17"
        }
        buildFeatures {
            buildConfig = true
            dataBinding = true
            viewBinding = true
        }
        composeOptions {
            kotlinCompilerExtensionVersion = "1.4.3"
        }
        packaging {
            resources {
                excludes += "/META-INF/{AL2.0,LGPL2.1}"
            }
        }
    }
}

dependencies {
    implementation(platform("org.jetbrains.kotlin:kotlin-bom:2.0.0"))
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("com.google.android.material:material:1.12.0")
    implementation("androidx.legacy:legacy-support-v4:1.0.0")
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
    implementation("androidx.window:window:1.3.0")
    implementation("com.android.databinding:viewbinding:8.5.0")

    implementation("androidx.lifecycle:lifecycle-extensions:2.2.0")

    implementation(platform("com.google.firebase:firebase-bom:33.1.1"))
    implementation("com.google.firebase:firebase-crashlytics-ktx:19.0.2")
    implementation("com.google.firebase:firebase-analytics-ktx:22.0.2")

    //Yandex Ads
    implementation("com.yandex.android:mobileads:7.3.0")

    //Image
    implementation("com.squareup.picasso:picasso:2.71828")

    //Rustore updates
    implementation("ru.rustore.sdk:appupdate:2.0.0")

    //Google updates
    implementation("com.google.android.play:app-update-ktx:2.1.0")
}
