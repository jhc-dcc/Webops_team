"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface PaymentScreenshotUploaderProps {
  userEmail?: string;
  userName?: string;
  onUploadComplete?: (result: { fileUrl: string; fileName: string }) => void;
  onUploadError?: (error: string) => void;
}

export function PaymentScreenshotUploader({
  onUploadComplete,
  onUploadError,
}: PaymentScreenshotUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { startUpload, isUploading } = useUploadThing("paymentScreenshot", {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onClientUploadComplete: (res: any) => {
      console.log("Upload completed:", res);
      if (res && res[0]) {
        onUploadComplete?.({
          fileUrl: res[0].url,
          fileName: res[0].name,
        });
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUploadError: (error: any) => {
      console.error("Upload error:", error);
      onUploadError?.(error.message);
    },
    onUploadBegin: (name: string) => {
      console.log("Upload begin:", name);
    },
  });

  const handleFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      onUploadError?.("Please select an image file (PNG, JPG, JPEG, WebP)");
      return;
    }

    // Validate file size (8MB max)
    if (file.size > 8 * 1024 * 1024) {
      onUploadError?.("File size must be less than 8MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await startUpload([selectedFile]);
    } catch (error) {
      console.error("Upload failed:", error);
      onUploadError?.("Upload failed. Please try again.");
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400",
          selectedFile && "border-green-500 bg-green-50"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
      >
        {!selectedFile ? (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <Upload className="w-full h-full" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                Upload Payment Screenshot
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop your payment success screenshot here, or click to browse
              </p>
            </div>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
              <p className="text-xs text-gray-400">
                PNG, JPG, JPEG, WebP up to 8MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">File Selected</span>
            </div>
            <p className="text-sm text-gray-600">{selectedFile.name}</p>
            <p className="text-xs text-gray-400">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
      </div>

      {/* Preview */}
      {previewUrl && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Preview</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative max-w-md mx-auto">
              <Image
                src={previewUrl}
                alt="Payment screenshot preview"
                className="w-full h-auto rounded-lg border border-gray-200"
                style={{ maxHeight: "300px", objectFit: "contain" }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      {selectedFile && (
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full"
          size="lg"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Submit Payment Screenshot
            </>
          )}
        </Button>
      )}

      {/* Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-900">
                Screenshot Guidelines:
              </p>
              <ul className="text-blue-800 space-y-1 text-xs">
                <li>• Ensure the screenshot shows the successful payment confirmation</li>
                <li>• Include the transaction ID and amount (₹300) clearly visible</li>
                <li>• Make sure the image is clear and not blurry</li>
                <li>• The screenshot should show the complete payment success page</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
