import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import './chat.css';
import { Loader } from 'lucide-react';


function Chat() {
    const location = useLocation();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const videoId = location.state?.videoId;

    if (!videoId) {
        return <Navigate to="/" replace />;
    }

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: "Hi! I'm your AI assistant.. What would you like to know about this video?"
        }
    ]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });};
        useEffect(() => {
            scrollToBottom();
        }, [messages]
    );

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAsk();
        }
    };


    const handleAsk = async () => {
        if (!query.trim() || loading) return;
        
        const userMessage = { role: 'user', text: query };
        setMessages(prev => [...prev, userMessage]);
        setQuery(""); 
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
    `http://localhost:8000/ask?youtube_video_id=${videoId}&query=${encodeURIComponent(userMessage.text)}`
            );

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
                                {<ReactMarkdown>{msg.text}</ReactMarkdown>}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="chat-input-container">
                <input 
                    type="text" 
                    placeholder="Ask a question about the video..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <button 
                    className="btn" 
                    onClick={handleAsk}
                    disabled={!query.trim() || loading}
                >
                    {loading ? <span className='loading-content'>
                                <Loader className="spinner" size={20} />
                                </span> : "Send"}
                </button>
            </div>
        </div>
    );
}

export default Chat;

