# Beacon Business — Android Studio project

Package: `com.beaconoftheeagle.businessmanager`. English first launch, optional Spanish and Italian. API 26 minimum; target/compile API 36. Java 17 source compatibility. Android Gradle Plugin 8.13.2, Gradle 8.13, AndroidX WebKit 1.14.0.

Open this directory in Android Studio. Install Android SDK Platform 36 and Build Tools 36.0.0. The Gradle wrapper downloads the standard Gradle distribution. The preBuild task copies the sibling `../dist` web application into generated assets. Keep the web source directory beside this project.

Build an APK: `./gradlew :app:assembleDebug`. Build a Play bundle: `./gradlew :app:bundleRelease`. Release signing requires the private upload key backup and these environment variables: BEACON_UPLOAD_KEYSTORE, BEACON_UPLOAD_STORE_PASSWORD, BEACON_UPLOAD_KEY_ALIAS, BEACON_UPLOAD_KEY_PASSWORD. Do not put their values in source control. Without signing inputs, release output is unsigned and is not ready to upload.

The app loads bundled content through WebViewAssetLoader at a fixed local HTTPS origin. No INTERNET permission or remote navigation is permitted. JavaScript and DOM storage support the local business application. The native bridge uses the Android document picker to export or restore JSON backups and save CSV reports. Android automatic backup is disabled. No analytics or advertising SDK is included.

## Versión 1.0.2 para Android

El código de versión es 3. La compilación de prueba se identifica como **Beacon Business · Prueba** en Android configurado en español y usa el paquete `com.beaconoftheeagle.businessmanager.debug`. Se puede instalar junto a la aplicación de Google Play. Cada instalación guarda sus propios datos.

Con un dispositivo de pruebas conectado por USB, ejecuta `./gradlew :app:installDebug`. Comprueba que el panel funciona en modo avión, que permite registrar un ingreso y un gasto, y que los datos persisten al cerrar y volver a abrir la app. Exporta una copia JSON y un informe CSV con el selector de documentos de Android. Abre la copia desde la app, revisa las cantidades antes de restaurar y verifica el resultado en el panel.

Para preparar la distribución genera el AAB con `./gradlew :app:bundleRelease`. La salida está en `app/build/outputs/bundle/release/`. Para subirlo a la ficha existente se necesita la firma de la clave de carga registrada en Play Console.
