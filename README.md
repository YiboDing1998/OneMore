# FitnessAppMobile

A fitness mobile app built with **React Native + Expo Router + TypeScript**, focused on training, workout tracking, AI coaching, and community experience.

## Highlights

- Bottom-tab navigation with core modules: `Training / History / AI Coach / Social / Profile`
- End-to-end training flow: workout home -> execution -> summary
- Auth screens included: splash, login, register, and loading state
- Global state management with Zustand (auth + user session)
- Clean layered architecture: `presentation / business-logic / data / core / modules`

## Tech Stack

- React Native `0.81`
- Expo `54`
- Expo Router `6`
- TypeScript
- Zustand
- AsyncStorage
- React Navigation

## Project Structure

```text
FitnessAppMobile/
|- app/                         # Expo Router routes and entry pages
|  |- (tabs)/                   # Main tab routes
|  |- auth/                     # Auth routes
|- src/
|  |- presentation/             # Screens and UI-facing components
|  |- business-logic/           # hooks / services / store
|  |- data/                     # API client, repositories, storage
|  |- core/                     # types / utils / config / constants
|  |- modules/                  # Feature-based modules
|- components/                  # Shared UI components
|- assets/                      # Images, icons, static assets
|- tests/                       # Unit / integration tests
```

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Start the dev server

```bash
npm run start
```

### 3) Run on a platform

```bash
npm run android   # Android
npm run ios       # iOS (macOS required)
npm run web       # Web
```

## Available Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
npm run reset-project
```

## Current Status

- Current version is focused on mobile UI and interaction flow (good for product demo and frontend iteration).
- Login currently uses a local mock session flow (not real backend authentication).
- `src/data/api/client.ts` and repository layers are ready for real API integration.

## Roadmap

- Integrate real account system and token-based authentication
- Connect training, nutrition, and community APIs
- Improve test coverage and CI pipeline
- Add release/build pipeline with EAS

## Related Docs

- `GETTING_STARTED.md`
- `QUICK_START.md`
- `ARCHITECTURE.md`
- `PROJECT_STRUCTURE.md`
<<<<<<< HEAD
- `INTEGRATION_GUIDE.md`
=======
- `INTEGRATION_GUIDE.md`
>>>>>>> master
