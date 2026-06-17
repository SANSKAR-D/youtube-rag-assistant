import React, {useState,useEffect} from 'react';
import { Play,Loader } from 'lucide-react';

function App() {
  const [videoID, setVideoId] = useState('');
  const [status,setStatus] = useState('');
  const [loading,setLoading]=useState(false);
  const handleLoadVideo = () => {
    if (videoID === "" || loading) return;
    setLoading(true);
    setStatus("Attempting to load the video...");
    setTimeout(() => {
      setStatus("Video loaded successfully!");
      setLoading(false);
    }, 2500);
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
          value={videoID}
          disabled = {loading}
          onKeyDown={handleKeyDown}
          onChange={(e) => setVideoId(e.target.value)}
        />
        <button
          className='btn'
          onClick = {handleLoadVideo}
          disabled = {!videoID || loading}
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
