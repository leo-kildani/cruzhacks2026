import os
from itertools import islice
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from youtube_comment_downloader import YoutubeCommentDownloader, SORT_BY_POPULAR
from openai import OpenAI

app = FastAPI(
    title="Public Opinion Analyzer",
    description="Extracts YouTube comments and synthesizes public opinion using AI",
    version="1.0.0",
)

# Add CORS middleware to allow requests from Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins; can restrict to your Vercel domain if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize YouTube comment downloader
downloader = YoutubeCommentDownloader()


class AnalyzeRequest(BaseModel):
    youtube_urls: List[str]


class AnalyzeResponse(BaseModel):
    summary: str
    total_comments: int
    videos_processed: int


def extract_comments_from_video(url: str, limit: int = 75) -> List[dict]:
    """
    Extract top comments from a YouTube video URL.
    
    Args:
        url: YouTube video URL
        limit: Maximum number of comments to extract
        
    Returns:
        List of comment dictionaries
    """
    try:
        comments = downloader.get_comments_from_url(url, sort_by=SORT_BY_POPULAR)
        return list(islice(comments, limit))
    except Exception as e:
        print(f"Error extracting comments from {url}: {e}")
        return []


def synthesize_public_opinion(comments: List[dict], video_count: int) -> str:
    """
    Use OpenAI GPT-3.5-turbo to synthesize a public opinion summary from comments.
    
    Args:
        comments: List of comment dictionaries
        video_count: Number of videos the comments came from
        
    Returns:
        Synthesized public opinion summary
    """
    if not comments:
        return "No comments were found to analyze."
    
    # Extract comment text and build context
    comment_texts = []
    for comment in comments:
        text = comment.get("text", "").strip()
        if text:
            # Include like count for context on popularity
            likes = comment.get("votes", 0)
            comment_texts.append(f"[{likes} likes] {text}")
    
    if not comment_texts:
        return "No valid comment text was found to analyze."
    
    # Limit the total text to avoid token limits
    combined_comments = "\n".join(comment_texts[:200])  # Cap at 200 comments
    if len(combined_comments) > 15000:
        combined_comments = combined_comments[:15000] + "..."
    
    prompt = f"""You are analyzing public opinion based on YouTube comments from {video_count} video(s) related to a news topic.

Below are the top comments sorted by popularity (likes shown in brackets):

{combined_comments}

Based on these comments, provide a concise public opinion analysis that includes:
1. The overall sentiment (positive, negative, mixed, neutral)
2. The main themes or concerns expressed by commenters
3. Any notable patterns or consensus views
4. Any significant minority opinions or debates

Keep your analysis to 2-3 paragraphs and be objective in summarizing what the public thinks."""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an objective analyst who summarizes public opinion based on social media comments. Be balanced and accurate in your assessments.",
                },
                {"role": "user", "content": prompt},
            ],
            max_tokens=500,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error calling OpenAI API: {str(e)}"
        )


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_public_opinion(request: AnalyzeRequest):
    """
    Analyze public opinion from YouTube video comments.
    
    Accepts a list of YouTube URLs, extracts top 75 comments from each,
    and uses AI to synthesize a public opinion summary.
    """
    if not request.youtube_urls:
        raise HTTPException(status_code=400, detail="youtube_urls list cannot be empty")
    
    # Extract comments from all videos
    all_comments = []
    videos_processed = 0
    
    for url in request.youtube_urls:
        comments = extract_comments_from_video(url, limit=75)
        if comments:
            all_comments.extend(comments)
            videos_processed += 1
    
    if videos_processed == 0:
        raise HTTPException(
            status_code=500,
            detail="Failed to extract comments from any of the provided videos",
        )
    
    # Synthesize public opinion
    summary = synthesize_public_opinion(all_comments, videos_processed)
    
    return AnalyzeResponse(
        summary=summary,
        total_comments=len(all_comments),
        videos_processed=videos_processed,
    )


@app.get("/health")
async def health_check():
    """Health check endpoint for container orchestration."""
    return {"status": "healthy"}
