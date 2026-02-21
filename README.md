# OneMore

- A fitness mobile app built with **React Native + Expo Router + TypeScript**, focused on training, workout tracking, AI coaching, and community experience.
<img width="200" height="800" alt="image" src="https://github.com/user-attachments/assets/53c5dba3-e7da-417a-bd6b-3ee01f07eaa3" />



## Highlights
- AI Coach: talk and give advices plans based on your previous records and notes
<img width="300" height="1000" alt="image" src="https://github.com/user-attachments/assets/49e4e20c-82fc-4ecd-9bd0-058c7b374153" />

- Talk with AI like a professional coach
<img width="400" height="1000" alt="image" src="https://github.com/user-attachments/assets/2fcbdeba-aa17-434b-a2ed-6a9dc857cc85" />

- Interact with friends more engagely
<img width="300" height="1000" alt="image" src="https://github.com/user-attachments/assets/d2488e1b-8e0b-4c93-9bea-2573f1f475e5" />

- history record of every workout
<img width="300" height="1000" alt="image" src="https://github.com/user-attachments/assets/be48b1a2-7b38-4f92-bf07-6aecb9b8f9f3" />

- engagement with friends
<img width="300" height="1000" alt="image" src="https://github.com/user-attachments/assets/f23c93ca-2c14-4571-b8c1-a4180cd3e661" />

- visulaize record
<img width="350" height="1000" alt="image" src="https://github.com/user-attachments/assets/4931cc9d-4a39-4737-aea3-10b2e86fcbec" />





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
npm run server
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
npm run server
npm run android
npm run ios
npm run web
npm run lint
npm run reset-project
```

