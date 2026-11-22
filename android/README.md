# Beacon Business — Android Studio project

Package: `com.beaconoftheeagle.businessmanager`. English first launch, optional Spanish and Italian. API 26 minimum; target/compile API 36. Java 17 source compatibility. Android Gradle Plugin 8.13.2, Gradle 8.13, AndroidX WebKit 1.14.0.

Open this directory in Android Studio. Install Android SDK Platform 36 and Build Tools 36.0.0. The Gradle wrapper downloads the standard Gradle distribution. The preBuild task copies the sibling `../dist` web application into generated assets. Keep the web source directory beside this project.

Build an APK: `./gradlew :app:assembleDebug`. Build a Play bundle: `./gradlew :app:bundleRelease`. Release signing requires the private upload key backup and these environment variables: BEACON_UPLOAD_KEYSTORE, BEACON_UPLOAD_STORE_PASSWORD, BEACON_UPLOAD_KEY_ALIAS, BEACON_UPLOAD_KEY_PASSWORD. Do not put their values in source control. Without signing inputs, release output is unsigned and is not ready to upload.

The app loads bundled content through WebViewAssetLoader at a fixed local HTTPS origin. No INTERNET permission or remote navigation is permitted. JavaScript and DOM storage support the local business application. The only native JavaScript bridge opens the system document picker for a user-requested JSON backup; it has no arbitrary file-read or network interface. Android automatic backup is disabled. No analytics or advertising SDK is included.

The release package is an initial build. Use internal testing and verify behavior on supported devices before production.
