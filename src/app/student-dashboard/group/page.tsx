'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/app/components/Navbar";
import { TiGroup } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { FaProjectDiagram } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { ArrowRight } from "lucide-react";

export default function GroupPage() {
  const [members, setMembers] = useState([
    { name: "", id: "" },
  ]);

  const handleMemberChange = (index: number, field: "name" | "id", value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
  };

  const addMember = () => {
    if (members.length < 3) {
      setMembers([...members, { name: "", id: "" }]);
    } else {
      alert("Maximum 3 members allowed");
    }
  };

  const removeMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      {/* Navbar */}
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>
      <main className="pt-20 p-20 pb-0">
        <header className="bg-[rgb(21,21,21)] text-white p-4 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">Group Members</h1>
            <div className="bg-gray-300 p-2 rounded-full">
              <TiGroup className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>
        <div className="max-w-3xl mx-auto p-2">
          <header className="flex justify-between items-center py-4 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <TiGroup className="h-6 w-6" />
              <h1 className="text-2xl font-semibold">Your Group</h1>
            </div>
            {/* <button className="border-2 font-bold text-red-700 hover:text-red-600 flex items-center hover:bg-red-50 gap-2">
              <RxCross2 className="font-bold text-red-700 h-4 w-4" />
              Leave Group
            </button> */}
          </header>

          <Card className="bg-gray-100 mt-6 p-6">
            <div className="flex items-center gap-3">
              <FaUserGroup className="h-5 w-5 text-gray-900" />
              <div>
                <h2 className="text-lg font-medium">Group Members ({members.length}/3)</h2>
                <h1 className="mt-1 text-sm text-gray-500">Add your group members below</h1>
                <hr />
              </div>
            </div>

            <div className="space-y-4 mt-4">
              {members.map((member, index) => (
                <div key={index} className="p-4 rounded-md border bg-gray-50 border-gray-100 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="Member Name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, "name", e.target.value)}
                        className="w-full p-2 border rounded mb-2 md:mb-0"
                      />
                      <input
                        type="text"
                        placeholder="Roll Number"
                        value={member.id}
                        onChange={(e) => handleMemberChange(index, "id", e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <button
                      onClick={() => removeMember(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <Button onClick={addMember} disabled={members.length >= 3} className=" bg-[rgb(21,21,21)] mt-2">
                Add Member
              </Button>
            </div>
          </Card>

         <Button
  className="gap-2 bg-[rgb(21,21,21)] mt-6 absolute right-63 hover:bg-gray-900"
  onClick={() => {
    localStorage.setItem('groupMembers', JSON.stringify(members));
    window.location.href = "/student-dashboard/create-project"; // adjust path if needed
  }}
>
  <FaProjectDiagram className="mr-2" />
  Create Project
  <ArrowRight className="h-4 w-4" />
</Button>
</div>
     
       
      </main>
    </div>
  );
}
