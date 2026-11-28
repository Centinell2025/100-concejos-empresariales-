# Beacon Business 1.0.4

Android package `com.beaconoftheeagle.businessmanager`, version code 5.

## Google Play release notes

**en-US** — The welcome screen and dashboard identify Beacon of the Eagle LLC as the company behind Beacon Business. The library and each tip now credit the company for the selection and original text of the 100 Business Tips collection.

**es-ES** — La portada y el panel identifican a Beacon of the Eagle LLC como la empresa responsable de Beacon Business. La biblioteca y cada consejo reconocen a la empresa por la selección y los textos originales de la colección «100 consejos empresariales».

**it-IT** — La schermata di benvenuto e il pannello indicano Beacon of the Eagle LLC come l’azienda che pubblica Beacon Business. La biblioteca e ogni consiglio attribuiscono all’azienda la selezione e i testi originali della raccolta «100 consigli aziendali».

## Android release files

| File | SHA-256 |
| --- | --- |
| Beacon-Business-1.0.4-Google-Play.aab | `db9ec43c5b6f0c64f9937153dd9d409718099495ea90cc8d448f1f08d2cc4578` |
| Beacon-Business-1.0.4-prueba.apk | `21e028373d5a8251a442a14fb78b084c076e42dff947f4d56b8645e9a080b4b8` |

The AAB uses the existing upload certificate with SHA-256 fingerprint `705b4f837944eefe63e6b59ca086c342690bea8d761a60f16701c45ff85399eb`. The debug APK uses its own signing key and the package identifier `com.beaconoftheeagle.businessmanager.debug`.

## Verification

- All 13 browser and core regression tests passed.
- Chromium opened the web content extracted from the signed AAB. The welcome screen, dashboard and collection displayed the localized notices in Spanish, English and Italian. Each language contained 100 tips. The first and last tip displayed the collection credit above the personal notes field.
- The 18 web assets in both Android packages matched the source. Bundletool validated the release and generated a universal APK. The manifest reports a minimum API of 26 and a target API of 36.
- Installation on a physical Android device and Google Play Console intake for version 1.0.4 remain pending.
