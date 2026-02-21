# FitnessApp Backend Package

Standalone backend package for `FitnessAppMobile`, so frontend and backend can be deployed independently.

## Features

- Modular HTTP server (`auth`, `records`, `social`, `ai`, `nutrition`)
- Backward-compatible routes for existing frontend (`/api/...`)
- Versioned route support (`/api/v1/...`)
- Token-based auth and session storage
- Comment pagination and delete-own-comment support
- AI conversation rename/delete/search history support
- Data compatibility migration from legacy `FitnessAppMobile/backend/data/db.json`

## Run

```bash
cd packages/backend
npm install
npm run start
```

Default server: `http://localhost:3001`

## Environment

Copy `.env.example` and set as needed.

- `PORT` default `3001`
- `DB_FILE` default `./data/db.json`
- `CORS_ORIGINS` default `*`

## API Base

- Main: `/api/...`
- Versioned alias: `/api/v1/...`
