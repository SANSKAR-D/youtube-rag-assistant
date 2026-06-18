import React, {useState,useEffect} from 'react';
import axios from 'axios';
import { Play,Loader } from 'lucide-react';

function App() {
  const [videoID, setVideoId] = useState('');
  const [url,setUrl] = useState('');
  const [status,setStatus] = useState('');
  const [loading,setLoading]=useState(false);
  const handleLoadVideo = async () => {
  if (url === "" || loading) return;
  const videoID = url.split('v=')[1];
  if (videoID.length !== 11) {
    setStatus("Invalid URL");
    return;
  }
  
  try {
    setLoading(true);
    setStatus("Processing...");
    await axios.post('http://localhost:8000/process?youtube_video_id=' + videoID);
    setStatus("Video loaded successfully!\nPlease wait for the AI Assistant to Load");
  } catch (error) {
    console.error("Error processing video:", error);
    setStatus("Error loading video");
  } finally {
    setLoading(false);
  }
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLoadVideo();
    }
  };
  return (
    <>
      <header>
        <div className="header-title">
          <Play className="yt-icon" size={80} />
        <h1>
        YouTube AI Assistant</h1>
        </div>
        <p>Ask anything about the video</p>
      </header>
      <div className = "input-card">
        <input 
          type="text" 
          placeholder='Enter YouTube URL (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ)'
          value={url}
          disabled = {loading}
          onKeyDown={handleKeyDown}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className='btn'
          onClick = {handleLoadVideo}
          disabled = {!url || loading}
        >
          {loading ? (
            <span className='loading-content'>
            <Loader className="spinner" size={20} />
            Processing...
            </span>
          ) : (
            'Upload Video'
          )}
        </button>
      </div>
      {status && (
        <div className='status'>
          {status}
        </div>
      )}
    </>
  );
}

export default App;
