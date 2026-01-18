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