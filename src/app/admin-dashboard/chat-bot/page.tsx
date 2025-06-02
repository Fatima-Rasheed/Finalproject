'use client';

import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/config';

interface Message {
  id?: string;
  text: string;
  sender: 'admin' | 'bot';
  timestamp: any;
}

export default function AdminChatBotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'chatbotMessages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Message),
      }));
      setMessages(data);
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, 'chatbotMessages'), {
      text: input,
      sender: 'admin',
      timestamp: serverTimestamp(),
    });

    setInput('');

    setTimeout(() => {
      addDoc(collection(db, 'chatbotMessages'), {
        text: 'Thank you! Your message has been received.',
        sender: 'bot',
        timestamp: serverTimestamp(),
      });
    }, 1000);
  };

  return (
    <div className="pt-24 pl-[270px] pr-6">
      {/* Wrapper for header and box */}
      <div className="max-w-4xl w-full">
        <div className="bg-black text-white px-6 py-4 rounded-md mb-4 w-full">
          <h2 className="text-xl font-bold">Admin ChatBot</h2>
        </div>

        <div className="bg-white p-4 rounded shadow h-[500px] flex flex-col justify-between w-full">
          <div className="overflow-y-auto space-y-3 h-full pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[70%] px-4 py-2 rounded-lg ${
                  msg.sender === 'admin'
                    ? 'bg-blue-600 text-white self-end ml-auto'
                    : 'bg-gray-200 text-black self-start mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Type a message..."
              className="flex-1 border px-4 py-2 rounded"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
