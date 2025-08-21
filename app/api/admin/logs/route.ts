// app/api/admin/logs/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import clientPromise from "@/lib/db/mongodb"; // Using the raw driver for more control
import { Logger, LogContext } from "@/logging/logger";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "Admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch all logs from both collections
    const systemLogs = await db.collection("system_logs").find({}).sort({ timestamp: -1 }).toArray();
    const analyticsEvents = await db.collection("analytics_events").find({}).sort({ timestamp: -1 }).toArray();

    // Combine and sort the logs
    const allLogs = [...systemLogs, ...analyticsEvents].sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return NextResponse.json(allLogs, { status: 200 });

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, "Error fetching all logs for admin dashboard", {
      metadata: { error }
    });
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
