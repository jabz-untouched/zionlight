import type { Metadata } from "next";
import { PageHeader } from "@/features/admin/components";
import { ProgramForm } from "../_components/program-form";

export const metadata: Metadata = {
  title: "New Program",
  description: "Create a new program.",
};

export default function NewProgramPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Program"
        description="Create a new foundation program."
      />
      <ProgramForm />
    </div>
  );
}
