# Beacon Business — Google Play release preparation

Prepared for Beacon of the Eagle LLC. Version 1.0.0 (version code 1).

## Approved scope

- Default app and store-listing language: **English (United States)**.
- Optional in-app languages: Spanish and Italian.
- Distribution: **United States (US), Spain (ES), Canada (CA) ONLY**.
- Category: Business. App, not game.
- Android package: `com.beaconoftheeagle.businessmanager`.
- Minimum Android: 8.0 (API 26). Target Android: 16 (API 36).
- No ads, in-app purchases, account login or subscriptions in this build.
- Price has not been chosen. Do not infer a free or paid publishing choice.

## Files

- `Beacon-Business-1.0.0.aab`: signed release bundle for Google Play. It cannot be installed directly on a phone.
- `Beacon-Business-1.0.0.apk`: signed release APK for direct device testing.
- `upload-key-certificate.pem`: public upload certificate, safe to supply when requested by Google.
- `store-assets/`: app icon and feature graphic. The feature graphic is a marketing design, not a device screenshot.
- Source project: the `android/` and `dist/` directories in the GitHub repository.
- `listing-en-US.md`: English listing text.
- `privacy.html`: in-app Android privacy policy.

## Publication still required

The app is prepared, not uploaded, submitted, approved or published. There is no Google Play download link yet.

1. Create/select the app in the intended Play Console account. Choose English (United States), app, and your deliberate pricing decision.
2. Enroll in Play App Signing using the ordinary Google-generated app-signing key flow and use this bundle’s upload key for the upload. Keep the separate private signing backup. Google’s app-signing key and this upload key are distinct.
3. Upload the AAB to the intended testing track first.
4. Select **only United States, Spain and Canada** in country/region availability. Check production and any open/closed testing tracks separately. No AAB setting enforces store countries. Internal testing uses invited testers and is not a substitute for production country configuration.
5. Add the English listing, support contact and a publicly accessible privacy-policy URL. A copy of the Android policy is included in-app. The current hosted app is private; its gated URL should not be used as a public privacy-policy URL. Prepared public policy path: https://github.com/Centinell2025/100-concejos-empresariales-/blob/main/PRIVACY.md . Verify that the page is readable without signing in before using it in the listing.
6. Capture and upload authentic phone screenshots from this exact Android build after installation. They are not included because the build has not yet been run on a physical device or emulator.
7. Complete content-rating, target-audience, app-access and data-safety forms accurately. This build has unrestricted offline access and no login. It is designed for business users. Review the included policy and the final merged permissions before submitting declarations. No developer data collection or sharing is implemented; an export is user-directed.
8. Review any account-specific testing or verification requirements and the pre-launch report before requesting production access or release.

## Verification limits

The build checks validate packaging and signing. They do not establish on-device WebView behavior or Google acceptance. Verify first launch in English, language switching, persistence after restart, all CRUD forms, keyboard/insets, Back behavior, JSON export/cancel, validated restoration and Undo, CSV reports, monthly targets, and offline operation on supported devices. Start with test records; this build contains no business demonstration data.

## Official references

- Target SDK: https://developer.android.com/google/play/requirements/target-sdk
- Release preparation: https://support.google.com/googleplay/android-developer/answer/9859348
- Country distribution: https://support.google.com/googleplay/android-developer/answer/7550024
- Privacy and user data: https://support.google.com/googleplay/android-developer/answer/10144311

Browser QA confirmed the welcome page, English/Italian switching, target entry and category report display. The browser file-upload test was not authorized; picker-based restore remains unverified. Pure validation tests passed for valid backups, invalid amounts/dates, duplicate IDs and invalid learning references. Android on-device tests remain pending.
