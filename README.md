# SEIA Mobile

SEIA Mobile is a standalone Expo + EAS Android app for exploring Ford models, getting recommendations, managing appointments, and saving profile data on a phone.

This folder is meant to be readable on its own. You do not need to know the Angular web app first to understand or run it.

## How it relates to the main product

This mobile app belongs to the same product family as the main SEIA website. The two apps share the same Ford backend API for car data and recommendations, and they can also point to the same Supabase project for authentication and session storage.

The difference is the interface:

- The website is a browser-based Angular app.
- This folder is a native React Native app built with Expo Router.

The mobile app is not a WebView wrapper. It is a separate native implementation that uses the same backend services.

## What you get here

- Landing screen
- Login and signup screens
- Portal with recommendation lookup
- Ford model catalog
- Detailed dashboard for car data
- Concessionary search and location support
- Appointments with local persistence
- Profile screen with local persistence
- Terms and FAQ/support screens

## Requirements

- Node.js 20+ recommended
- npm
- Android Studio or a physical Android device for local testing
- Expo Go or a development build

## Install

From inside this folder:

```bash
npm install
```

If this folder has been moved into its own repository, the install command stays the same.

## Environment

Create a file named `.env` next to `package.json` and add your Supabase values:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Those variables are read by [src/lib/supabase.ts](src/lib/supabase.ts).

If you want the mobile app to use the same Supabase project as the website, paste the same values here.

## Run

Start the Expo app:

```bash
npm run start
```

Run on Android:

```bash
npm run android
```

## Data sources

The mobile app uses the same Ford API backend as the website for car data and recommendations. The shared client lives in [src/lib/ford-api.ts](src/lib/ford-api.ts).

The app currently stores the following locally on the device:

- Favorites
- Profile data
- Appointments

## Project structure

- `app/` Expo Router screens
- `src/components/` shared UI pieces
- `src/data/` helper functions and formatting logic
- `src/lib/` API and Supabase clients

## Notes

- This project can be moved out and uploaded as its own repository later.
- The UI is designed for mobile, not a direct copy of the website layout.
- If you add new backend keys or API settings later, keep them in `.env` and in your EAS environment settings.
