"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ImageUploaderProps = {
  value?: string | null;
  onUpload: (url: string) => void;
  onClear?: () => void;
  label?: string;
  description?: string;
  buttonLabel?: string;
  className?: string;
  previewAlt?: string;
};

const DEFAULT_UPLOAD_PRESET = "your_unsigned_upload_preset_here";

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read image preview locally."));
    };
    reader.onerror = () => reject(new Error("Unable to read image file."));
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({
  value,
  onUpload,
  onClear,
  label = "Thumbnail image",
  description = "Upload an image for the project thumbnail.",
  buttonLabel = "Browse",
  className,
  previewAlt = "Uploaded image preview",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(value ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? DEFAULT_UPLOAD_PRESET;

  useEffect(() => {
    setPreviewSrc(value ?? null);
  }, [value]);

  useEffect(() => {
    return () => {
      if (previewSrc?.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

  const logSuccess = (message: string, url: string) => {
    console.info(message, { url });
    setStatusMessage(message);
    setErrorMessage(null);
  };

  const logError = (message: string, error?: unknown) => {
    console.error(message, error);
    setErrorMessage(message);
    setStatusMessage(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const uploadToCloudinary = async (file: File) => {
    if (!cloudName || !uploadPreset || uploadPreset === DEFAULT_UPLOAD_PRESET) {
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.error?.message ?? "Unable to upload the selected image.",
      );
    }

    if (typeof result?.secure_url !== "string") {
      throw new Error("Upload succeeded but no image URL was returned.");
    }

    return result.secure_url as string;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage(null);
    setStatusMessage("Preparing image preview...");

    const localPreview = URL.createObjectURL(file);
    setPreviewSrc((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return localPreview;
    });

    setIsUploading(true);

    try {
      const uploadedUrl = await uploadToCloudinary(file);

      if (uploadedUrl) {
        onUpload(uploadedUrl);
        logSuccess("Image uploaded successfully.", uploadedUrl);
      } else {
        const localDataUrl = await readFileAsDataUrl(file);
        onUpload(localDataUrl);
        logSuccess("Image preview is ready.", localDataUrl);
        setStatusMessage("Preview ready.");
      }
    } catch (error) {
      logError(
        error instanceof Error ? error.message : "Image upload failed.",
        error,
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleClear = () => {
    if (previewSrc?.startsWith("blob:")) {
      URL.revokeObjectURL(previewSrc);
    }

    setPreviewSrc(null);
    setStatusMessage(null);
    setErrorMessage(null);
    onClear?.();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleButtonClick}
          disabled={isUploading}
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary/30 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <UploadCloud className="size-4" />
          )}
          {isUploading ? "Uploading..." : buttonLabel}
        </button>

        {previewSrc ? (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary/30 hover:text-foreground"
          >
            <X className="size-3.5" />
            Remove
          </button>
        ) : null}
      </div>

      {previewSrc ? (
        <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-card p-2">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border/60 bg-secondary/20">
            <Image
              src={previewSrc}
              alt={previewAlt}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1 text-xs font-medium text-foreground">
              <ImageIcon className="size-3.5 text-muted-foreground" />
              {isUploading ? "Preview loading" : "Preview ready"}
            </div>

            {statusMessage ? (
              <p className="text-xs font-medium text-emerald-600">{statusMessage}</p>
            ) : null}
            {errorMessage ? (
              <p className="text-xs font-medium text-destructive">{errorMessage}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No image selected yet.</p>
      )}
    </div>
  );
}
