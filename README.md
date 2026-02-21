# OneMore

A fitness mobile app built with **React Native + Expo Router + TypeScript**, focused on training, workout tracking, AI coaching, and community experience.
<img width="670" height="1600" alt="image" src="https://github.com/user-attachments/assets/718926af-047e-4d11-a18c-971208fee9fa" />


## Highlights
- AI Coach: talk and give advices plans based on your previous records and notes
<img width="543" height="1600" alt="image" src="https://github.com/user-attachments/assets/49e4e20c-82fc-4ecd-9bd0-058c7b374153" />
<img width="670" height="1600" alt="image" src="https://github.com/user-attachments/assets/2fcbdeba-aa17-434b-a2ed-6a9dc857cc85" />

- Interact with friends more engagely
<img width="494" height="1600" alt="image" src="https://github.com/user-attachments/assets/d2488e1b-8e0b-4c93-9bea-2573f1f475e5" />

-
<img width="454" height="1600" alt="image" src="https://github.com/user-attachments/assets/be48b1a2-7b38-4f92-bf07-6aecb9b8f9f3" />
-
<img width="509" height="1600" alt="image" src="https://github.com/user-attachments/assets/f23c93ca-2c14-4571-b8c1-a4180cd3e661" />
-
<img width="627" height="1600" alt="image" src="https://github.com/user-attachments/assets/4931cc9d-4a39-4737-aea3-10b2e86fcbec" />





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

