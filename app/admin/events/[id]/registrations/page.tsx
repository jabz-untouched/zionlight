import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEventById } from "@/features/admin/actions/events";
import { getRegistrationStats } from "@/features/admin/actions/registrations";
import { getEventSubmissions } from "@/features/admin/actions/form-builder";
import {
  PageHeader,
  DataTable,
  StatusBadge,
  Card,
} from "@/features/admin/components";
import {
  RegistrationActions,
  ExportButton,
} from "../../_components/registration-actions";
import { DynamicSubmissionsTable } from "./_components/dynamic-submissions-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Event Registrations",
  description: "View and manage event registrations.",
};

interface RegistrationsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RegistrationsPage({ params }: RegistrationsPageProps) {
  const { id } = await params;
  const [event, stats, dynamicResult] = await Promise.all([
    getEventById(id),
    getRegistrationStats(id),
    getEventSubmissions(id),
  ]);

  if (!event) {
    notFound();
  }

  const hasDynamicForm = dynamicResult.success && dynamicResult.data?.form?.isActive;
  const dynamicSubmissions = dynamicResult.data?.submissions || [];
  const dynamicFormFields = dynamicResult.data?.form?.fields || [];
  
  // Calculate total count (legacy + dynamic)
  const totalRegistrations = stats.total + dynamicSubmissions.length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <PageHeader
          title="Registrations"
          description={`Managing registrations for: ${event.translation?.title || event.slug}`}
        />
        <div className="flex gap-2">
          <Link href={`/admin/events/${id}/form`}>
            <span className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
              Form Builder
            </span>
          </Link>
          <Link href={`/admin/events/${id}/edit`}>
            <span className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
              Edit Event
            </span>
          </Link>
          <ExportButton eventId={id} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{totalRegistrations}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Dynamic Form</p>
          <p className="text-2xl font-bold text-blue-600">{dynamicSubmissions.length}</p>
        </Card>
      </div>

      {/* Capacity indicator */}
      {event.maxAttendees && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Capacity: {totalRegistrations} / {event.maxAttendees}
            </span>
            <div className="h-2 w-48 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{
                  width: `${Math.min(100, (totalRegistrations / event.maxAttendees) * 100)}%`,
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Dynamic Form Submissions */}
      {hasDynamicForm && dynamicSubmissions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Dynamic Form Submissions</h2>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
              {dynamicSubmissions.length} submissions
            </span>
          </div>
          <DynamicSubmissionsTable 
            submissions={dynamicSubmissions}
            fields={dynamicFormFields}
            eventId={id}
          />
        </div>
      )}

      {/* Legacy Registrations table */}
      {event.registrations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Legacy Registrations</h2>
          <DataTable
        data={event.registrations.map((reg) => ({
          id: reg.id,
          fullName: reg.fullName,
          email: reg.email,
          phone: reg.phone || "—",
          notes: reg.notes || "—",
          status: reg.status,
          createdAt: reg.createdAt,
        }))}
        emptyMessage="No registrations yet."
        columns={[
          {
            key: "fullName",
            label: "Name",
            render: (reg) => (
              <div>
                <p className="font-medium">{reg.fullName}</p>
                <p className="text-xs text-muted-foreground">{reg.email}</p>
              </div>
            ),
          },
          {
            key: "phone",
            label: "Phone",
          },
          {
            key: "notes",
            label: "Notes",
            render: (reg) => (
              <p className="max-w-xs truncate text-sm">{reg.notes}</p>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (reg) => {
              const statusColors = {
                PENDING: { active: false, label: "Pending" },
                CONFIRMED: { active: true, label: "Confirmed" },
                CANCELLED: { active: false, label: "Cancelled" },
              };
              const { active, label } = statusColors[reg.status as keyof typeof statusColors];
              return <StatusBadge active={active} activeLabel={label} inactiveLabel={label} />;
            },
          },
          {
            key: "createdAt",
            label: "Registered",
            render: (reg) => (
              <span className="text-sm">
                {new Date(reg.createdAt).toLocaleDateString()}
              </span>
            ),
          },
          {
            key: "actions",
            label: "Actions",
            render: (reg) => (
              <RegistrationActions
                registration={{
                  id: reg.id,
                  fullName: reg.fullName,
                  email: reg.email,
                  phone: reg.phone === "—" ? null : reg.phone,
                  notes: reg.notes === "—" ? null : reg.notes,
                  status: reg.status as "PENDING" | "CONFIRMED" | "CANCELLED",
                  createdAt: reg.createdAt,
                  eventId: id,
                  updatedAt: new Date(),
                }}
              />
            ),
          },
        ]}
      />
        </div>
      )}
    </div>
  );
}
