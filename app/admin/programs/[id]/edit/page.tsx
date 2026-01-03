import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/features/admin/components";
import { ProgramForm } from "../../_components/program-form";

export const dynamic = "force-dynamic";

interface EditProgramPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Program",
  description: "Edit program details.",
};

async function getProgram(id: string) {
  return db.program.findUnique({ where: { id } });
}

export default async function EditProgramPage({ params }: EditProgramPageProps) {
  const { id } = await params;
  const program = await getProgram(id);

  if (!program) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Program"
        description={`Editing: ${program.title}`}
      />
      <ProgramForm program={program} />
    </div>
  );
}
