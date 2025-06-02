// pages/api/project-requests.ts
import { NextApiRequest, NextApiResponse } from 'next';

import { db } from '../lib/firebase';
import { DevBundler } from 'next/dist/server/lib/router-utils/setup-dev-bundler';
import { doc, getDoc, updateDoc, collection, getDocs, query } from 'firebase/firestore';

// This route will fetch project requests for a supervisor
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method === 'GET') {
    const { supervisorId } = req.query;

    if (!supervisorId) {
      return res.status(400).json({ message: 'Supervisor ID is required' });
    }

    try {
      const projectRequestsRef = collection(db, 'supervisors', supervisorId as string, 'projectRequests');
      const q = query(projectRequestsRef);
      const querySnapshot = await getDocs(q);

      const projectRequests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json(projectRequests);
    } catch (error) {
      console.error('Error fetching project requests:', error);
      return res.status(500).json({ message: 'Failed to fetch project requests' });
    }
  }

  // Handle updating the status of a project request (PUT method)
  if (method === 'PUT') {
    const { id, status, supervisorId } = req.body;

    if (!id || !status || !supervisorId) {
      return res.status(400).json({ message: 'ID, status, and supervisorId are required' });
    }

    try {
      const projectRequestDoc = doc(db, 'supervisors', supervisorId, 'projectRequests', id);
      await updateDoc(projectRequestDoc, {
        status,
      });

      return res.status(200).json({ message: 'Project request status updated successfully' });
    } catch (error) {
      console.error('Error updating project request status:', error);
      return res.status(500).json({ message: 'Failed to update project request status' });
    }
  }

  // If method is not GET or PUT
  return res.status(405).json({ message: 'Method Not Allowed' });
}
