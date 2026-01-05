"use client";

import { useState } from "react";
import type { JsonValue } from "@prisma/client/runtime/library";
import { Card, Button } from "@/features/admin/components";
import { exportSubmissionsCSV } from "@/features/admin/actions/form-builder";

interface FieldDefinition {
  id: string;
  label: string;
  fieldType: string;
}

interface Submission {
  id: string;
  createdAt: Date;
  responses: JsonValue;
  email: string | null;
}

interface DynamicSubmissionsTableProps {
  submissions: Submission[];
  fields: FieldDefinition[];
  eventId: string;
}

export function DynamicSubmissionsTable({
  submissions,
  fields,
  eventId,
}: DynamicSubmissionsTableProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportSubmissionsCSV(eventId);
      if (result.success && result.data) {
        // Create and download CSV file
        const blob = new Blob([result.data], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `submissions-${eventId}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(result.error || "Failed to export");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export submissions");
    } finally {
      setIsExporting(false);
    }
  };

  const formatValue = (value: string | boolean | undefined, fieldType: string) => {
    if (value === undefined || value === null || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (fieldType === "CHECKBOX") return value === "true" ? "Yes" : "No";
    return String(value);
  };

  return (
    <Card className="overflow-hidden">
      {/* Export button */}
      <div className="flex justify-end border-b border-border p-4">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Submitted
              </th>
              {fields.map((field) => (
                <th
                  key={field.id}
                  className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                >
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => {
              const responses = submission.responses as Record<string, string | boolean>;
              return (
                <tr
                  key={submission.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 text-sm">
                    {new Date(submission.createdAt).toLocaleDateString()}{" "}
                    <span className="text-muted-foreground">
                      {new Date(submission.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  {fields.map((field) => (
                    <td key={field.id} className="px-4 py-3 text-sm">
                      {formatValue(responses[field.id], field.fieldType)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {submissions.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          No submissions yet
        </div>
      )}
    </Card>
  );
}
