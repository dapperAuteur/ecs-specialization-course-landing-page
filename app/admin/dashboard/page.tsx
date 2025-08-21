// app/admin/dashboard/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Users, BarChart2, AlertTriangle } from "lucide-react";
import LeadsTable from "@/components/admin/LeadsTable";
import { ILead } from "@/models/Lead";

// Helper function to fetch leads from our secure API endpoint
async function getLeads(): Promise<ILead[]> {
  // We need the full URL for server-side fetching
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/admin/leads`, {
    // This passes the session cookie to the API route for authentication
    headers: {
      "Cookie": require("next/headers").headers().get("Cookie") || "",
    },
    cache: "no-store", // Ensure we always get the latest data
  });

  if (!res.ok) {
    console.error("Failed to fetch leads:", res.statusText);
    // Return an empty array or throw an error
    return [];
  }
  return res.json();
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "Admin") {
    redirect("/admin/login");
  }

  const leads = await getLeads();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="mt-1 text-gray-600">
          A summary of your landing page activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-600">Total Leads</h3>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <p className="mt-2 text-4xl font-bold text-gray-900">{leads.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-600">Total Log Events</h3>
            <BarChart2 className="w-6 h-6 text-green-500" />
          </div>
          {/* We will fetch log data in the next step */}
          <p className="mt-2 text-4xl font-bold text-gray-900">N/A</p>
        </div>
      </div>

      {/* Leads Table Section */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Lead Submissions
        </h3>
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}
