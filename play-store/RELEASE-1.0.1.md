# Beacon Business 1.0.1

Package: `com.beaconoftheeagle.businessmanager`
Version code: `2`
Prepared update; not uploaded or submitted to Google Play. Existing 1.0.0 production and closed-test releases were shown in review in the owner's November 23 screenshot.

## Release notes (en-US)

- Monthly priorities for cash targets, expense budgets and overdue tasks.
- Improved handling when device storage cannot save a change.
- Stronger backup validation and support for UTF-8 BOM files.
- Larger touch controls and improved display of large amounts.

## Notas (es-ES)

- Prioridades del mes para metas, presupuesto y tareas vencidas.
- Mejor manejo de errores de guardado en el dispositivo.
- Validación más estricta de copias y compatibilidad con archivos UTF-8 con BOM.
- Controles táctiles más grandes y mejor presentación de importes.

## Validation

Official bundletool 1.18.3 validated the bundle and generated a universal APK. Jarsigner verified the AAB. Its signing certificate SHA-256 matches the original: `705b4f837944eefe63e6b59ca086c342690bea8d761a60f16701c45ff85399eb`. Native DEX and Android resources are byte-identical to 1.0.0. Node tests cover selected-month priorities, translations, backup compatibility and invalid inputs. Physical Android execution and native document picker testing are pending.

Browser validation passed on mobile and desktop layouts, English/Spanish/Italian, monthly priorities, rejected writes for transaction/task/delete/goals, successful writes, reload persistence, BOM restoration with Undo, and offline reload with no JavaScript errors.

AAB SHA-256: `5042e7d05530828302aeb1c09002de04eff228aa23821d9d5308f0a7c43a0dde` (3,237,618 bytes).
