"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/features/admin/components";
import {
  updateRegistrationStatus,
  deleteRegistration,
  exportEventRegistrationsCSV,
} from "@/features/admin/actions/registrations";
import type { EventRegistration } from "@prisma/client";

interface RegistrationActionsProps {
  registration: EventRegistration;
}

export function RegistrationActions({ registration }: RegistrationActionsProps) {
  const router = useRouter();

  const handleStatusChange = async (status: "PENDING" | "CONFIRMED" | "CANCELLED") => {
    const result = await updateRegistrationStatus(registration.id, status);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this registration?")) {
      return;
    }

    const result = await deleteRegistration(registration.id);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to delete registration");
    }
  };

  return (
    <div className="flex items-center gap-1">
      {registration.status !== "CONFIRMED" && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleStatusChange("CONFIRMED")}
        >
          Confirm
        </Button>
      )}
      {registration.status !== "CANCELLED" && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleStatusChange("CANCELLED")}
        >
          Cancel
        </Button>
      )}
      <Button size="sm" variant="danger" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
}

interface ExportButtonProps {
  eventId: string;
}

export function ExportButton({ eventId }: ExportButtonProps) {
  const handleExport = async () => {
    const result = await exportEventRegistrationsCSV(eventId);
    if (result.success && result.data) {
      const { filename, content, mimeType } = result.data as {
        filename: string;
        content: string;
        mimeType: string;
      };

      // Create and download the file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      alert(result.error || "Failed to export registrations");
    }
  };

  return (
    <Button variant="secondary" onClick={handleExport}>
      Export CSV
    </Button>
  );
}
