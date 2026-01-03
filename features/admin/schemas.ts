import { z } from "zod";

/**
 * Program Validation Schemas
 */

export const programSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  description: z.string().min(1, "Description is required"),
  content: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
});

export type ProgramFormData = z.input<typeof programSchema>;

/**
 * Team Member Validation Schemas
 */

export const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().min(1, "Role is required").max(100),
  bio: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  linkedIn: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
});

export type TeamMemberFormData = z.input<typeof teamMemberSchema>;

/**
 * Gallery Item Validation Schemas
 */

export const galleryItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  imageUrl: z.string().url("Image URL is required"),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().optional(),
  tags: z.array(z.string()).optional().default([]),
  isActive: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
  takenAt: z.coerce.date().optional(),
});

export type GalleryItemFormData = z.input<typeof galleryItemSchema>;
