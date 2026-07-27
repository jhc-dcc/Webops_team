import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Phone validation function for Indian numbers
const validatePhoneNumber = (phone: string): boolean => {
  // Remove all spaces, hyphens, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  // Check for Indian number patterns:
  // 1. 10 digits starting with 6-9: 9876543210
  // 2. +91 followed by 10 digits: +919876543210
  // 3. 0091 followed by 10 digits: 00919876543210
  // 4. 91 followed by 10 digits: 919876543210

  const patterns = [
    /^[6-9]\d{9}$/, // 10 digits starting with 6-9
    /^\+91[6-9]\d{9}$/, // +91 followed by 10 digits starting with 6-9
    /^0091[6-9]\d{9}$/, // 0091 followed by 10 digits starting with 6-9
    /^91[6-9]\d{9}$/, // 91 followed by 10 digits starting with 6-9
  ];

  return patterns.some((pattern) => pattern.test(cleanPhone));
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();
    const { name, email, phone, department, departmentOther, year } = formData;

    // Validate required fields
    if (!name || !email || !phone || !department || !year) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!validatePhoneNumber(phone)) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid Indian phone number (10 digits, with or without country code +91)",
        },
        { status: 400 }
      );
    }

    // Validate department if Other is selected
    if (department === "Other" && !departmentOther) {
      return NextResponse.json(
        { error: "Please specify your department" },
        { status: 400 }
      );
    }

    // Call the Convex mutation
    const result = await convex.mutation(api.sonyRegistrations.create, {
      name,
      email,
      phone,
      department,
      departmentOther: department === "Other" ? departmentOther : undefined,
      year,
    });

    return NextResponse.json({
      success: true,
      message: "Registration successful!",
      data: result,
    });
  } catch (error: unknown) {
    console.error("Sony registration error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    if (errorMessage === "Email already registered") {
      return NextResponse.json(
        { error: "This email is already registered for the Sony event" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}