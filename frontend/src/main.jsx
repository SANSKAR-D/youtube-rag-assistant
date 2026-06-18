import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Chat from './chat.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<App />} />
        <Route path = "/chat" element = {<Chat />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
