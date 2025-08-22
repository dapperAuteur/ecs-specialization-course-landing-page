// models/Lead.ts

import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Define the interface for the Lead document
export interface ILead extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest?: string;
  industryRoles?: string[];
  createdAt: string;
  updatedAt: string;
}

// Define the Mongoose schema for the Lead
const LeadSchema: Schema<ILead> = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required.'],
    trim: true,
  },
  interest: {
    type: String,
    trim: true,
  },
  industryRoles: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

const Lead: Model<ILead> = models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;
