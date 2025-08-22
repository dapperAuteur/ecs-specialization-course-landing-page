// lib/data/logs.ts

import clientPromise from "@/lib/db/mongodb";

/**
 * Fetches all system and analytics logs from the database, combines them,
 * and sorts them by the most recent timestamp.
 * @returns {Promise<any[]>} A promise that resolves to an array of combined log objects.
 */
export async function getAllLogs(): Promise<any[]> {
  try {
    const client = await clientPromise;
    const db = client.db();

    const systemLogs = await db.collection("system_logs").find({}).toArray();
    const analyticsEvents = await db.collection("analytics_events").find({}).toArray();

    const allLogs = [...systemLogs, ...analyticsEvents].sort((a, b) => {
      // Ensure timestamps are valid Date objects for comparison
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    });
    
    // Serialize the data to ensure it's a plain JSON object for the client component
    return JSON.parse(JSON.stringify(allLogs));
  } catch (error) {
    console.error("Database Error: Failed to fetch logs.", error);
    return [];
  }
}
