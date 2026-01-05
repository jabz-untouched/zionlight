"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "@uploadthing/react";
import { useUploadThing } from "@/lib/uploadthing-client";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Button, Input } from "./ui";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
  endpoint?: "imageUploader" | "galleryUploader" | "blogImageUploader";
}

/**
 * Image upload component with drag-and-drop and URL fallback
 */
export function ImageUpload({ 
  value, 
  onChange, 
  placeholder,
  endpoint = "imageUploader" 
}: ImageUploadProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [previewError, setPreviewError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mode, setMode] = useState<"upload" | "url">("upload");

  const { startUpload, routeConfig } = useUploadThing(endpoint, {
    onClientUploadComplete: (res: { ufsUrl: string }[] | undefined) => {
      if (res?.[0]) {
        const url = res[0].ufsUrl;
        setInputValue(url);
        onChange(url);
        setPreviewError(false);
      }
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadError: (error: Error) => {
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: (progress: number) => {
      setUploadProgress(progress);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setIsUploading(true);
        startUpload(acceptedFiles);
      }
    },
    [startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: routeConfig ? generateClientDropzoneAccept(["image"]) : undefined,
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setInputValue(url);
    setPreviewError(false);
    onChange(url);
  };

  const clearImage = () => {
    setInputValue("");
    onChange("");
    setPreviewError(false);
  };

  return (
    <div className="space-y-3">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            mode === "upload"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            mode === "url"
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Enter URL
        </button>
      </div>

      {mode === "upload" ? (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
            ${isUploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          <input {...getInputProps()} />
          
          {isUploading ? (
            <div className="space-y-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Uploading... {uploadProgress}%
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-center">
                <svg
                  className="w-10 h-10 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">
                {isDragActive ? "Drop image here..." : "Drag & drop an image, or click to select"}
              </p>
              <p className="text-xs text-muted-foreground">
                Max file size: 4MB
              </p>
            </div>
          )}
        </div>
      ) : (
        <Input
          type="url"
          value={inputValue}
          onChange={handleUrlChange}
          placeholder={placeholder || "https://example.com/image.jpg"}
        />
      )}

      {/* Preview */}
      {inputValue && !previewError && (
        <div className="relative">
          <div className="relative h-40 w-full max-w-xs overflow-hidden rounded-lg border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={inputValue}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={() => setPreviewError(true)}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={clearImage}
            className="absolute top-2 right-2"
          >
            Remove
          </Button>
        </div>
      )}
      
      {previewError && (
        <p className="text-xs text-destructive">Failed to load image preview</p>
      )}
    </div>
  );
}

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value, onChange, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const tag = inputValue.trim().toLowerCase();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Add tag..."}
        />
        <Button type="button" variant="secondary" onClick={addTag}>
          Add
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
