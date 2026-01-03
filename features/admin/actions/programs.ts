"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { programSchema, type ProgramFormData } from "../schemas";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: unknown;
};

/**
 * Create a new program
 */
export async function createProgram(data: ProgramFormData): Promise<ActionResult> {
  try {
    const validated = programSchema.parse(data);

    const program = await db.program.create({
      data: {
        ...validated,
        imageUrl: validated.imageUrl || null,
        content: validated.content || null,
        publishedAt: validated.isActive ? new Date() : null,
      },
    });

    revalidatePath("/programs");
    revalidatePath("/(admin)/programs");

    return { success: true, data: program };
  } catch (error) {
    console.error("Create program error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create program" };
  }
}

/**
 * Update an existing program
 */
export async function updateProgram(
  id: string,
  data: ProgramFormData
): Promise<ActionResult> {
  try {
    const validated = programSchema.parse(data);

    const program = await db.program.update({
      where: { id },
      data: {
        ...validated,
        imageUrl: validated.imageUrl || null,
        content: validated.content || null,
      },
    });

    revalidatePath("/programs");
    revalidatePath("/(admin)/programs");
    revalidatePath(`/(admin)/programs/${id}`);

    return { success: true, data: program };
  } catch (error) {
    console.error("Update program error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update program" };
  }
}

/**
 * Delete a program
 */
export async function deleteProgram(id: string): Promise<ActionResult> {
  try {
    await db.program.delete({ where: { id } });

    revalidatePath("/programs");
    revalidatePath("/(admin)/programs");

    return { success: true };
  } catch (error) {
    console.error("Delete program error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete program" };
  }
}

/**
 * Toggle program publish status
 */
export async function toggleProgramPublish(id: string): Promise<ActionResult> {
  try {
    const program = await db.program.findUnique({ where: { id } });
    if (!program) {
      return { success: false, error: "Program not found" };
    }

    const updated = await db.program.update({
      where: { id },
      data: {
        isActive: !program.isActive,
        publishedAt: !program.isActive ? new Date() : program.publishedAt,
      },
    });

    revalidatePath("/programs");
    revalidatePath("/(admin)/programs");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Toggle program publish error:", error);
    return { success: false, error: "Failed to toggle publish status" };
  }
}
