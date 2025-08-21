// components/admin/LogsTable.tsx
"use client";

// A simple utility to format dates
const formatDate = (dateString: string | Date) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// Helper to determine the log level color
const getLevelColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'error': return 'bg-red-100 text-red-800';
    case 'warning': return 'bg-yellow-100 text-yellow-800';
    case 'info': return 'bg-blue-100 text-blue-800';
    case 'debug': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function LogsTable({ logs }: { logs: any[] }) {
  if (!logs || logs.length === 0) {
    return <p className="text-gray-500">No log events found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Context / Event</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {logs.map((log) => (
            <tr key={log._id.toString()}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(log.timestamp)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(log.level || log.eventType)}`}>
                  {log.level || log.eventType}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.context || 'Analytics'}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{log.message || `User action: ${log.eventType}`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
