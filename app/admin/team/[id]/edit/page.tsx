import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/features/admin/components";
import { TeamMemberForm } from "../../_components/team-member-form";

export const dynamic = "force-dynamic";

interface EditTeamMemberPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Team Member",
  description: "Edit team member details.",
};

async function getTeamMember(id: string) {
  return db.teamMember.findUnique({ where: { id } });
}

export default async function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const { id } = await params;
  const member = await getTeamMember(id);

  if (!member) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Team Member"
        description={`Editing: ${member.name}`}
      />
      <TeamMemberForm member={member} />
    </div>
  );
}
