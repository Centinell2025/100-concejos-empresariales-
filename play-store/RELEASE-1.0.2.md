# Beacon Business 1.0.2

Android package `com.beaconoftheeagle.businessmanager`, version code 3. The debug APK uses the separate package `com.beaconoftheeagle.businessmanager.debug`.

## Google Play release notes

**en-US** — Record income or expenses directly from the monthly dashboard. See cash results and goals together, move through filtered business tips and restore backups with long notes.

**es-ES** — Registra ingresos o gastos desde el panel mensual. Consulta el resultado de caja y tus metas, recorre los consejos que has filtrado y recupera copias de seguridad con notas largas.

**it-IT** — Registra entrate e spese dal pannello mensile. Consulta il risultato di cassa e gli obiettivi, sfoglia i consigli filtrati e ripristina i backup con note lunghe.

## Package verification

Built the debug APK and release AAB from the Android Gradle project. The AAB was signed with the existing upload key. Its certificate SHA-256 is `705b4f837944eefe63e6b59ca086c342690bea8d761a60f16701c45ff85399eb`.

| Delivered file | SHA-256 |
| --- | --- |
| Beacon-Business-1.0.2-Google-Play.aab | `41f5c0775c6984152c659b9e13072ea48a5a98f80d91504d9512012e21caa8c8` |
| Beacon-Business-1.0.2-prueba.apk | `be44013ec790c05e49b5f07bda648d73edadbabf33e430027b64fc130e3c2cc7` |

The signed bundle passed bundletool validation. All 17 bundled web assets match the working source. The four Node/browser test files passed, including long-note JSON restore and Undo, monthly cash calculations, failed writes, filtered tip navigation and offline reload. Physical device and native document picker testing remain pending. No Play Console submission was made for this build.
