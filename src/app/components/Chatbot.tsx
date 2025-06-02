'use client';
import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Navbar } from './Navbar';

const API_KEY = 'AIzaSyAquSJ6sV71TpInhoWAfAueL024PAf_Pdo';

const ChatBot = () => {
  const [messages, setMessages] = useState<{ role: string; text: string; time: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input, time: getCurrentTime() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(input);
      const response = await result.response.text();

      const botMessage = { role: 'bot', text: response, time: getCurrentTime() };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Gemini error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Something went wrong. Please try again.', time: getCurrentTime() },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      {/* Navbar */}
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>
      
      {/* Main Content */}
      <main className="pt-20 pb-0">
        <div className="max-w-3xl mx-auto p-2">
          <div
            style={{
              marginRight: '20px',
              backgroundColor: '#ffffff',
              color: '#000',
              minHeight: '60vh', // Decreased height
              width: '90%', // Increased width
              display: 'flex ',
              justifyContent:'center',
              flexDirection: 'column',
              padding: 10,
              fontFamily: 'Geist',
              margin: '0 auto', // Centering the chatbot
            }}
          >
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                padding: '0 10px',
              }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.role === 'user' ? '#DCF8C6' : '#F0F0F0',
                    color: '#000',
                    padding: '10px 14px',
                    borderRadius: 18,
                    maxWidth: '85%',
                    position: 'relative',
                  }}
                >
                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#555',
                      marginTop: 4,
                      textAlign: 'right',
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              ))}
              {loading && (
                <div
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: '#F0F0F0',
                    padding: '10px 14px',
                    borderRadius: 18,
                    maxWidth: '75%',
                    fontSize: 14,
                    color: '#888',
                  }}
                >
                  Gemini is typing...
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search anything..." // Changed placeholder
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 20,
                  border: '1px solid #ccc',
                  fontSize: 14,
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  backgroundColor: '#000', // Changed to black
                  color: '#fff',
                  border: 'none',
                  borderRadius: 20,
                  padding: '10px 18px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatBot;
