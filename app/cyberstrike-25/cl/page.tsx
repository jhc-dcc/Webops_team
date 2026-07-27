"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/utils/uploadthing";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const formSchema = z.object({
  // College Information
  collegeName: z.string().min(3, {
    message: "College name must be at least 3 characters.",
  }),
  collegeAddress: z.string().min(10, {
    message: "College address must be at least 10 characters.",
  }),

  // Contingent Leader Information
  clName: z.string().min(2, {
    message: "Contingent Leader name must be at least 2 characters.",
  }),
  clYear: z.enum(["FY", "SY", "TY"], {
    required_error: "Please select the current year.",
  }),
  clContact: z.string().regex(/^[6-9]\d{9}$/, {
    message: "Please enter a valid 10-digit contact number.",
  }),
  clEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  clFeeReceiptUrl: z.string().min(1, {
    message: "Please upload fee receipt or college ID.",
  }),
  clGovtIdUrl: z.string().min(1, {
    message: "Please upload government ID.",
  }),

  // Assistant Contingent Leader Information
  aclContact: z.string().regex(/^[6-9]\d{9}$/, {
    message: "Please enter a valid 10-digit contact number.",
  }),
  aclEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  aclFeeReceiptUrl: z.string().min(1, {
    message: "Please upload fee receipt or college ID.",
  }),
  aclGovtIdUrl: z.string().min(1, {
    message: "Please upload government ID.",
  }),

  // CL Meet Attendance
  attendingClMeet: z.enum(["yes", "no"], {
    required_error: "Please select whether you'll attend the CL meet.",
  }),
});

const CLRegistration = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createCLRegistration = useMutation(
    api.clRegistrations.createCLRegistration
  );
  const formStatus = useQuery(api.clRegistrations.getFormStatus);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      collegeName: "",
      collegeAddress: "",
      clName: "",
      clContact: "",
      clEmail: "",
      clFeeReceiptUrl: "",
      clGovtIdUrl: "",
      aclContact: "",
      aclEmail: "",
      aclFeeReceiptUrl: "",
      aclGovtIdUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      const registrationId = await createCLRegistration({
        collegeName: values.collegeName,
        collegeAddress: values.collegeAddress,
        clName: values.clName,
        clYear: values.clYear,
        clContact: values.clContact,
        clEmail: values.clEmail,
        clFeeReceiptUrl: values.clFeeReceiptUrl,
        clGovtIdUrl: values.clGovtIdUrl,
        aclContact: values.aclContact,
        aclEmail: values.aclEmail,
        aclFeeReceiptUrl: values.aclFeeReceiptUrl,
        aclGovtIdUrl: values.aclGovtIdUrl,
        attendingClMeet: values.attendingClMeet === "yes",
      });

      // Store registration ID with expiry date (November 13, 2025)
      if (registrationId) {
        const expiryDate = new Date("2025-11-13T23:59:59").getTime();
        const storageData = {
          id: registrationId,
          expiry: expiryDate,
        };
        localStorage.setItem("clRegistrationData", JSON.stringify(storageData));
      } else {
        throw new Error("Registration ID not returned");
      }

      // Send confirmation emails to CL and ACL
      fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "cl-registration",
          clEmail: values.clEmail,
          aclEmail: values.aclEmail,
          clName: values.clName,
          collegeName: values.collegeName,
          attendingClMeet: values.attendingClMeet === "yes",
        }),
      }).catch(() => {
        // Silently fail - email is not critical
      });

      // Small delay to ensure localStorage is set, then redirect
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push("/cyberstrike-25/cl/confirm");
    } catch (error) {
      console.error("Error submitting registration:", error);
      alert("Error submitting registration. Please try again.");
      setIsSubmitting(false);
    }
  }

  // Show loading state while checking form status
  if (formStatus === undefined) {
    return (
      <div className="min-h-screen py-8 px-4 pt-32">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin h-8 w-8 text-red-500" />
            <span className="text-white text-lg">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Check if form is closed
  if (formStatus === false) {
    return (
      <div className="min-h-screen py-8 px-4 pt-20 sm:pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-red-500/30">
            <CardHeader className="text-center p-4 sm:p-6">
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
                CL Registration Closed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-4 sm:p-6">
              <Alert className="border-red-500/30 bg-red-900/10">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-gray-300">
                  The Contingent Leader registration is currently closed. Please
                  check back later or contact us for more information.
                </AlertDescription>
              </Alert>
              <div className="flex justify-center">
                <Button
                  onClick={() => router.push("/")}
                  className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 pt-20 sm:pt-24 md:pt-32">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center p-4 sm:p-6">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
              Contingent Leader Registration
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2 text-sm sm:text-base">
              Register as a Contingent Leader for Cyberstrike 2025
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-4 sm:p-6">
            <Alert>
              <AlertDescription className="text-sm">
                * Indicates required question
              </AlertDescription>
            </Alert>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-md p-3 sm:p-4 text-blue-300">
              <p className="text-xs sm:text-sm">
                <strong>Important:</strong> The CL Meet is scheduled for{" "}
                <strong>12th November 2025.</strong>
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* College Information Section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                    College Information
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="collegeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            College Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter college name"
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="collegeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            College Address *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter complete college address"
                              className="min-h-[100px] text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Contingent Leader Section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                    Contingent Leader Details
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="clName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            Contingent Leader Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter full name"
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            Current Year *
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-2"
                            >
                              {["FY", "SY", "TY"].map((year) => (
                                <div
                                  key={year}
                                  className="flex items-center space-x-2"
                                >
                                  <RadioGroupItem
                                    value={year}
                                    id={`cl-${year}`}
                                  />
                                  <label
                                    htmlFor={`cl-${year}`}
                                    className="text-sm font-normal cursor-pointer"
                                  >
                                    {year}
                                  </label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            Contingent Leader Contact Number *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10-digit mobile number"
                              type="tel"
                              maxLength={10}
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            Contingent Leader Email *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="email@example.com"
                              type="email"
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clFeeReceiptUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            CL Fee Receipt / College ID *
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              {field.value ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-green-900/20 border border-green-500/30 rounded-md">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm text-green-300">
                                      File uploaded successfully
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => field.onChange("")}
                                    className="text-red-400 hover:text-red-300 text-xs sm:text-sm"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="w-full">
                                  <UploadButton
                                    endpoint="clFeeReceipt"
                                    onClientUploadComplete={(res) => {
                                      if (res?.[0]?.url) {
                                        field.onChange(res[0].url);
                                      }
                                    }}
                                    onUploadError={(error: Error) => {
                                      alert(`Upload error: ${error.message}`);
                                    }}
                                    className="ut-button:bg-red-600 ut-button:hover:bg-red-700 ut-button:w-full ut-button:text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clGovtIdUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            CL Government ID (Aadhar/PAN/Driving License) *
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              {field.value ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-green-900/20 border border-green-500/30 rounded-md">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm text-green-300">
                                      File uploaded successfully
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => field.onChange("")}
                                    className="text-red-400 hover:text-red-300 text-xs sm:text-sm"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="w-full">
                                  <UploadButton
                                    endpoint="clGovtId"
                                    onClientUploadComplete={(res) => {
                                      if (res?.[0]?.url) {
                                        field.onChange(res[0].url);
                                      }
                                    }}
                                    onUploadError={(error: Error) => {
                                      alert(`Upload error: ${error.message}`);
                                    }}
                                    className="ut-button:bg-red-600 ut-button:hover:bg-red-700 ut-button:w-full ut-button:text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Assistant Contingent Leader Section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                    Assistant Contingent Leader Details
                  </h3>

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="aclContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            Assistant CL Contact Number *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10-digit mobile number"
                              type="tel"
                              maxLength={10}
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aclEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            Assistant CL Email *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="email@example.com"
                              type="email"
                              className="text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aclFeeReceiptUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            Assistant CL Fee Receipt / College ID *
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              {field.value ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-green-900/20 border border-green-500/30 rounded-md">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm text-green-300">
                                      File uploaded successfully
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => field.onChange("")}
                                    className="text-red-400 hover:text-red-300 text-xs sm:text-sm"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="w-full">
                                  <UploadButton
                                    endpoint="clFeeReceipt"
                                    onClientUploadComplete={(res) => {
                                      if (res?.[0]?.url) {
                                        field.onChange(res[0].url);
                                      }
                                    }}
                                    onUploadError={(error: Error) => {
                                      alert(`Upload error: ${error.message}`);
                                    }}
                                    className="ut-button:bg-red-600 ut-button:hover:bg-red-700 ut-button:w-full ut-button:text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aclGovtIdUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">
                            Assistant CL Government ID *
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              {field.value ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 bg-green-900/20 border border-green-500/30 rounded-md">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm text-green-300">
                                      File uploaded successfully
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => field.onChange("")}
                                    className="text-red-400 hover:text-red-300 text-xs sm:text-sm"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <div className="w-full">
                                  <UploadButton
                                    endpoint="clGovtId"
                                    onClientUploadComplete={(res) => {
                                      if (res?.[0]?.url) {
                                        field.onChange(res[0].url);
                                      }
                                    }}
                                    onUploadError={(error: Error) => {
                                      alert(`Upload error: ${error.message}`);
                                    }}
                                    className="ut-button:bg-red-600 ut-button:hover:bg-red-700 ut-button:w-full ut-button:text-sm"
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* CL Meet Attendance */}
                <FormField
                  control={form.control}
                  name="attendingClMeet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base font-medium">
                        Will you be attending the CL Meet on 12th November? *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="attend-yes" />
                            <label
                              htmlFor="attend-yes"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Yes
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="attend-no" />
                            <label
                              htmlFor="attend-no"
                              className="text-sm font-normal cursor-pointer"
                            >
                              No
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto px-6 sm:px-8 py-2 rounded-md font-medium text-sm sm:text-base"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                        Submitting Registration...
                      </span>
                    ) : (
                      "Submit Registration"
                    )}
                  </Button>
                </div>

                <div className="text-center text-xs text-gray-500 mt-4">
                  <p className="flex flex-wrap items-center justify-center gap-2">
                    <Link
                      href="/contact-us"
                      className="text-red-600 hover:underline"
                    >
                      Contact Us
                    </Link>{" "}
                    <span>|</span>
                    <Link
                      href="/terms-and-conditions"
                      className="text-red-600 hover:underline"
                    >
                      Terms and Conditions
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CLRegistration;