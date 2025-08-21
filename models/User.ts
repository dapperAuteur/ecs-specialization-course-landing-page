import mongoose, { Schema, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  zipCode: {
    type: String,
    required: [false, 'Zip code is NOT required.'],
    match: [/^\d{5}$/, 'Please fill a valid 5-digit zip code'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    select: false,
  },
  role: {
    type: String,
    enum: ['User', 'Teammate', 'Admin'], // Simplified roles
    default: 'User',
  },
  stripeCustomerId: {
    type: String,
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'inactive', 'lifetime', 'canceled'],
    default: 'inactive',
  },
  stripeSubscriptionId: {
    type: String,
  },
}, {
  timestamps: true,
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

const User = models.User || mongoose.model('User', UserSchema);

export default User;