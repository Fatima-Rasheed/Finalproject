import ChatBot from '@/app/components/Chatbot'
import { Navbar } from '@/app/components/Navbar'
import { AiFillAndroid } from "react-icons/ai";
import React from 'react'

const page = () => {
  return (
        <div className="flex flex-col flex-1 md:ml-64">
          {/* Navbar */}
          <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
            <Navbar />
          </header>
       
 <main className="pt-20 p-20 pb-0">
        <header className="bg-[rgb(21,21,21)] text-white p-4 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">What's on your mind?</h1> {/* Added heading */}
            <div className="bg-gray-300 p-2 rounded-full">
              <AiFillAndroid className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>
      
            <ChatBot/>
          </main>
    
    </div>
  )
}

export default page
