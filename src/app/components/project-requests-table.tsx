'use client';

import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

interface ProjectRequest {
  id: string;
  studentEmail: string;
  name: string;
  type: string;
  status: string;
}

interface ProjectRequestsTableProps {
  projectRequests: ProjectRequest[];
  onUpdateStatus: (id: string, newStatus: string) => void;
}

export default function ProjectRequestsTable({
  projectRequests,
  onUpdateStatus,
}: ProjectRequestsTableProps) {
  const [requests, setRequests] = useState(projectRequests);

  const handleStatusChange = (id: string, newStatus: string) => {
    // Update the local UI state
    const updatedRequests = requests.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req
    );
    setRequests(updatedRequests);

    // Optionally notify parent or perform API call
    onUpdateStatus(id, newStatus);
  };

  return (
    <div className="border rounded-md overflow-hidden shadow-lg">
      <Table className="w-full">
        <TableHeader className="bg-[rgb(21,21,21)] text-white">
          <TableRow>
            <TableHead className="px-4 py-6 font-semibold text-left">ID</TableHead>
            <TableHead className="px-4 py-6 font-semibold text-left">Student Email</TableHead>
            <TableHead className="px-4 py-6 font-semibold text-left">Project Title</TableHead>
            <TableHead className="px-4 py-6 font-semibold text-left">Type</TableHead>
            <TableHead className="px-4 py-6 font-semibold text-left">Status</TableHead>
            <TableHead className="px-4 py-6 font-semibold text-left">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.length > 0 ? (
            requests.map((request, index) => (
              <TableRow
                key={request.id}
                className={`transition duration-300 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                } hover:bg-gray-200`}
              >
                <TableCell className="px-4 py-3">{request.id}</TableCell>
                <TableCell className="px-4 py-3">{request.studentEmail}</TableCell>
                <TableCell className="px-4 py-3">{request.name}</TableCell>
                <TableCell className="px-4 py-3">{request.type}</TableCell>
                <TableCell className="px-4 py-3">{request.status}</TableCell>
                <TableCell className="px-4 py-3 text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 bg-blue-100 text-blue-900 hover:bg-blue-200"
                  >
                    View
                  </Button>
                  {request.status !== "Approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(request.id, "Approved")}
                      className="bg-green-100 text-green-900 hover:bg-green-200"
                    >
                      Approve
                    </Button>
                  )}
                  {request.status !== "Rejected" && (
                    <Button
                      size="sm"
                      onClick={() => handleStatusChange(request.id, "Rejected")}
                      className="bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      Reject
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center font-semibold bg-white text-gray-700">
                No project requests available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}