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
import { deleteProgram, toggleProgramPublish } from "@/features/admin/actions/programs";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Programs",
  description: "Manage foundation programs.",
};

async function getPrograms() {
  return db.program.findMany({
    orderBy: { order: "asc" },
  });
}

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programs"
        description="Manage foundation programs and initiatives."
        action={{ label: "Add Program", href: "/admin/programs/new" }}
      />

      <DataTable
        data={programs}
        emptyMessage="No programs yet. Create your first program."
        columns={[
          {
            key: "title",
            label: "Title",
            render: (program) => (
              <div>
                <p className="font-medium">{program.title}</p>
                <p className="text-xs text-muted-foreground">/{program.slug}</p>
              </div>
            ),
          },
          {
            key: "isActive",
            label: "Status",
            render: (program) => (
              <StatusBadge
                active={program.isActive}
                activeLabel="Published"
                inactiveLabel="Draft"
              />
            ),
          },
          {
            key: "isFeatured",
            label: "Featured",
            render: (program) => (program.isFeatured ? "Yes" : "No"),
          },
          {
            key: "order",
            label: "Order",
          },
          {
            key: "actions",
            label: "Actions",
            render: (program) => (
              <div className="flex items-center gap-2">
                <Link href={`/admin/programs/${program.id}/edit`}>
                  <Button size="sm" variant="ghost">
                    Edit
                  </Button>
                </Link>
                <ToggleButton
                  id={program.id}
                  isActive={program.isActive}
                  onToggle={toggleProgramPublish}
                />
                <DeleteButton
                  id={program.id}
                  onDelete={deleteProgram}
                  itemName="program"
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
