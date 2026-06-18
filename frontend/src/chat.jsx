import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import './chat.css';


function Chat() {
    const location = useLocation();
    const navigate = useNavigate();

    const videoId = location.state?.videoId;

    if (!videoId) {
        return <Navigate to="/" replace />;
    }

    const [query, setQuery] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [messages, setMessages] = useState([]); 


    const handleAsk = async () => {
        if (!query.trim() || loading) return;
        
        const userMessage = { role: 'user', text: query };
        setMessages(prev => [...prev, userMessage]);
        setQuery(""); 
        setLoading(true);
        setError("");

        try {
            const res = await axios.post('http://localhost:8000/ask', { 
                youtube_video_id: videoId, 
                query: userMessage.text 
            });
            setMessages(prev => [...prev, { role: 'assistant', text: res.data.answer }]);
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to get response. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="chat-container">
            <button className='btn' onClick={() => navigate('/')}>Go Back</button>
            <h2 style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "1rem", }}>Chatting about video ID: {videoId}</h2>
            <div className="chat-window">
                <div className="messages-list">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message-row ${msg.role === 'user' ? 'user' : 'assistant'}`}>
                            <div className="message-bubble">
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}

export default Chat;

