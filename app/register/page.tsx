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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  uid: z.string().min(1, {
    message: "uid is required.",
  }),
  contactNo: z.string().min(10, {
    message: "Contact number must be at least 10 digits.",
  }),
  department: z.enum(
    [
      "BSC IT",
      "BVOC SD",
      "BVOC TT",
      "BCOM",
      "BBA",
      "BSC",
      "BIOTECH",
      "BMS",
      "BMM",
      "BFM",
      "BAF",
      "BBI",
      "BA",
      "BDS",
      "Other",
    ],
    {
      required_error: "Please select a department.",
    }
  ),
  departmentOther: z.string().optional(),
  year: z.enum(["FY", "SY", "TY"], {
    required_error: "Please select your year.",
  }),
  team: z.enum(
    [
      "Hackathon",
      "Contingent",
      "Events",
      "ESports",
      "Marketing",
      "PR (Public Relations)",
      "WebOps",
      "Media and Graphics",
      "Photography",
      "Decor",
      "Editorial",
      "Security and Logistics",
    ],
    {
      required_error: "Please select the team you would like to join.",
    }
  ),
  tshirtSize: z.enum(["XS - 34", "S - 36", "M - 38", "L - 40", "XL - 42", "XXL - 44", "Other"], {
    required_error: "Please select your T-shirt size.",
  }),
  tshirtSizeOther: z.string().optional(),
  hearAboutDCC: z.enum(
    ["Social Media", "On Campus", "Via Email", "Friends", "Other"],
    {
      required_error: "Please tell us how you heard about DCC.",
    }
  ),
  hearAboutDCCOther: z.string().optional(),
});

const RegisterOC = () => {
  const router = useRouter(); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      uid: "",
      contactNo: "",
      departmentOther: "",
      tshirtSizeOther: "",
      hearAboutDCCOther: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Process form values
    const processedValues = {
      ...values,
      department: values.department === "Other" ? values.departmentOther : values.department,
      tshirtSize: values.tshirtSize === "Other" ? values.tshirtSizeOther : values.tshirtSize,
      hearAboutDCC: values.hearAboutDCC === "Other" ? values.hearAboutDCCOther : values.hearAboutDCC,
    };
    
    // Save data to localStorage for the payment page to access
    localStorage.setItem("registrationData", JSON.stringify(processedValues));
    
    // In a real implementation, you would send this to your backend
    console.log(processedValues);
    
    // Redirect to payment confirmation page
    setTimeout(() => {
      router.push("/payment-confirmation");
    }, 500); // Short delay for better UX
  }

  return (
    <div className="min-h-screen py-8 px-4 pt-32">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">
              DCC - MEMBERSHIP 2025-26
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Join the Dot Com Club and be part of an amazing community!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>* Indicates required question</AlertDescription>
            </Alert>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Email *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Full Name Field */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your answer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* UID Field */}
                <FormField
                  control={form.control}
                  name="uid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        UID (Write NA if FY) *
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Your answer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Number Field */}
                <FormField
                  control={form.control}
                  name="contactNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Contact No. *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your answer"
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Department Field */}
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Department *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-3 gap-4"
                        >
                          {[
                            "BSC IT",
                            "BVOC SD",
                            "BVOC TT",
                            "BCOM",
                            "BBA",
                            "BSC",
                            "BIOTECH",
                            "BMS",
                            "BMM",
                            "BFM",
                            "BAF",
                            "BBI",
                            "BA",
                            "BDS",
                            "Other",
                          ].map((dept) => (
                            <div
                              key={dept}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem value={dept} id={dept} />
                              <label
                                htmlFor={dept}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {dept}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Show input field if "Other" is selected for Department */}
                {form.watch("department") === "Other" && (
                  <FormField
                    control={form.control}
                    name="departmentOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Please specify your department *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Your department" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Separator />

                {/* Year Field */}
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Year *
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
                              <RadioGroupItem value={year} id={year} />
                              <label
                                htmlFor={year}
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

                <Separator />

                {/* Team Selection */}
                <FormField
                  control={form.control}
                  name="team"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Select the team you would like to join *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          {[
                            "Hackathon",
                            "Contingent",
                            "Events",
                            "ESports",
                            "Marketing",
                            "PR (Public Relations)",
                            "WebOps",
                            "Media and Graphics",
                            "Photography",
                            "Decor",
                            "Editorial",
                            "Security and Logistics",
                          ].map((team) => (
                            <div
                              key={team}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem value={team} id={team} />
                              <label
                                htmlFor={team}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {team}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* T-Shirt Size */}
                <FormField
                  control={form.control}
                  name="tshirtSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        T Shirt Size *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          {["XS - 34", "S - 36", "M - 38", "L - 40", "XL - 42", "XXL - 44", "Other"].map((size) => (
                            <div
                              key={size}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem value={size} id={size} />
                              <label
                                htmlFor={size}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {size}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Show input field if "Other" is selected for T-shirt size */}
                {form.watch("tshirtSize") === "Other" && (
                  <FormField
                    control={form.control}
                    name="tshirtSizeOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Please specify your T-shirt size *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Your T-shirt size" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Separator />

                {/* How did you hear about DCC */}
                <FormField
                  control={form.control}
                  name="hearAboutDCC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        How did you hear about DCC? *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          {[
                            "Social Media",
                            "On Campus",
                            "Via Email",
                            "Friends",
                            "Other",
                          ].map((option) => (
                            <div
                              key={option}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem value={option} id={option} />
                              <label
                                htmlFor={option}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Show input field if "Other" is selected for how they heard about DCC */}
                {form.watch("hearAboutDCC") === "Other" && (
                  <FormField
                    control={form.control}
                    name="hearAboutDCCOther"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          Please specify how you heard about DCC *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Your answer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Separator />

                <div className="bg-amber-100 border border-amber-300 rounded-md p-4 text-amber-800 space-y-2">
                  <p>
                    The membership fee for DCC 2025-26 is <span className="font-bold text-l">₹300</span>.
                  </p>
                  <p>
                    After submitting this form, you&apos;ll be directed to our payment page to complete your registration.
                  </p>
                </div>

                <Separator />

                {/* Submit Button with loading state */}
                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-md font-medium coursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Continue to Payment"
                    )}
                  </Button>
                </div>

                <div className="text-center text-xs text-gray-500 mt-4">
                  <p>
                    <Link
                      href="/contact-us"
                      className="text-red-600 hover:underline"
                    >
                      Contact Us
                    </Link>{" "}
                    |
                    <Link
                      href="/terms-and-conditions"
                      className="text-red-600 hover:underline ml-1"
                    >
                      Terms and Conditions
                    </Link>{" "}
                    |
                    <Link
                      href="/refund-policy"
                      className="text-red-600 hover:underline ml-1"
                    >
                      Refund Policy
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

export default RegisterOC;
