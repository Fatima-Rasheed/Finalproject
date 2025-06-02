'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImUserTie } from 'react-icons/im';
import { FaUserGraduate } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io';
import { Navbar } from '@/app/components/Navbar';
import { RiMessageFill } from 'react-icons/ri';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';

export default function AdminMessagesPage() {
  const [students, setStudents] = useState<{ fullName: string; email: string }[]>([]);
  const [supervisors, setSupervisors] = useState<{ fullName: string; email: string }[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [recipientType, setRecipientType] = useState<'students' | 'supervisors'>('students');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const currentList = recipientType === 'students' ? students : supervisors;

  useEffect(() => {
    const fetchUsers = async () => {
      const studentSnapshot = await getDocs(collection(db, 'students'));
      const supervisorSnapshot = await getDocs(collection(db, 'supervisors'));

      const studentList = studentSnapshot.docs.map((doc) => ({
        fullName: doc.data().fullName,
        email: doc.data().email
      }));

      const supervisorList = supervisorSnapshot.docs.map((doc) => ({
        fullName: doc.data().fullName,
        email: doc.data().email
      }));

      setStudents(studentList);
      setSupervisors(supervisorList);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const q = query(collection(db, 'adminMessages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filtered = allMessages.filter(
        (msg: any) => msg.to === user?.email || msg.from === user?.email
      );
      setMessages(filtered);
    });

    return () => {
      unsubscribe();
      unsubscribeAuth();
    };
  }, [user]);

  const handleSendMessage = async () => {
    if (!selectedRecipient || !message) {
      alert('Please select recipient and enter a message.');
      return;
    }

    if (user?.email === selectedRecipient) {
      alert('You cannot send a message to yourself.');
      return;
    }

    const fromName = user.displayName || 'Admin';
    const toName = currentList.find((u) => u.email === selectedRecipient)?.fullName || 'Recipient';

    await addDoc(collection(db, 'adminMessages'), {
      from: user?.email,
      fromName,
      to: selectedRecipient,
      toName,
      text: message,
      timestamp: serverTimestamp()
    });

    setMessage('');
    setSelectedRecipient('');
  };

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>

      <main className="pt-20 p-12 bg-gray-100 min-h-screen">
        <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">Communicate</h1>
            <div className="bg-gray-300 p-2 rounded-full">
              <RiMessageFill className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Send Message */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Send Message</h2>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Send To</label>
              <div className="flex gap-2">
                <Button
                  variant={recipientType === 'students' ? 'default' : 'outline'}
                  onClick={() => setRecipientType('students')}
                >
                  <FaUserGraduate className="mr-1" /> Students
                </Button>
                <Button
                  variant={recipientType === 'supervisors' ? 'default' : 'outline'}
                  onClick={() => setRecipientType('supervisors')}
                >
                  <ImUserTie className="mr-1" /> Supervisors
                </Button>
              </div>
            </div>

            <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
              <SelectTrigger className="w-full mb-4">
                <SelectValue placeholder={`Select ${recipientType}`} />
              </SelectTrigger>
              <SelectContent>
                {currentList.map((user) => (
                  <SelectItem key={`${user.email}-${user.fullName}`} value={user.email}>
                    {user.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Enter your message..."
              className="w-full mb-4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button className="flex items-center" onClick={handleSendMessage}>
              <IoIosSend className="mr-1" /> Send Message
            </Button>
          </div>

          {/* Message History */}
          <div className="bg-white p-6 rounded shadow max-h-[500px] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Your Messages</h2>
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages found.</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={`${msg.id}-${msg.timestamp?.seconds || Math.random()}`}
                  className="border p-3 rounded bg-gray-50 mb-2"
                >
                  <p className="text-sm text-gray-600">
                    <strong>From:</strong>{' '}
                    {msg.from === user?.email ? 'You' : msg.fromName || msg.from}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>To:</strong>{' '}
                    {msg.to === user?.email ? 'You' : msg.toName || msg.to}
                  </p>
                  <p className="text-md">{msg.text}</p>
                  <p className="text-xs text-gray-400">
                    {msg.timestamp?.toDate?.()
                      ? new Date(msg.timestamp.toDate()).toLocaleString()
                      : ''}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
