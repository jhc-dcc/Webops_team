import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Email configuration with better error handling
const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add these options for better Gmail compatibility
      tls: {
        rejectUnauthorized: false,
      },
    });
  } catch (error) {
    console.error("Error creating transporter:", error);
    return null;
  }
};

// Registration welcome email template
const getWelcomeEmailTemplate = (fullName: string, team: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #000; color: #fff; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: #dc2626; margin: 0 0 10px 0;">Welcome to DCC!</h1>
        <h2 style="margin: 0; font-weight: normal;">Dot Com Club Membership 2025-26</h2>
      </div>
      
      <div style="background-color: #fff; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="color: #dc2626;">Hello ${fullName}! 🎉</h3>
        
        <p>Thank you for registering with the <strong>Dot Com Club</strong>! We're excited to have you join our amazing community.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin: 0 0 10px 0;">📝 Registration Details:</h4>
          <p style="margin: 5px 0;"><strong>Team:</strong> ${team}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> Payment verification in progress</p>
        </div>
        
        <h4 style="color: #dc2626;">What's Next?</h4>
        <ul style="line-height: 1.6;">
          <li>Your payment screenshot is being verified by our team</li>
          <li>Once verified, you'll be added to our exclusive WhatsApp group</li>
          <li>Stay tuned for upcoming events and activities!</li>
        </ul>
        
        <div style="background-color: #e8f5e8; border: 1px solid #4ade80; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #059669; margin: 0 0 10px 0;">📱 WhatsApp Group Access:</h4>
          <p style="margin: 5px 0;">After payment verification, you'll be added to our official WhatsApp group where you can:</p>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>Get instant updates about events and activities</li>
            <li>Connect with fellow club members</li>
            <li>Receive important announcements</li>
          </ul>
        </div>
        
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #1d4ed8; margin: 0 0 10px 0;">📱 Follow Us:</h4>
          <p style="margin: 5px 0;">Stay connected on social media for updates:</p>
          <p style="margin: 5px 0;">Email: jhcdotcomclub.official@gmail.com</p>
          <p style="margin: 5px 0;">Website: www.jhcdotcomclub.com</p>
        </div>
        
        <p style="margin-top: 30px;">If you have any questions, feel free to reach out to us!</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          <strong style="color: #dc2626;">The DCC Team</strong><br>
          Dot Com Club
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>This email was sent to you because you registered for DCC Membership 2025-26.</p>
        <p>© 2025 Dot Com Club. All rights reserved.</p>
      </div>
    </div>
  `;
};

// CL Registration confirmation email template
const getCLRegistrationTemplate = (
  clName: string,
  collegeName: string,
  attendingClMeet: boolean
) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #000; color: #fff; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: #dc2626; margin: 0 0 10px 0;">CL Registration Confirmed!</h1>
        <h2 style="margin: 0; font-weight: normal;">Contingent Leader - Cyberstrike 2025</h2>
      </div>
      
      <div style="background-color: #fff; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="color: #dc2626;">Hello ${clName}!</h3>
        
        <p>Thank you for registering as a <strong>Contingent Leader</strong> for <strong>${collegeName}</strong>. We're excited to have you lead your college contingent at Cyberstrike 2025!</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin: 0 0 10px 0;">Registration Details:</h4>
          <p style="margin: 5px 0;"><strong>College:</strong> ${collegeName}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> Registration confirmed</p>
          <p style="margin: 5px 0;"><strong>CL Meet Attendance:</strong> ${
            attendingClMeet ? "Yes" : "No"
          }</p>
        </div>
        
        <div style="background-color: #e8f5e8; border: 1px solid #4ade80; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #059669; margin: 0 0 10px 0;">CL Meet - 12th November 2025</h4>
          ${
            attendingClMeet
              ? `
            <p style="margin: 5px 0;">You have confirmed your attendance for the CL Meet.</p>
            <p style="margin: 10px 0; font-weight: bold;">What to expect:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Detailed briefing about Cyberstrike 2025</li>
              <li>Rules and regulations for all events</li>
              <li>Registration process for team members</li>
              <li>Important dates and schedules</li>
            </ul>
            <p style="margin: 10px 0; color: #059669; font-weight: bold;">Further details about the venue and timing will be shared before the event day.</p>
          `
              : `
            <p style="margin: 5px 0;">You have indicated that you will not be attending the CL Meet.</p>
            <p style="margin: 10px 0;">Important information and updates will be shared via email. Please check your inbox regularly.</p>
          `
          }
        </div>
        
        <div style="background-color: #f3e8ff; border: 1px solid #c084fc; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h4 style="color: #7c3aed; margin: 0 0 15px 0;">Download Your Digital Access Card</h4>
          <p style="margin: 10px 0;">Your personalized CL access card is ready!</p>
          <a href="https://www.jhcdotcomclub.com/cyberstrike-25/cl/confirm" 
             style="display: inline-block; background-color: #7c3aed; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; font-weight: bold;">
            View & Download ID Cards
          </a>
          <p style="margin: 10px 0; font-size: 14px; color: #666;">
            Access your digital ID cards anytime from the confirmation page
          </p>
        </div>
        
        <h4 style="color: #dc2626;">What's Next?</h4>
        <ul style="line-height: 1.6;">
          <li>Download your digital access cards from the link above</li>
          <li>Your documents are being verified by our team</li>
          <li>Further details about the CL Meet will be sent before the event</li>
          <li>Start preparing your college contingent!</li>
        </ul>
        
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #1d4ed8; margin: 0 0 10px 0;">Stay Connected:</h4>
          <p style="margin: 5px 0;">Email: jhcdotcomclub.official@gmail.com</p>
          <p style="margin: 5px 0;">Website: www.jhcdotcomclub.com</p>
        </div>
        
        <p style="margin-top: 30px;">If you have any questions, feel free to reach out to us!</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          <strong style="color: #dc2626;">The DCC Team</strong><br>
          Dot Com Club - JHC
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>This email was sent because you registered as a Contingent Leader for Cyberstrike 2025.</p>
        <p>© 2025 Dot Com Club. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Newsletter subscription confirmation email template
const getNewsletterWelcomeTemplate = (email: string) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #000; color: #fff; padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: #dc2626; margin: 0 0 10px 0;">Welcome to DCC Newsletter!</h1>
        <h2 style="margin: 0; font-weight: normal;">Stay Updated with Dot Com Club</h2>
      </div>
      
      <div style="background-color: #fff; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3 style="color: #dc2626;">Thank you for subscribing!</h3>
        
        <p>Welcome to the <strong>DCC Newsletter</strong>! You're now part of our exclusive community of tech enthusiasts.</p>
        
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #dc2626; margin: 0 0 10px 0;">📮 What to Expect:</h4>
          <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.6;">
            <li>Latest updates on DCC events and activities</li>
            <li>Exclusive invitations to workshops and hackathons</li>
            <li>Early access to registration for limited events</li>
          </ul>
        </div>
        
        <div style="background-color: #e8f5e8; border: 1px solid #4ade80; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #059669; margin: 0 0 10px 0;">🎯 Next Steps:</h4>
          <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.6;">
            <li>Keep an eye on your inbox for our updates</li>
            <li>Follow us on social media for daily updates</li>
            <li>Join our WhatsApp community for instant notifications</li>
            <li>Consider becoming a full DCC member for exclusive benefits</li>
          </ul>
        </div>
        
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h4 style="color: #1d4ed8; margin: 0 0 10px 0;">🌐 Stay Connected:</h4>
          <p style="margin: 5px 0;">Email: jhcdotcomclub.official@gmail.com</p>
          <p style="margin: 5px 0;">Website: www.jhcdotcomclub.com</p>
          <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">
            Want to become a full member? <a href="https://www.jhcdotcomclub.com/register" style="color: #dc2626;">Register here</a>
          </p>
        </div>
        
        <p style="margin-top: 30px;">We're excited to have you as part of our tech community!</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Best regards,<br>
          <strong style="color: #000;">The DCC Team</strong><br>
          Dot Com Club
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>This email was sent to ${email} because you subscribed to our newsletter.</p>
        <p>© 2025 Dot Com Club. All rights reserved.</p>
        <p style="margin-top: 10px;">
          <a href="#" style="color: #999; text-decoration: none;">Unsubscribe</a> | 
        </p>
      </div>
    </div>
  `;
};

export async function POST(request: NextRequest) {
  console.log("Email API called");

  try {
    const body = await request.json();
    console.log("Request body type:", body.type);

    const {
      email,
      fullName,
      team,
      type,
      clEmail,
      aclEmail,
      clName,
      collegeName,
      attendingClMeet,
    } = body;

    // Validate email format based on type
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (type === "cl-registration") {
      // For CL registration, validate clEmail and aclEmail
      if (!clEmail || !emailRegex.test(clEmail)) {
        return NextResponse.json(
          { error: "Invalid CL email address" },
          { status: 400 }
        );
      }
      if (!aclEmail || !emailRegex.test(aclEmail)) {
        return NextResponse.json(
          { error: "Invalid Assistant CL email address" },
          { status: 400 }
        );
      }
    } else {
      // For other types, validate email field
      if (!email || !emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email address" },
          { status: 400 }
        );
      }
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("SMTP credentials not configured");
      return NextResponse.json(
        {
          message: "Email service not configured, but subscription successful",
        },
        { status: 200 }
      );
    }

    // Create transporter
    const transporter = createTransporter();
    if (!transporter) {
      console.error("Failed to create email transporter");
      return NextResponse.json(
        { message: "Subscription successful, but email service unavailable" },
        { status: 200 }
      );
    }

    // Handle different email types
    if (type === "cl-registration") {
      // CL Registration emails
      if (!clEmail || !aclEmail || !clName || !collegeName) {
        return NextResponse.json(
          { error: "Missing required fields for CL registration email" },
          { status: 400 }
        );
      }

      console.log("Sending CL registration emails");

      try {
        // Send email to CL
        const clMailOptions = {
          from: `"DCC - Dot Com Club" <${process.env.SMTP_USER}>`,
          to: clEmail,
          subject: "CL Registration Confirmed - Cyberstrike 2025",
          html: getCLRegistrationTemplate(clName, collegeName, attendingClMeet),
        };

        await transporter.sendMail(clMailOptions);
        console.log("CL email sent successfully");

        // Send email to Assistant CL
        const aclMailOptions = {
          from: `"DCC - Dot Com Club" <${process.env.SMTP_USER}>`,
          to: aclEmail,
          subject: "Assistant CL Registration Confirmed - Cyberstrike 2025",
          html: getCLRegistrationTemplate(
            "Assistant Contingent Leader",
            collegeName,
            attendingClMeet
          ),
        };

        await transporter.sendMail(aclMailOptions);
        console.log("Assistant CL email sent successfully");

        return NextResponse.json(
          { message: "CL registration emails sent successfully" },
          { status: 200 }
        );
      } catch (emailError) {
        console.error("CL email sending failed:", emailError);
        return NextResponse.json(
          { message: "Registration successful, but emails could not be sent" },
          { status: 200 }
        );
      }
    } else if (type === "newsletter") {
      // Newsletter subscription
      console.log("Sending newsletter welcome email to:", email);

      const mailOptions = {
        from: `"DCC Newsletter" <${process.env.SMTP_USER}>`,
        to: email,
        subject:
          "Welcome to DCC Newsletter! Stay Updated with Latest Tech Events",
        html: getNewsletterWelcomeTemplate(email),
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Newsletter welcome email sent successfully");

        return NextResponse.json(
          { message: "Newsletter welcome email sent successfully" },
          { status: 200 }
        );
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        return NextResponse.json(
          { message: "Subscription successful, but email could not be sent" },
          { status: 200 }
        );
      }
    } else {
      // Registration email (existing functionality)
      if (!fullName || !team) {
        return NextResponse.json(
          { error: "Missing required fields for registration email" },
          { status: 400 }
        );
      }

      console.log("Sending registration welcome email to:", email);

      const mailOptions = {
        from: `"DCC - Dot Com Club" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Welcome to DCC! 🎉 Registration Confirmation",
        html: getWelcomeEmailTemplate(fullName, team),
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Registration email sent successfully");

        return NextResponse.json(
          { message: "Registration email sent successfully" },
          { status: 200 }
        );
      } catch (emailError) {
        console.error("Registration email sending failed:", emailError);
        return NextResponse.json(
          { message: "Registration successful, but email could not be sent" },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
