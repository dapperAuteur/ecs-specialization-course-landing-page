"use client";

import { ILead } from "@/models/Lead";

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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry Roles</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leads.map((lead: ILead) => (
            <tr key={lead._id.toString()}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${lead.firstName} ${lead.lastName}`}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <div>{lead.email}</div>
                <div>{lead.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{lead.interest || 'N/A'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <div className="flex flex-wrap gap-2">
                  {lead.industryRoles && lead.industryRoles.length > 0 ? (
                    lead.industryRoles.map(role => (
                      <span key={role} className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(lead.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
