import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/dbConnect';
import Lead from '@/models/Lead';

// Define the structure of the request body
interface RequestBody {
  firstName: string;
  lastName:string;
  email: string;
  phone: string;
  interest?: string;
  token: string;
}

/**
 * Handles POST requests to create a new lead after verifying reCAPTCHA.
 * @param request - The incoming request object.
 */
export async function POST(request: Request) {
  try {
    await dbConnect(); // Ensure database connection is established

    const { firstName, lastName, email, phone, interest, token }: RequestBody = await request.json();
    
    // 1. Validate form data
    if (!firstName || !lastName || !email || !phone || !token) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // 2. Verify the reCAPTCHA token with Google
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`;
    
    const recaptchaResponse = await fetch(verificationUrl, { method: 'POST' });
    const recaptchaData = await recaptchaResponse.json();

    // 3. Check reCAPTCHA verification results
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      // The score threshold (0.5) can be adjusted based on your needs.
      console.warn('reCAPTCHA verification failed:', recaptchaData);
      return NextResponse.json({ message: 'Bot detection failed. Please try again.' }, { status: 403 });
    }

    // 4. Check if a lead with this email already exists
    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
      return NextResponse.json({ message: 'This email is already on our early access list.' }, { status: 409 });
    }

    // 5. Create and save the new lead if verification is successful
    const newLead = new Lead({
      firstName,
      lastName,
      email,
      phone,
      interest,
    });

    await newLead.save();

    // Return a success response
    return NextResponse.json({ 
      message: 'Successfully joined the early access list!', 
      lead: { firstName, email } 
    }, { status: 201 });

  } catch (error) {
    console.error('Lead submission error:', error);
    // Return a generic server error response
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}