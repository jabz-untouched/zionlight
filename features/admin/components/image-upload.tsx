"use client";

import { useState } from "react";
import { Button, Input } from "./ui";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

/**
 * Simple image upload component
 * For Phase 1, uses URL input. Can be extended to use UploadThing later.
 */
export function ImageUpload({ value, onChange, placeholder }: ImageUploadProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const [previewError, setPreviewError] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setInputValue(url);
    setPreviewError(false);
    onChange(url);
  };

  return (
    <div className="space-y-3">
      <Input
        type="url"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || "https://example.com/image.jpg"}
      />
      {inputValue && !previewError && (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={inputValue}
            alt="Preview"
            className="h-full w-full object-cover"
            onError={() => setPreviewError(true)}
          />
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
