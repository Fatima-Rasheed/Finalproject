// app/api/projects/route.ts

import { NextResponse } from "next/server";


import { db } from '../../lib/firebase';
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "projects"));

    const projects = snapshot.docs.map((doc, index) => {
      const data = doc.data();

      return {
        id: doc.id,
        groupNumber: index + 1, // You can change this logic if you store it
        name: data.name || "Untitled",
        supervisor: data.supervisor || "Unknown",
        numberOfStudents: (data.groupMembers?.length || 0) + 1, // Group leader + members
        area: data.type || "N/A",
        status: data.status || "Pending",
      };
    });

    return NextResponse.json(projects);
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    return new NextResponse("Failed to fetch projects", { status: 500 });
  }
}
