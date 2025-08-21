import mongoose, { Schema, Document, models } from 'mongoose';

export interface ILead extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  interest?: string;
}

const LeadSchema: Schema = new Schema({
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
}, {
  timestamps: true,
});

const Lead = models.Lead || mongoose.model<ILead>('Lead', LeadSchema);

export default Lead;