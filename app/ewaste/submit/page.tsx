"use client";

import { EwasteSubmissionForm } from "@/components/ewaste-submission-form";

export default function EwasteSubmitPage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <EwasteSubmissionForm />
      </div>
    </div>
  );
}
