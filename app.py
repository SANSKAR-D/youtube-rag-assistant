from typing import Annotated
from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel, Field
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from rag import embed_transcript,query_video

app = FastAPI()

class VideoRequest(BaseModel):
    youtube_video_id: Annotated[str, Field(...,pattern=r"^[a-zA-Z0-9_-]{11}$",title="YouTube Video ID",description="The ID of the YouTube video to process")]

class QueryRequest(BaseModel):
    youtube_video_id: Annotated[str, Field(..., pattern=r"^[a-zA-Z0-9_-]{11}$")]
    query: str

@app.get('/')
def welcome():
    return {"message": "Welcome to the YouTube RAG API"}

@app.post("/process")
def process_video(request: Annotated[VideoRequest, Query(...)]):
    video_id = request.youtube_video_id
    try:
        ytt_api = YouTubeTranscriptApi()
        fetched = ytt_api.fetch(video_id, languages=["en", "hi"])
        transcript = fetched.to_raw_data()
        text = " ".join([segment['text'] for segment in transcript])
        storage_path = embed_transcript(video_id, text)

    except TranscriptsDisabled:
        raise HTTPException(status_code=400, detail="Transcripts are disabled for this video.")
    except NoTranscriptFound:
        raise HTTPException(status_code=404, detail="No transcript found for this video.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")
    return {"message": f"Successfully processed and stored embedded video: {video_id}", "storage_path": storage_path}

@app.post("/ask")
def ask_question(request: Annotated[QueryRequest, Query(...)]):
    try:
        answer = query_video(request.youtube_video_id, request.query)
        return {"answer": answer}
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying video: {str(e)}")
