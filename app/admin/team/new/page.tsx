import type { Metadata } from "next";
import { PageHeader } from "@/features/admin/components";
import { TeamMemberForm } from "../_components/team-member-form";

export const metadata: Metadata = {
  title: "New Team Member",
  description: "Add a new team member.",
};

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Team Member"
        description="Add a new team member to the foundation."
      />
      <TeamMemberForm />
    </div>
  );
}
