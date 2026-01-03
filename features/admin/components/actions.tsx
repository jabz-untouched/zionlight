"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui";

interface DeleteButtonProps {
  id: string;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  itemName?: string;
}

export function DeleteButton({ id, onDelete, itemName = "item" }: DeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      const result = await onDelete(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to delete");
      }
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Delete {itemName}?</span>
        <Button
          size="sm"
          variant="danger"
          onClick={handleDelete}
          loading={isPending}
        >
          Yes
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" variant="ghost" onClick={() => setShowConfirm(true)}>
      Delete
    </Button>
  );
}

interface ToggleButtonProps {
  id: string;
  isActive: boolean;
  onToggle: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function ToggleButton({ id, isActive, onToggle }: ToggleButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await onToggle(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || "Failed to toggle status");
      }
    });
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? "..." : isActive ? "Unpublish" : "Publish"}
    </Button>
  );
}
