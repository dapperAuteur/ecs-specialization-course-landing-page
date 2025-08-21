// components/admin/LeadsTable.tsx
"use client";

import { ILead } from "@/models/Lead"; // Assuming ILead is exported from your Lead model

interface LeadsTableProps {
  leads: ILead[];
}

// A simple utility to format dates
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function LeadsTable({ leads }: LeadsTableProps) {
  if (!leads || leads.length === 0) {
    return <p className="text-gray-500">No lead submissions yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leads.map((lead) => (
            <tr key={lead._id.toString()}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${lead.firstName} ${lead.lastName}`}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.phone}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.interest || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
