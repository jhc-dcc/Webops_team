"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface CloudinaryFileUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export function CloudinaryFileUpload({
  value,
  onChange,
}: CloudinaryFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error || "The file could not be uploaded.");
      }

      onChange(result.url);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert(error instanceof Error ? error.message : "The file could not be uploaded.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  if (value) {
    return (
      <div className="flex flex-col gap-2 rounded-md border border-green-500/30 bg-green-900/20 p-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-green-300 sm:text-sm">
          File uploaded successfully!
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          className="text-xs text-red-400 hover:text-red-300 sm:text-sm"
        >
          Remove
        </Button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="w-full bg-red-600 text-sm hover:bg-red-700"
      >
        {isUploading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        {isUploading ? "Uploading" : "Upload PDF/Image"}
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        PDF, JPG, PNG, or WEBP up to 4 MB
      </p>
    </>
  );
}
