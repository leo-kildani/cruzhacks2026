# Based News

A political news aggregator that provides neutral summaries with bias ratings and public opinion analysis. Built for CruzHacks 2026.

**Live Demo:** https://cruzhacks2026-kappa.vercel.app/

## Features

- **Neutral Summaries** - Direct, politically neutral summaries of the latest US political news
- **7-Point Bias Scale** - Every source categorized from Far Left to Far Right
- **Public Opinion** - Real-time sentiment analysis from YouTube comments

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
YOUTUBE_API_KEY=your_youtube_api_key_here
```

You can obtain a YouTube Data API key from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

## Running the Public Opinion API (FastAPI)

The public opinion analysis feature requires running a local FastAPI server exposed via ngrok.

### Prerequisites

- Python 3.11+
- ngrok account with a custom domain (or use the free tier)
- OpenAI API key
- install dependencies from `requirements.txt`

### Start the FastAPI server

In one terminal:

```bash
cd python_public_opinion
OPENAI_API_KEY=your_openai_api_key uvicorn main:app --host 0.0.0.0 --port 8000
```

### Start the ngrok tunnel

In another terminal:

```bash
ngrok http 8000 --domain=bursting-satyr-genuinely.ngrok-free.app
```

The FastAPI will now be accessible at `https://bursting-satyr-genuinely.ngrok-free.app`.

## API Endpoints

### 1. GET `/api/headlines`

Fetches paginated headlines from the database, ordered by date (newest first).

**Query Parameters:**
- `skip` (optional, default: 0) - Number of headlines to skip
- `take` (optional, default: 6) - Number of headlines to fetch

**Response:**
```json
{
  "headlines": [...],
  "hasMore": true,
  "totalCount": 25
}
```

**curl:**
```bash
curl "https://cruzhacks2026-kappa.vercel.app/api/headlines?skip=0&take=6"
```

---

### 2. POST `/api/headline-sources`

Forwards a headline to an n8n webhook to fetch related news sources with bias ratings. Used to find additional sources covering the same story.

**Request Body:**
```json
{
  "headline": "string (required)",
  "description": "string (required)", 
  "date": "string (required)"
}
```

**curl:**
```bash
curl -X POST "https://cruzhacks2026-kappa.vercel.app/api/headline-sources" \
  -H "Content-Type: application/json" \
  -d '{"headline": "Federal Judge Limits Immigration Enforcement", "description": "A federal judge issued a ruling restricting immigration agents.", "date": "2026-01-17"}'
```

---

### 3. POST `/api/ingest/headlines`

Ingests articles from 6 hardcoded RSS feeds (CNN, NYTimes, Fox News, ABC News, WSJ, LA Times) into the `Article` table. Skips duplicates based on link URL.

**Request Body:** None required

**Response:**
```json
{
  "ok": true,
  "totalParsed": 120,
  "totalInserted": 15,
  "perFeed": [
    { "url": "http://rss.cnn.com/...", "title": "CNN US", "parsed": 20, "inserted": 3 }
  ]
}
```

**curl:**
```bash
curl -X POST "https://cruzhacks2026-kappa.vercel.app/api/ingest/headlines"
```

---

### 4. GET `/api/headlines/[id]/public-opinion`

Returns public opinion analysis for a specific headline. If cached, returns immediately; otherwise, orchestrates calls to YouTube search and FastAPI analysis endpoints, then caches the result.

**Path Parameters:**
- `id` - The headline UUID

**Response:**
```json
{
  "summary": "Analysis of public sentiment...",
  "totalComments": 1500,
  "videosProcessed": 5,
  "cached": true
}
```

**curl:**
```bash
curl "https://cruzhacks2026-kappa.vercel.app/api/headlines/<HEADLINE_ID>/public-opinion"
```

*Note: Replace `<HEADLINE_ID>` with an actual headline UUID from the `/api/headlines` response.*

---

### 5. POST `/api/publicopinion`

Searches YouTube for videos matching a query string. Returns up to 5 most relevant videos. Used internally by the public-opinion endpoint.

**Request Body:**
```json
{
  "query": "string (required)",
  "publishedAfter": "ISO 8601 date string (optional)"
}
```

**Response:**
```json
{
  "videos": [
    {
      "videoId": "abc123",
      "title": "Video Title",
      "url": "https://www.youtube.com/watch?v=abc123",
      "thumbnail": "https://i.ytimg.com/...",
      "publishedAt": "2026-01-17T12:00:00Z"
    }
  ]
}
```

**curl:**
```bash
curl -X POST "https://cruzhacks2026-kappa.vercel.app/api/publicopinion" \
  -H "Content-Type: application/json" \
  -d '{"query": "immigration enforcement ruling", "publishedAfter": "2026-01-15T00:00:00Z"}'
```

---

### 6. POST `/api/publicopinion/analyze`

Forwards YouTube video URLs to a FastAPI backend (Python service) that scrapes comments and generates an AI-powered public sentiment summary.

**Request Body:**
```json
{
  "youtube_urls": ["https://www.youtube.com/watch?v=abc123", "..."]
}
```

**Response:**
```json
{
  "summary": "Public sentiment analysis...",
  "total_comments": 1500,
  "videos_processed": 5
}
```

**curl:**
```bash
curl -X POST "https://cruzhacks2026-kappa.vercel.app/api/publicopinion/analyze" \
  -H "Content-Type: application/json" \
  -d '{"youtube_urls": ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"]}'
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Frontend                                    │
│                             (React UI)                                   │
└─────────────────────────────┬───────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Next.js API Routes                                │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────────────┤
│ /headlines  │ /headline-  │ /ingest/    │ /headlines/ │ /publicopinion  │
│             │ sources     │ headlines   │ [id]/public │ /analyze        │
│             │             │             │ -opinion    │                 │
└──────┬──────┴──────┬──────┴──────┬──────┴──────┬──────┴────────┬────────┘
       │             │             │             │               │
       ▼             ▼             ▼             ▼               ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐
│PostgreSQL│  │n8n       │  │RSS Feeds │  │YouTube   │  │FastAPI (Python) │
│          │  │Webhook   │  │          │  │Data API  │  │                 │
└──────────┘  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘
```

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Supabase)
- **External Services:** n8n, YouTube Data API, Exa.ai
- **ML/AI:** FastAPI Python service with OpenAI