'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function MessageView() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<{ fullName: string; email: string }[]>([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch all users for dropdown (admin + supervisors + students)
  useEffect(() => {
    const fetchAllUsers = async () => {
      const collections = ['admins', 'supervisors', 'students'];
      const allUsers: { fullName: string; email: string }[] = [];

      for (const col of collections) {
        const snapshot = await getDocs(collection(db, col));
        snapshot.forEach((doc: { data: () => any; }) => {
          const data = doc.data();
          if (data?.email && data?.fullName && data?.email !== currentUser?.email) {
            allUsers.push({ fullName: data.fullName, email: data.email });
          }
        });
      }

      setUsers(allUsers);
    };

    if (currentUser) fetchAllUsers();
  }, [currentUser]);

  // Fetch messages
  useEffect(() => {
    if (!currentUser || !selectedEmail) return;

    const messagesRef = collection(db, 'adminMessages');
    const q = query(
      messagesRef,
      where('to', 'in', [currentUser.email, selectedEmail]),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs
        .map((doc) => doc.data())
        .filter(
          (msg: any) =>
            (msg.to === currentUser.email && msg.from === selectedEmail) ||
            (msg.from === currentUser.email && msg.to === selectedEmail)
        );
      setMessages(fetched);
    });

    return () => unsubscribe();
  }, [currentUser, selectedEmail]);

  const handleSend = async () => {
    if (!message || !selectedEmail || !currentUser?.email) return;

    await addDoc(collection(db, 'adminMessages'), {
      from: currentUser.email,
      to: selectedEmail,
      text: message,
      timestamp: serverTimestamp(),
    });
    setMessage('');
  };

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        {/* Navbar if needed */}
      </header>

      <main className="pt-24 p-6">
        <div className="bg-black text-white px-6 py-4 rounded-md mb-4">
          <h2 className="text-xl font-bold">Messages with Receiver</h2>
        </div>

        <Select value={selectedEmail} onValueChange={setSelectedEmail}>
          <SelectTrigger className="w-full mb-4">
            <SelectValue placeholder="Select user to chat with" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.email} value={user.email}>
                {user.fullName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2 h-96 overflow-y-auto bg-white p-4 rounded shadow">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-md w-fit max-w-[70%] text-sm shadow ${
                msg.from === currentUser.email
                  ? 'bg-blue-100 ml-auto'
                  : 'bg-gray-100'
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex mt-4">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button className="ml-2" onClick={handleSend}>
            Send
          </Button>
        </div>
      </main>
    </div>
  );
}
