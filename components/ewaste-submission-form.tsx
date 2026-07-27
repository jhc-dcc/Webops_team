"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Building, CheckCircle, Recycle, Trash2, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ewasteSchema = z.object({
  // Step 1: Basic Info
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),

  // Step 2: Participant Type
  participantType: z.enum(["individual", "organization"]),

  // Step 3: Organization Info (conditional)
  organizationName: z.string().optional(),
  organizationAddress: z.string().optional(),
  representativeName: z.string().optional(),

  // Step 4: E-waste Details
  wasteWeight: z.number().min(0.1, "Weight must be at least 0.1 kg"),
  wasteTypes: z.array(z.string()).min(1, "Please select at least one waste type"),
  additionalNotes: z.string().optional(),
}).refine((data) => {
  // Weight validation based on participant type
  if (data.participantType === "individual" && data.wasteWeight > 100) {
    return false;
  }
  if (data.participantType === "organization" && data.wasteWeight > 500) {
    return false;
  }
  return true;
}, {
  message: "Weight limit exceeded",
  path: ["wasteWeight"],
});

type EwasteFormData = z.infer<typeof ewasteSchema>;

const wasteTypeOptions = [
  { id: "laptops", label: "Laptops & Computers" },
  { id: "phones", label: "Mobile Phones & Tablets" },
  { id: "cables", label: "Cables & Chargers" },
  { id: "batteries", label: "Batteries" },
  { id: "appliances", label: "Small Appliances" },
  { id: "monitors", label: "Monitors & TVs" },
  { id: "printers", label: "Printers & Scanners" },
  { id: "audio", label: "Audio Equipment" },
  { id: "gaming", label: "Gaming Consoles" },
  { id: "other", label: "Other Electronic Items" },
];

export function EwasteSubmissionForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitEwaste = useMutation(api.ewaste.submitEwaste);

  const form = useForm<EwasteFormData>({
    resolver: zodResolver(ewasteSchema),
    mode: "onSubmit", // Only validate on submit, not on change
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      participantType: "individual",
      organizationName: "",
      organizationAddress: "",
      representativeName: "",
      wasteWeight: 0.1, // Set a small default value instead of 0
      wasteTypes: [],
      additionalNotes: "",
    },
  });

  const { watch, setValue, getValues } = form;
  const participantType = watch("participantType");
  const wasteTypes = watch("wasteTypes");

  const steps = [
    {
      title: "Basic Information",
      description: "",
      icon: User,
    },
    {
      title: "Participant Type",
      description: "",
      icon: Building,
    },
    ...(participantType === "organization" ? [{
      title: "Organization Details",
      description: "",
      icon: Building,
    }] : []),
    {
      title: "E-waste Details",
      description: "",
      icon: Trash2,
    },
    {
      title: "Submitting",
      description: "",
      icon: CheckCircle,
    },
  ];

  const validateStep = (step: number) => {
    const values = getValues();

    switch (step) {
      case 0:
        // Basic Information validation - check if fields are not empty and meet minimum requirements
        return values.name && values.name.trim().length >= 2 &&
          values.email && values.email.includes('@') &&
          values.phone && values.phone.length >= 10;
      case 1:
        return values.participantType;
      case 2:
        if (participantType === "organization") {
          return values.organizationName && values.organizationName.trim() &&
            values.organizationAddress && values.organizationAddress.trim() &&
            values.representativeName && values.representativeName.trim();
        } else {
          // For individuals, step 2 is E-waste Details - check weight limits
          const maxWeight = participantType === "individual" ? 100 : 500;
          return values.wasteWeight > 0 && values.wasteWeight <= maxWeight && values.wasteTypes.length > 0;
        }
      case 3:
        if (participantType === "organization") {
          // For organizations, step 3 is E-waste Details - check weight limits
          const maxWeight = participantType === "organization" ? 500 : 100;
          return values.wasteWeight > 0 && values.wasteWeight <= maxWeight && values.wasteTypes.length > 0;
        } else {
          // For individuals, step 3 is Review step
          return true;
        }
      case 4:
        // For organizations, step 4 is Review step
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      // For individuals: steps 0,1,2,3 (0=basic, 1=type, 2=ewaste, 3=review)
      // For organizations: steps 0,1,2,3,4 (0=basic, 1=type, 2=org, 3=ewaste, 4=review)
      const maxStep = participantType === "organization" ? 4 : 3;
      if (currentStep < maxStep) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNextStep = () => {
    const values = getValues();
    const isValid = validateStep(currentStep);

    console.log('Step validation:', {
      currentStep,
      isValid,
      values: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        participantType: values.participantType
      }
    });

    if (isValid) {
      nextStep();
    } else {
      // More specific error messages based on current step
      if (currentStep === 0) {
        if (!values.name || values.name.trim().length < 2) {
          toast.error("Please enter a valid name (at least 2 characters)");
        } else if (!values.email || !values.email.includes('@')) {
          toast.error("Please enter a valid email address");
        } else if (!values.phone || values.phone.length < 10) {
          toast.error("Please enter a valid phone number (at least 10 digits)");
        } else {
          toast.error("Please fill in all required fields");
        }
      } else if ((currentStep === 2 && participantType === "individual") ||
        (currentStep === 3 && participantType === "organization")) {
        // E-waste details validation with weight limits
        const maxWeight = participantType === "individual" ? 100 : 500;
        if (!values.wasteWeight || values.wasteWeight <= 0) {
          toast.error("Please enter a valid weight");
        } else if (values.wasteWeight > maxWeight) {
          toast.error(`Weight cannot exceed ${maxWeight}kg for ${participantType}s`);
        } else if (!values.wasteTypes || values.wasteTypes.length === 0) {
          toast.error("Please select at least one waste type");
        } else {
          toast.error("Please fill in all required fields");
        }
      } else {
        toast.error("Please fill in all required fields");
      }
    }
  };

  const onSubmit = async (data: EwasteFormData) => {
    // Check if we're on the final review step
    const isFinalStep = (currentStep === 3 && participantType === "individual") ||
      (currentStep === 4 && participantType === "organization");

    if (!isFinalStep) {
      // For non-final steps, handle navigation separately
      handleNextStep();
      return;
    }

    // If on final step, submit the form
    setIsSubmitting(true);
    try {
      await submitEwaste({
        name: data.name,
        email: data.email,
        phone: data.phone,
        participantType: data.participantType,
        organizationName: data.organizationName,
        organizationAddress: data.organizationAddress,
        representativeName: data.representativeName,
        wasteWeight: data.wasteWeight,
        wasteTypes: data.wasteTypes,
        additionalNotes: data.additionalNotes,
      });

      setIsSubmitted(true);
      toast.success("E-waste submission successful! Your entry has been added to the leaderboard.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit e-waste entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-card border-primary/20">
        <CardContent className="text-center py-8 sm:py-12 px-4 sm:px-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Submission Successful!</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
            Your e-waste entry has been added to the leaderboard!
            If you had a previous submission, the weight has been added to your total.
          </p>
          <Button
            onClick={() => window.location.href = "/ewaste"}
            className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
          >
            View Leaderboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card border-primary/20 m-2 sm:m-4">
      <CardHeader className="text-center p-3 sm:p-6">
        <div className="mx-auto w-10 h-10 sm:w-16 sm:h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2 sm:mb-4">
          <Recycle className="w-5 h-5 sm:w-8 sm:h-8 text-primary" />
        </div>
        <CardTitle className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground">E-waste Submission</CardTitle>
        <CardDescription className="text-xs sm:text-base md:text-lg px-1 sm:px-2">
          Help us track the impact of our e-waste collection drive
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 sm:p-6">
        {/* Responsive Stepper */}
        <div className="mb-4 sm:mb-8">
          {/* Mobile: Show compact progress bar */}
          <div className="block lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  {currentStep === 0 && <User className="w-4 h-4 text-white" />}
                  {currentStep === 1 && <Building className="w-4 h-4 text-white" />}
                  {currentStep === 2 && participantType === "organization" && <Building className="w-4 h-4 text-white" />}
                  {currentStep === 2 && participantType === "individual" && <Trash2 className="w-4 h-4 text-white" />}
                  {currentStep === 3 && participantType === "organization" && <Trash2 className="w-4 h-4 text-white" />}
                  {currentStep === 3 && participantType === "individual" && <CheckCircle className="w-4 h-4 text-white" />}
                  {currentStep === 4 && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground">
                    {currentStep === 0 && "Basic Information"}
                    {currentStep === 1 && "Participant Type"}
                    {currentStep === 2 && participantType === "organization" && "Organization Details"}
                    {currentStep === 2 && participantType === "individual" && "E-waste Details"}
                    {currentStep === 3 && participantType === "organization" && "E-waste Details"}
                    {currentStep === 3 && participantType === "individual" && "Submitting"}
                    {currentStep === 4 && "Submitting"}
                  </h4>
                  <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
                </div>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Desktop: Show full horizontal stepper */}
          <div className="hidden lg:block">
            <Stepper value={currentStep + 1} orientation="horizontal">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <StepperItem
                    key={index}
                    step={index + 1}
                    completed={index < currentStep}
                    disabled={index > currentStep}
                  >
                    <StepperTrigger className="data-[state=completed]:bg-primary/20 data-[state=active]:bg-primary/10 p-4">
                      <StepperIndicator className="bg-muted data-[state=active]:bg-primary data-[state=completed]:bg-primary w-10 h-10">
                        <IconComponent className="w-5 h-5" />
                      </StepperIndicator>
                      <div className="text-left ml-3">
                        <StepperTitle className="text-foreground text-base font-medium">{step.title}</StepperTitle>
                        <StepperDescription className="text-sm text-muted-foreground">{step.description}</StepperDescription>
                      </div>
                    </StepperTrigger>
                    {index < steps.length - 1 && <StepperSeparator className="w-16" />}
                  </StepperItem>
                );
              })}
            </Stepper>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 0 && (
            <div className="space-y-3 sm:space-y-6">
              <h3 className="text-base sm:text-xl font-semibold text-foreground mb-2 sm:mb-4">Basic Information</h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    className="bg-background border-input mt-1 h-11"
                    placeholder="Enter your full name"
                  />
                  {form.formState.errors.name && (
                    <p className="text-destructive text-sm mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className="bg-background border-input mt-1 h-11"
                    placeholder="Enter your email"
                  />
                  {form.formState.errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    className="bg-background border-input mt-1 h-11"
                    placeholder="Enter your phone number"
                  />
                  {form.formState.errors.phone && (
                    <p className="text-destructive text-sm mt-1">
                      {form.formState.errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Participant Type */}
          {currentStep === 1 && (
            <div className="space-y-3 sm:space-y-6">
              <h3 className="text-base sm:text-xl font-semibold text-foreground mb-2 sm:mb-4">Participant Type</h3>

              <RadioGroup
                value={participantType}
                onValueChange={(value) => setValue("participantType", value as "individual" | "organization")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 sm:p-4 border border-input rounded-lg hover:bg-accent cursor-pointer transition-colors">
                  <RadioGroupItem value="individual" id="individual" />
                  <Label htmlFor="individual" className="cursor-pointer flex-1">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-sm sm:text-base">Individual</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Personal e-waste submission
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 sm:p-4 border border-input rounded-lg hover:bg-accent cursor-pointer transition-colors">
                  <RadioGroupItem value="organization" id="organization" />
                  <Label htmlFor="organization" className="cursor-pointer flex-1">
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-sm sm:text-base">Organization</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          Company/School/NGO submission
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 3: Organization Details (only if organization) */}
          {currentStep === 2 && participantType === "organization" && (
            <div className="space-y-3 sm:space-y-6">
              <h3 className="text-base sm:text-xl font-semibold text-foreground mb-2 sm:mb-4">Organization Details</h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="organizationName" className="text-sm font-medium">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    {...form.register("organizationName")}
                    className="bg-background border-input mt-1 h-11"
                    placeholder="Enter organization name"
                  />
                </div>

                <div>
                  <Label htmlFor="organizationAddress" className="text-sm font-medium">Organization Address *</Label>
                  <Textarea
                    id="organizationAddress"
                    {...form.register("organizationAddress")}
                    className="bg-background border-input mt-1 min-h-[100px]"
                    placeholder="Enter complete address"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="representativeName" className="text-sm font-medium">Representative Name *</Label>
                  <Input
                    id="representativeName"
                    {...form.register("representativeName")}
                    className="bg-background border-input mt-1 h-11"
                    placeholder="Name of the person representing the organization"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3/4: E-waste Details */}
          {((currentStep === 2 && participantType === "individual") ||
            (currentStep === 3 && participantType === "organization")) && (
              <div className="space-y-3 sm:space-y-6">
                <h3 className="text-base sm:text-xl font-semibold text-foreground mb-2 sm:mb-4">E-waste Details</h3>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <Label htmlFor="wasteWeight" className="text-sm font-medium">
                      Total Weight (kg) *
                      <span className="text-xs text-muted-foreground ml-2">
                        (Max: {participantType === "individual" ? "100kg" : "500kg"})
                      </span>
                    </Label>
                    <Input
                      id="wasteWeight"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max={participantType === "individual" ? "100" : "500"}
                      {...form.register("wasteWeight", { valueAsNumber: true })}
                      className="bg-background border-input mt-1 h-11"
                      placeholder={`Enter weight in kg (Max: ${participantType === "individual" ? "100kg" : "500kg"})`}
                    />
                    {form.formState.errors.wasteWeight && (
                      <p className="text-destructive text-sm mt-1">
                        {form.formState.errors.wasteWeight.message === "Weight limit exceeded"
                          ? `Weight cannot exceed ${participantType === "individual" ? "100kg for individuals" : "500kg for organizations"}`
                          : form.formState.errors.wasteWeight.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Types of E-waste *</Label>
                    <div className="space-y-2 mt-2">
                      {wasteTypeOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3 p-2 border border-input rounded-lg hover:bg-accent/50">
                          <Checkbox
                            id={option.id}
                            checked={wasteTypes.includes(option.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setValue("wasteTypes", [...wasteTypes, option.id]);
                              } else {
                                setValue("wasteTypes", wasteTypes.filter(type => type !== option.id));
                              }
                            }}
                          />
                          <Label htmlFor={option.id} className="text-sm cursor-pointer flex-1">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.wasteTypes && (
                      <p className="text-destructive text-sm mt-2">
                        {form.formState.errors.wasteTypes.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="additionalNotes" className="text-sm font-medium">Additional Notes (Optional)</Label>
                    <Textarea
                      id="additionalNotes"
                      {...form.register("additionalNotes")}
                      className="bg-background border-input mt-1 min-h-[100px]"
                      placeholder="Any additional information about your e-waste..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

          {/* Step 4/5: Review & Submit */}
          {/* {((currentStep === 3 && participantType === "individual") ||
            (currentStep === 4 && participantType === "organization")) && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Review & Submit</h3>

                <div className="bg-muted/50 rounded-lg p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                      <p className="text-foreground mt-1">{watch("name")}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-foreground mt-1">{watch("email")}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-foreground mt-1">{watch("phone")}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <p className="text-foreground mt-1 capitalize">{watch("participantType")}</p>
                    </div>
                  </div>

                  {participantType === "organization" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border pt-6">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Organization</Label>
                        <p className="text-foreground mt-1">{watch("organizationName")}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Representative</Label>
                        <p className="text-foreground mt-1">{watch("representativeName")}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                        <p className="text-foreground mt-1">{watch("organizationAddress")}</p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Weight</Label>
                        <p className="text-foreground mt-1 text-lg font-medium">{watch("wasteWeight")} kg</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Waste Types</Label>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {watch("wasteTypes").map(type => (
                            <span key={type} className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">
                              {wasteTypeOptions.find(opt => opt.id === type)?.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    {watch("additionalNotes") && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-muted-foreground">Additional Notes</Label>
                        <p className="text-foreground mt-1">{watch("additionalNotes")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )} */}

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4 sm:pt-8 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-input hover:bg-accent h-11"
            >
              Previous
            </Button>

            {((currentStep === 3 && participantType === "individual") ||
              (currentStep === 4 && participantType === "organization")) ? (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 h-11"
              >
                {isSubmitting ? "Submitting..." : "Submit E-waste Entry"}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNextStep}
                className="bg-primary hover:bg-primary/90 h-11"
              >
                Next
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
