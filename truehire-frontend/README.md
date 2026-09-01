# TrueHire Frontend

Frontend MVP for the TrueHire project brief.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Backend integration

Copy `.env.example` to `.env` and set:

```env
VITE_API_URL=http://localhost:8000
```

Then in `src/pages/Scan.jsx`, replace the mock result block with the Axios POST shown in the comment.

Expected endpoint from the project brief:

`POST /api/scan`

Build with mock data first; integrate at the team checkpoints.
