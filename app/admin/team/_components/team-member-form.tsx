"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  teamMemberSchema,
  type TeamMemberFormData,
} from "@/features/admin/schemas";
import {
  Card,
  FormField,
  Input,
  Textarea,
  Checkbox,
  Button,
} from "@/features/admin/components";
import { ImageUpload } from "@/features/admin/components/image-upload";
import { createTeamMember, updateTeamMember } from "@/features/admin/actions/team";
import type { TeamMember } from "@prisma/client";

interface TeamMemberFormProps {
  member?: TeamMember;
}

export function TeamMemberForm({ member }: TeamMemberFormProps) {
  const router = useRouter();
  const isEditing = !!member;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: member?.name || "",
      role: member?.role || "",
      bio: member?.bio || "",
      imageUrl: member?.imageUrl || "",
      email: member?.email || "",
      phone: member?.phone || "",
      linkedIn: member?.linkedIn || "",
      twitter: member?.twitter || "",
      isActive: member?.isActive ?? true,
      isFeatured: member?.isFeatured ?? false,
      order: member?.order ?? 0,
    },
  });

  const imageUrl = watch("imageUrl");

  const onSubmit = async (data: TeamMemberFormData) => {
    const result = isEditing
      ? await updateTeamMember(member.id, data)
      : await createTeamMember(data);

    if (result.success) {
      router.push("/admin/team");
      router.refresh();
    } else {
      alert(result.error || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <h3 className="mb-4 font-medium">Basic Information</h3>
        <div className="space-y-4">
          <FormField label="Name" error={errors.name?.message} required>
            <Input
              {...register("name")}
              error={!!errors.name}
              placeholder="John Doe"
            />
          </FormField>

          <FormField label="Role / Position" error={errors.role?.message} required>
            <Input
              {...register("role")}
              error={!!errors.role}
              placeholder="Executive Director"
            />
          </FormField>

          <FormField label="Bio" error={errors.bio?.message}>
            <Textarea
              {...register("bio")}
              error={!!errors.bio}
              placeholder="Brief biography..."
            />
          </FormField>

          <FormField label="Photo URL" error={errors.imageUrl?.message}>
            <ImageUpload
              value={imageUrl}
              onChange={(url) => setValue("imageUrl", url)}
              placeholder="https://example.com/photo.jpg"
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-medium">Contact Information</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              {...register("email")}
              error={!!errors.email}
              placeholder="john@zionlight.org"
            />
          </FormField>

          <FormField label="Phone" error={errors.phone?.message}>
            <Input
              {...register("phone")}
              error={!!errors.phone}
              placeholder="+1 234 567 8900"
            />
          </FormField>

          <FormField label="LinkedIn" error={errors.linkedIn?.message}>
            <Input
              type="url"
              {...register("linkedIn")}
              error={!!errors.linkedIn}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </FormField>

          <FormField label="Twitter" error={errors.twitter?.message}>
            <Input
              type="url"
              {...register("twitter")}
              error={!!errors.twitter}
              placeholder="https://twitter.com/johndoe"
            />
          </FormField>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-medium">Display Options</h3>
        <div className="space-y-4">
          <FormField label="Display Order" error={errors.order?.message}>
            <Input
              type="number"
              {...register("order")}
              error={!!errors.order}
              className="w-24"
            />
          </FormField>

          <div className="flex gap-6">
            <Checkbox label="Active" {...register("isActive")} />
            <Checkbox label="Featured on Homepage" {...register("isFeatured")} />
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          {isEditing ? "Update Member" : "Add Member"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/team")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
