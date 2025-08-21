// app/api/admin/leads/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/db/dbConnect";
import Lead from "@/models/Lead";
import { Logger, LogContext } from "@/logging/logger";
import { CustomSession } from "@/types/next-auth"; // Assuming you've defined CustomSession

export async function GET(request: Request) {
  // Explicitly type the session to include the 'role' property
  const session = await getServerSession(authOptions);

  // 1. Authentication and Authorization Check (Casting session.user to Session['user'] to ensure type safety)
  if (!session || (session.user as CustomSession['user'])?.role !== "Admin") {
    await Logger.warning(LogContext.SYSTEM, "Unauthorized access attempt to /api/admin/leads", { request });
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    // 2. Fetch leads from the database, sorted by most recent
    const leads = await Lead.find({}).sort({ createdAt: -1 });
    // Ensure session.user.email is not undefined before using it
    const adminEmail = session.user?.email || 'unknown';
    await Logger.info(LogContext.SYSTEM, `Admin user ${adminEmail} fetched leads.`, {
      metadata: { leadCount: leads.length }
    });

    // 3. Return the data
    return NextResponse.json(leads, { status: 200 });

  } catch (error) {
    await Logger.error(LogContext.SYSTEM, "Error fetching leads for admin dashboard", {
      metadata: { error }
    });
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
