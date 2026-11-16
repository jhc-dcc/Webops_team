import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 4 * 1024 * 1024;
const ALLOWED_FILE_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: Request) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary upload is not configured");
    return NextResponse.json(
      { error: "File upload is not configured." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A file is required." }, { status: 400 });
  }

  if (!ALLOWED_FILE_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only PDF, JPG, PNG, and WEBP files are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Files must be 4 MB or smaller." },
      { status: 400 }
    );
  }

  const cloudinaryFormData = new FormData();
  cloudinaryFormData.append("file", file);
  cloudinaryFormData.append("upload_preset", uploadPreset);
  cloudinaryFormData.append("folder", "dotcomclub/cyberstrike-26/cl");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: cloudinaryFormData,
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Cloudinary upload failed:", errorBody);
    return NextResponse.json(
      { error: "Cloudinary could not upload the file." },
      { status: 502 }
    );
  }

  const result = (await response.json()) as { secure_url?: string };

  if (!result.secure_url) {
    console.error("Cloudinary response did not include a secure URL");
    return NextResponse.json(
      { error: "Cloudinary returned an invalid upload response." },
      { status: 502 }
    );
  }

  return NextResponse.json({ url: result.secure_url });
}
