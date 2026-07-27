"use client";

import { PaymentUpload } from "@/components/payment-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RegistrationData {
  email: string;
  fullName: string;
  uid: string;
  contactNo: string;
  department: string;
  year: string;
  team: string;
  tshirtSize: string;
  hearAboutDCC: string;
}

export default function PaymentConfirmation() {
  const router = useRouter();
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const createMember = useMutation(api.registration.createMember);

  useEffect(() => {
    // Get registration data from localStorage
    const data = localStorage.getItem("registrationData");
    if (data) {
      try {
        setRegistrationData(JSON.parse(data));
      } catch (error) {
        console.error("Error parsing registration data:", error);
        router.push("/register");
      }
    } else {
      // If no registration data, redirect to register page
      router.push("/register");
    }
  }, [router]);

  const handlePaymentUpload = (url: string) => {
    setPaymentScreenshotUrl(url);
  };

  const handleSubmit = async () => {
    if (!registrationData || !paymentScreenshotUrl) {
      alert("Please upload your payment screenshot before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save registration to database
      await createMember({
        ...registrationData,
        paymentScreenshotUrl,
      });

      // Send welcome email
      try {
        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: registrationData.email,
            fullName: registrationData.fullName,
            team: registrationData.team,
          }),
        });

        if (emailResponse.ok) {
          console.log("Welcome email sent successfully");
        } else {
          console.log("Email sending failed, but registration saved");
        }
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        // Continue with success flow even if email fails
      }

      // Clear localStorage
      localStorage.removeItem("registrationData");

      // Show success message
      setShowSuccess(true);

      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert("Error submitting registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen py-8 px-4 pt-32 bg-black">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center bg-black border-green-500/30">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-green-400">
                Registration Complete! 🎉
              </CardTitle>
              <CardDescription className="text-lg mt-2 text-gray-300">
                Your payment screenshot has been submitted for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded-md p-4">
                <p className="text-green-300">
                  Thank you for registering with DCC! We will verify your payment and send you a confirmation email within 24 hours.
                </p>
              </div>
              <p className="text-gray-400">
                You will be redirected to the homepage shortly...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 pt-32 bg-black">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg bg-black border-red-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">
              Payment Confirmation
            </CardTitle>
            <CardDescription className="text-gray-300 mt-2">
              Upload your payment screenshot to complete registration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Registration Summary */}
            <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Registration Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white ml-2">{registrationData.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">{registrationData.email}</span>
                </div>
                <div>
                  <span className="text-gray-400">Department:</span>
                  <span className="text-white ml-2">{registrationData.department}</span>
                </div>
                <div>
                  <span className="text-gray-400">Team:</span>
                  <span className="text-white ml-2">{registrationData.team}</span>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Payment Instructions</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p className="text-white font-medium">Please follow these steps exactly:</p>
                <ol className="list-decimal list-inside space-y-2 ml-2">
                  <li>
                    Click on:
                    <a
                      href="https://forms.eduqfix.com/sindseminarform/add"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline ml-1"
                    >
                      https://forms.eduqfix.com/sindseminarform/add
                    </a>
                  </li>
                  <li>Under select form type, choose: <strong className="text-white">MISC FEES</strong></li>
                  <li>Fill all details correctly</li>
                  <li>
                    Under payment details:
                    <ul className="ml-4 mt-1 space-y-1 font-bold text-primary text-base">
                      <li>Amount: <strong className="text-white">300</strong></li>
                      <li>Purpose of amount: <strong className="text-white">*DCC_95*</strong></li>
                    </ul>
                  </li>
                  <li>After clicking &quot;submit&quot;, you will be directed to pay an amount of <strong className="text-white">Rs.300</strong> to complete the procedure</li>
                  <li>Take a screenshot of the page where it states that the <strong className="text-green-400">payment is successful</strong></li>
                </ol>
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-md p-3 mt-4">
                  <p className="text-yellow-300 text-xs">
                    ⚠️ <strong>Important:</strong> Upload the screenshot showing &quot;payment successful&quot; message after completing the payment process.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Upload */}
            <PaymentUpload
              onUploadComplete={handlePaymentUpload}
              uploadedUrl={paymentScreenshotUrl}
            />

            {/* Submit Button */}
            <div className="flex flex-col space-y-4">
              <Button
                onClick={handleSubmit}
                disabled={!paymentScreenshotUrl || isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                {isSubmitting ? "Submitting Registration..." : "Complete Registration"}
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/register")}
                className="w-full border-red-500/30 text-red-400 hover:bg-red-900/10"
              >
                Back to Registration
              </Button>
            </div>

            <div className="text-xs text-gray-400 text-center">
              <p>
                Your registration will be verified once we confirm your payment.
                You will receive a confirmation email within 24-48 hours.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
