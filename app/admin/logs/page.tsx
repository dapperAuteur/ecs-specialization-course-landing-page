// app/admin/logs/page.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import LogsTable from "@/components/admin/LogsTable";
import { getAllLogs } from "@/lib/data/logs";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function getLogs() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/admin/logs`, {
    headers: {
      "Cookie": require("next/headers").headers().get("Cookie") || "",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch logs:", res.statusText);
    return [];
  }
  return res.json();
}

export default async function LogsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "Admin") {
    redirect("/admin/login");
  }

  const logs = await getAllLogs();

  return (
    <div className="space-y-6">
      <Link href="/admin/dashboard" className="inline-flex items-center text-sm text-blue-600 hover:underline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>
      <h2 className="text-3xl font-bold text-gray-900">System & Analytics Logs</h2>
      <div className="bg-white p-6 rounded-2xl shadow">
        <LogsTable logs={logs} />
      </div>
    </div>
  );
}
