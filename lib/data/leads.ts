// lib/data/leads.ts

import dbConnect from "@/lib/db/dbConnect";
import Lead, { ILead } from "@/models/Lead";

/**
 * Fetches all leads from the database, sorted by the most recent.
 * This function can be called directly from Server Components or API routes.
 * @returns {Promise<ILead[]>} A promise that resolves to an array of leads.
 */
export async function getAllLeads(): Promise<ILead[]> {
  try {
    await dbConnect();
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();
    
    // Mongoose's .lean() returns plain JS objects, but we need to serialize the ObjectId
    return JSON.parse(JSON.stringify(leads));
  } catch (error) {
    console.error("Database Error: Failed to fetch leads.", error);
    // In a real app, you'd want to log this error to a service
    return [];
  }
}
