"use client";

import { cn } from "@/lib/utils";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { useState } from "react";

interface PaymentUploadProps {
  onUploadComplete: (url: string) => void;
  uploadedUrl?: string;
  className?: string;
}

export function PaymentUpload({
  onUploadComplete,
  uploadedUrl,
  className
}: PaymentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className={cn("space-y-4 ", className)}>
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium text-gray-300">
          Payment Screenshot <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400">
          Upload a screenshot of your payment confirmation (Max 4MB)
        </p>
      </div>

      {uploadedUrl ? (
        <div className="space-y-3">
          <div className="relative w-full max-w-md mx-auto">
            <Image
              src={uploadedUrl}
              alt="Payment screenshot"
              width={400}
              height={300}
              className="rounded-lg border border-red-500/30 object-cover"
            />
          </div>
          <div className="flex justify-center">
            <UploadButton
              endpoint="paymentScreenshot"
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                if (res?.[0]?.url) {
                  onUploadComplete(res[0].url);
                }
                setIsUploading(false);
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
                setIsUploading(false);
              }}
              onUploadBegin={() => {
                setIsUploading(true);
              }}
              className="ut-button:bg-red-600 ut-button:hover:bg-red-700 ut-button:text-white ut-allowed-content:text-gray-300 ut-label:text-gray-300"
              content={{
                button: isUploading ? "Uploading..." : "Change Screenshot",
                allowedContent: "Images up to 4MB",
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center  border border-primary/50 rounded-lg p-4 w-full hover:bg-accent-foreground/10">
          <UploadButton
            endpoint="paymentScreenshot"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              if (res?.[0]?.url) {
                onUploadComplete(res[0].url);
              }
              setIsUploading(false);
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
              setIsUploading(false);
            }}
            onUploadBegin={() => {
              setIsUploading(true);
            }}
            className="ut-button:bg-red-600 ut-button:hover:bg-red-700 ut-button:text-white ut-allowed-content:text-gray-300 ut-label:text-gray-300 px-10 py-4 rounded-lg w-full hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            content={{
              button: isUploading ? "Uploading..." : "Upload Payment Screenshot",
              allowedContent: "Images up to 1MB",
            }}
          />
        </div>
      )}

      {isUploading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
        </div>
      )}
    </div>
  );
}
