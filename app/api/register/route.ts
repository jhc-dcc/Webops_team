import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

export async function POST(request: Request) {
  try {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      console.error('NEXT_PUBLIC_CONVEX_URL is not configured');
      return NextResponse.json(
        { success: false, error: 'Registration service is not configured' },
        { status: 503 }
      );
    }

    const client = new ConvexHttpClient(convexUrl);
    const body = await request.json();
    
    // Insert the registration using the existing registration mutation
    const result = await client.mutation(api.registration.createMember, {
      fullName: body.name,
      email: body.email,
      contactNo: body.phone,
      department: body.course,
      departmentOther: body.stream || undefined,
      year: body.yearOfStudy || "",
      uid: `${body.email}-${Date.now()}`,
      team: "sony-registration",
      tshirtSize: "NA",
      hearAboutDCC: "sony-event",
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error processing registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process registration' },
      { status: 500 }
    );
  }
}