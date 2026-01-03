import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  Button,
} from "@/features/admin/components";
import { DeleteButton, ToggleButton } from "@/features/admin/components/actions";
import { deleteTeamMember, toggleTeamMemberActive } from "@/features/admin/actions/team";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team Members",
  description: "Manage foundation team members.",
};

async function getTeamMembers() {
  return db.teamMember.findMany({
    orderBy: { order: "asc" },
  });
}

export default async function TeamPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Members"
        description="Manage team and leadership."
        action={{ label: "Add Member", href: "/admin/team/new" }}
      />

      <DataTable
        data={teamMembers}
        emptyMessage="No team members yet. Add your first team member."
        columns={[
          {
            key: "name",
            label: "Name",
            render: (member) => (
              <div className="flex items-center gap-3">
                {member.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ),
          },
          {
            key: "email",
            label: "Email",
            render: (member) => member.email || "—",
          },
          {
            key: "isActive",
            label: "Status",
            render: (member) => <StatusBadge active={member.isActive} />,
          },
          {
            key: "isFeatured",
            label: "Featured",
            render: (member) => (member.isFeatured ? "Yes" : "No"),
          },
          {
            key: "actions",
            label: "Actions",
            render: (member) => (
              <div className="flex items-center gap-2">
                <Link href={`/admin/team/${member.id}/edit`}>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </Link>
                <ToggleButton
                  id={member.id}
                  isActive={member.isActive}
                  onToggle={toggleTeamMemberActive}
                />
                <DeleteButton
                  id={member.id}
                  onDelete={deleteTeamMember}
                  itemName="team member"
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
