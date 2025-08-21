// app/admin/dashboard/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Users, BarChart2 } from "lucide-react";
import LeadsTable from "@/components/admin/LeadsTable";
import { ILead } from "@/models/Lead";
import Link from "next/link";
import clientPromise from "@/lib/db/mongodb";

async function getLeads(): Promise<ILead[]> {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/admin/leads`, {
    headers: {
      "Cookie": require("next/headers").headers().get("Cookie") || "",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch leads:", res.statusText);
    return [];
  }
  return res.json();
}

// New function to get the log count directly from the database
async function getLogCount(): Promise<number> {
    try {
        const client = await clientPromise;
        const db = client.db();
        const systemLogsCount = await db.collection("system_logs").countDocuments();
        const analyticsEventsCount = await db.collection("analytics_events").countDocuments();
        return systemLogsCount + analyticsEventsCount;
    } catch (error) {
        console.error("Failed to fetch log count:", error);
        return 0;
    }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "Admin") {
    redirect("/admin/login");
  }

  // Fetch both sets of data in parallel
  const [leads, logCount] = await Promise.all([
    getLeads(),
    getLogCount()
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="mt-1 text-gray-600">
          A summary of your landing page activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-600">Total Leads</h3>
            <Users className="w-6 h-6 text-blue-500" />
          </div>
          <p className="mt-2 text-4xl font-bold text-gray-900">{leads.length}</p>
        </div>
        <Link href="/admin/logs" className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-600">Total Log Events</h3>
            <BarChart2 className="w-6 h-6 text-green-500" />
          </div>
          <p className="mt-2 text-4xl font-bold text-gray-900">{logCount}</p>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Lead Submissions
        </h3>
        <LeadsTable leads={leads} />
      </div>
    </div>
  );
}
