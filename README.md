# YouTube AI Assistant (RAG)

A full-stack Retrieval-Augmented Generation (RAG) application that allows you to paste a YouTube URL and chat with the video's content using local AI models (via Ollama). 

The app retrieves the video transcript, chunks and embeds the text, stores it in a local Chroma vector database, and uses an LLM to answer user questions in English, regardless of the original video language.

---

## 🚀 Features

- **Local Processing**: Keeps data private by running embeddings and language models locally using Ollama.
- **Auto-Language Retrieval**: Fetches transcripts in English and Hindi, and translates the final answer to English.
- **Modern UI**: Clean, responsive, glassmorphic layout built with React and styled with vanilla CSS.
- **Smart Navigation**: Smooth transitions between the video processor and the chat interface.
- **Auto-Scrolling & Clean Layout**: Chat screen with automated scroll-to-bottom and hidden scrollbars for a premium user experience.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **RAG Orchestration**: LangChain
- **Vector Database**: Chroma DB (local persistent storage)
- **Embeddings & LLM**: Ollama (`nomic-embed-text` & `gemma3:4b` by default)
- **Scraper**: YouTube Transcript API

### Frontend
- **Framework**: Vite + React
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router (`react-router-dom`)
- **Markdown Render**: React Markdown

---

## 📋 Prerequisites

Make sure you have the following installed on your system:
- **Python 3.10+**
- **Node.js 18+ & npm**
- **Ollama** (Download from [ollama.com](https://ollama.com))
  - Run the following commands in your terminal to download the models:
    ```bash
    ollama pull nomic-embed-text
    ollama pull gemma3:4b
    ```

---

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/SANSKAR-D/youtube-rag-assistant.git
cd youtube-rag-assistant
```

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables:
   Create a `.env` file based on `.env.example`:
   ```env
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_LLM_MODEL=gemma3:4b
   OLLAMA_EMBED_MODEL=nomic-embed-text:latest
   CHROMA_DIR=data/chroma
   FRONTEND_URL=http://localhost:5173
   ```

### 3. Frontend Setup
1. Open a new terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## 🏃 Running the Application

### Start the Backend
From the `backend` folder (make sure your virtual environment is active):
```bash
uvicorn app:app --reload
```
The backend API will run at `http://localhost:8000`.

### Start the Frontend
From the `frontend` folder:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 💡 YouTube IP Block Workaround

YouTube has aggressive anti-scraping systems and may occasionally block your IP address from loading transcripts, causing a `500 Internal Server Error` (specifically `youtube_transcript_api._errors.IpBlocked`).

### To fix this:
1. Install the **"Get cookies.txt"** extension in Chrome or Firefox.
2. Go to YouTube, log in, open the extension, and click **Export**.
3. Save the exported text file as `cookies.txt` inside the `backend/` folder.
4. Modify `backend/app.py` to pass `cookies="cookies.txt"` into the transcript fetcher:
   ```python
   transcript = YouTubeTranscriptApi.get_transcript(
       video_id, 
       languages=["en", "hi"], 
       cookies="cookies.txt"
   )
   ```
