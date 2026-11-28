# Beacon Business 1.0.3

Android package `com.beaconoftheeagle.businessmanager`, version code 4. The debug APK uses `com.beaconoftheeagle.businessmanager.debug` and a separate data store.

## Google Play release notes

**en-US** — Enter USD amounts with a decimal point or comma. Review changes before undoing a backup restore. Search related clients, projects and personal tip notes. Working in two windows now preserves separate entries and warns when both edit the same record.

**es-ES** — Introduce importes en USD con punto o coma decimal. Revisa los cambios antes de deshacer una restauración. Busca por cliente, proyecto o notas personales. Al trabajar en dos ventanas se conservan ambas altas y recibes un aviso si editas el mismo registro.

**it-IT** — Inserisci gli importi in USD con il punto o la virgola decimale. Controlla le modifiche prima di annullare un ripristino. Cerca per cliente, progetto o note personali. Due finestre conservano le nuove voci e ti avvisano se modifichi lo stesso record.

## Files prepared for upload and installation tests

| File | SHA-256 |
| --- | --- |
| Beacon-Business-1.0.3-Google-Play.aab | `ce18652a3d7debd5717ed7a3724d656e1e3ef82c3f0bc4e1691087f6ab3422a7` |
| Beacon-Business-1.0.3-prueba.apk | `a8eecd3bc9420aa2df9e201cb198fa193367b040c63d3fa30b387c7a957127f3` |

The AAB was signed with the existing upload certificate, SHA-256 `705b4f837944eefe63e6b59ca086c342690bea8d761a60f16701c45ff85399eb`. Gradle release lint, bundletool validation and universal APK generation succeeded. The release manifest targets API 36, supports API 26 and later, requests no Android permissions and disables debugging. Both packages contain the same 18 web assets as the source. Neither package includes native shared libraries.

## Verification

- All 13 automated web and core tests passed. They exercise money entry, monthly reports, long Unicode notes, import and export, interrupted writes, protected Undo, concurrent edits and cross-tab synchronization with both Web Locks and IndexedDB.
- With the interface in Spanish, typing `14,08` or `14.08` stored exactly 1,408 cents after a reload in all eight combinations of input and Spanish/US browser and session settings. Earlier editions could silently drop the comma.
- In the Android document-flow simulation, the Spanish UI exported income of 675.90 USD, an expense of 120.50 USD and a 13,321-character note. The Android Java callback returned the JSON to a fresh profile. After reloading, net cash was 555.40 USD and the note, favorite and completed tip matched. CSV export produced UTF-8 with BOM. Five Java checks ran on each of simulated API 26 and 35, for ten successful results.
- The signed 1.0.2 and 1.0.3 web assets were opened in turn under the same Android WebView URL in a persistent Chromium profile. Amounts of 705 and 2,419 cents, notes, favorites, progress and Spanish language survived closing the process and upgrading. A new 35-cent entry survived a further restart and JSON export. This verifies storage continuity at the application layer. Previously mis-entered amounts retain their recorded value and can be corrected against original receipts.
- An independent SQLite calculation for 1,200 synthetic transactions across six months matched the dashboard and monthly CSV files in all three languages. Income was 652,974.49 USD, expenses 526,575.43 USD, and net cash 126,399.06 USD. All 18 CSVs matched, including two months with a negative result and the transition into a new year.
- External JSON backups support up to 10,000 records per collection and 10,000,000 bytes per file. Older records with a valid date before 1900 can be backed up and restored. The internal Undo can recover an older collection above the external import limit.

The Android checks used simulated system services and Chromium. A physical handset and Play Console intake of this version remain pending.
