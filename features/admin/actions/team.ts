"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { teamMemberSchema, type TeamMemberFormData } from "../schemas";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

/**
 * Create a new team member
 */
export async function createTeamMember(data: TeamMemberFormData): Promise<ActionResult> {
  try {
    const validated = teamMemberSchema.parse(data);

    const teamMember = await db.teamMember.create({
      data: {
        ...validated,
        imageUrl: validated.imageUrl || null,
        bio: validated.bio || null,
        email: validated.email || null,
        phone: validated.phone || null,
        linkedIn: validated.linkedIn || null,
        twitter: validated.twitter || null,
      },
    });

    revalidatePath("/(admin)/team");

    return { success: true, data: teamMember };
  } catch (error) {
    console.error("Create team member error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create team member" };
  }
}

/**
 * Update an existing team member
 */
export async function updateTeamMember(
  id: string,
  data: TeamMemberFormData
): Promise<ActionResult> {
  try {
    const validated = teamMemberSchema.parse(data);

    const teamMember = await db.teamMember.update({
      where: { id },
      data: {
        ...validated,
        imageUrl: validated.imageUrl || null,
        bio: validated.bio || null,
        email: validated.email || null,
        phone: validated.phone || null,
        linkedIn: validated.linkedIn || null,
        twitter: validated.twitter || null,
      },
    });

    revalidatePath("/(admin)/team");
    revalidatePath(`/(admin)/team/${id}`);

    return { success: true, data: teamMember };
  } catch (error) {
    console.error("Update team member error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update team member" };
  }
}

/**
 * Delete a team member
 */
export async function deleteTeamMember(id: string): Promise<ActionResult> {
  try {
    await db.teamMember.delete({ where: { id } });

    revalidatePath("/(admin)/team");

    return { success: true };
  } catch (error) {
    console.error("Delete team member error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete team member" };
  }
}

/**
 * Toggle team member active status
 */
export async function toggleTeamMemberActive(id: string): Promise<ActionResult> {
  try {
    const member = await db.teamMember.findUnique({ where: { id } });
    if (!member) {
      return { success: false, error: "Team member not found" };
    }

    const updated = await db.teamMember.update({
      where: { id },
      data: { isActive: !member.isActive },
    });

    revalidatePath("/(admin)/team");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Toggle team member active error:", error);
    return { success: false, error: "Failed to toggle active status" };
  }
}
