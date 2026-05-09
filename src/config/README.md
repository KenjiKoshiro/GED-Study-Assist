# GEDReady — Backend API

Node.js + Express + Supabase MVC backend.

## Folder Structure

```
gedready-backend/
├── server.js                  ← Entry point
├── .env.example               ← Copy to .env and fill in values
├── supabase-schema.sql        ← Run this in Supabase SQL Editor first
├── config/
│   └── supabase.js            ← Supabase client
├── middleware/
│   └── authMiddleware.js      ← JWT verification
├── models/
│   ├── userModel.js           ← User DB queries
│   ├── questionModel.js       ← Question DB queries
│   ├── quizModel.js           ← Quiz attempt DB queries
│   └── flashcardModel.js      ← Flashcard DB queries
├── controllers/
│   ├── authController.js      ← Signup, login, logout
│   ├── quizController.js      ← Get questions, submit quiz
│   ├── dashboardController.js ← Dashboard data
│   ├── flashcardController.js ← Flashcards
│   └── mocktestController.js  ← Mock test
└── routes/
    ├── authRoutes.js
    ├── quizRoutes.js
    ├── dashboardRoutes.js
    ├── flashcardRoutes.js
    └── mocktestRoutes.js
```

## Setup Steps

### 1. Supabase
- Create a project at https://supabase.com
- Go to SQL Editor → paste and run `supabase-schema.sql`
- Go to Settings → API → copy `Project URL` and `service_role` key

### 2. Environment
```bash
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
```

### 3. Install & Run
```bash
npm install
npm run dev       # development (nodemon)
npm start         # production
```

### 4. Enable Google OAuth in Supabase
- Go to Authentication → Providers → Google → Enable
- Add your Google Client ID and Secret

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/signup | No | Create account |
| POST | /api/auth/login | No | Login, returns token |
| POST | /api/auth/logout | No | Logout |
| GET | /api/auth/me | ✅ Yes | Get current user |
| GET | /api/quiz/:subject | No | Get 10 questions |
| POST | /api/quiz/submit | ✅ Yes | Submit quiz, save score |
| GET | /api/quiz/history | ✅ Yes | Past quiz attempts |
| GET | /api/dashboard | ✅ Yes | Full dashboard data |
| GET | /api/flashcards/:subject | No | Get flashcards |
| POST | /api/flashcards/progress | ✅ Yes | Save card progress |
| GET | /api/mocktest | ✅ Yes | Get mock test questions |
| POST | /api/mocktest/submit | ✅ Yes | Submit mock test |
| GET | /api/health | No | Server health check |

## Subjects
Valid subject values: `math`, `science`, `social_studies`, `rla`

## Auth Flow
All protected routes require:
```
Authorization: Bearer <supabase_access_token>
```
Token is returned from `/api/auth/login` response.
