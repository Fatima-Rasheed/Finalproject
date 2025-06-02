'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import { Navbar } from '@/app/components/Navbar';
import { FaUserGraduate } from 'react-icons/fa';
import { ImUserTie } from 'react-icons/im';
import { RiMessageFill } from 'react-icons/ri';
import { IoIosSend } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function SupervisorMessagesPage() {
  const [students, setStudents] = useState<{ fullName: string; email: string }[]>([]);
  const [recipientType, setRecipientType] = useState<'students' | 'admin'>('students');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState('');

  const admin = { fullName: 'Admin', email: 'admin@gmail.com' };

  useEffect(() => {
    const fetchStudents = async () => {
      const snapshot = await getDocs(collection(db, 'students'));
      const list = snapshot.docs.map((doc) => ({
        fullName: doc.data().fullName || 'Unnamed Student',
        email: doc.data().email || '',
      }));
      setStudents(list);
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user?.email) {
        setUserEmail(user.email);

        const q = query(collection(db, 'adminMessages'), orderBy('timestamp', 'asc'));
        const unsubscribeMessages = onSnapshot(q, (snapshot) => {
          const msgs = snapshot.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter(
              (msg: any) => msg.to === user.email || msg.from === user.email
            );
          setReceivedMessages(msgs);
        });

        return () => unsubscribeMessages();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const currentList = recipientType === 'admin' ? [admin] : students;

  const handleSendMessage = async () => {
    const user = auth.currentUser;
    if (!user || !selectedRecipient || !message.trim()) {
      alert('Please select recipient and enter a message.');
      return;
    }

    if (user.email === selectedRecipient) {
      alert('You cannot send a message to yourself.');
      return;
    }

    const fromName = user.displayName || 'You';
    const toName = currentList.find(u => u.email === selectedRecipient)?.fullName || 'Recipient';

    await addDoc(collection(db, 'adminMessages'), {
      from: user.email,
      fromName,
      to: selectedRecipient,
      toName,
      text: message,
      timestamp: serverTimestamp(),
    });

    setMessage('');
    setSelectedRecipient('');
  };

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>
      <main className="pt-20 px-10 pb-10  bg-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Send Message</h2>
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
                variant={recipientType === 'admin' ? 'default' : 'outline'}
                onClick={() => setRecipientType('admin')}
              >
                <ImUserTie className="mr-1" /> Admin
              </Button>
            </div>
          </div>

          <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
            <SelectTrigger className="w-full mb-4">
              <SelectValue placeholder={'Select ${recipientType'} />
            </SelectTrigger>
            <SelectContent>
              {currentList.map((user) => (
  <SelectItem key={user.email + user.fullName} value={user.email}>
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
        </section>

        <section className="bg-white p-6 rounded shadow max-h-[500px] overflow-y-auto">
    
          <h2 className="text-xl font-bold mb-4">Your Messages</h2>
          {receivedMessages.length === 0 ? (
            <p className="text-gray-500">No messages found.</p>
          ) : (
            receivedMessages.map((msg) => (
              <div key={msg.id} className="mb-4 p-4 bg-gray-100 rounded shadow-sm">
                <p>
                  <strong>From:</strong>{' '}
                  {msg.from === userEmail ? 'You' : msg.fromName || msg.from}
                </p>
                <p>
                  <strong>To:</strong> {msg.toName || msg.to}
                </p>
                <p className="mt-1">{msg.text}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {msg.timestamp?.toDate?.() ? new Date(msg.timestamp.toDate()).toLocaleString() : ''}
                </p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}