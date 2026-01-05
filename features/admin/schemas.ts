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

/**
 * Managed Image Validation Schemas
 */

export const imageContextEnum = z.enum(["HERO", "HOME", "GLOBAL"]);
export const textPositionEnum = z.enum(["LEFT", "CENTER", "RIGHT"]);

export const managedImageSchema = z.object({
  key: z
    .string()
    .min(1, "Key is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Key must be lowercase with hyphens (e.g., home-hero)"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  altText: z.string().optional(),
  imageUrl: z.string().url("Image URL is required"),
  context: imageContextEnum.default("HOME"),
  position: textPositionEnum.default("CENTER"),
  isActive: z.boolean().optional().default(true),
  order: z.coerce.number().int().optional().default(0),
});

export type ManagedImageFormData = z.input<typeof managedImageSchema>;
export type ImageContext = z.infer<typeof imageContextEnum>;
export type TextPosition = z.infer<typeof textPositionEnum>;

/**
 * Page Content Validation Schemas
 */

export const pageIdEnum = z.enum(["home", "about", "programs", "gallery", "contact", "legal"]);

export const pageContentSchema = z.object({
  pageId: pageIdEnum,
  sectionKey: z
    .string()
    .min(1, "Section key is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Section key must be lowercase with hyphens"),
  title: z.string().max(200).optional().or(z.literal("")),
  subtitle: z.string().max(300).optional().or(z.literal("")),
  body: z.string().min(1, "Body content is required"),
  ctaText: z.string().max(100).optional().or(z.literal("")),
  ctaLink: z.string().max(500).optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  imageAlt: z.string().max(200).optional().or(z.literal("")),
  order: z.coerce.number().int().optional().default(0),
  isActive: z.boolean().optional().default(true),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type PageContentFormData = z.input<typeof pageContentSchema>;
export type PageId = z.infer<typeof pageIdEnum>;

/**
 * Site Settings Validation Schemas
 */

export const siteSettingSchema = z.object({
  key: z
    .string()
    .min(1, "Key is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Key must be lowercase with hyphens"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional().or(z.literal("")),
});

export type SiteSettingFormData = z.input<typeof siteSettingSchema>;

/**
 * Predefined Site Setting Keys
 */
export const SITE_SETTING_KEYS = {
  // Footer
  FOOTER_TAGLINE: "footer-tagline",
  FOOTER_COPYRIGHT: "footer-copyright",
  // Site Info
  SITE_NAME: "site-name",
  SITE_DESCRIPTION: "site-description",
  // Contact
  CONTACT_EMAIL: "contact-email",
  CONTACT_PHONE: "contact-phone",
  CONTACT_ADDRESS: "contact-address",
  // Social
  SOCIAL_FACEBOOK: "social-facebook",
  SOCIAL_INSTAGRAM: "social-instagram",
  SOCIAL_TWITTER: "social-twitter",
  // SEO
  DEFAULT_OG_IMAGE: "default-og-image",
  TWITTER_HANDLE: "twitter-handle",
  // Analytics
  PLAUSIBLE_DOMAIN: "plausible-domain",
} as const;

/**
 * Blog Category Validation Schemas
 */

export const blogCategorySchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional().or(z.literal("")),
  isActive: z.boolean().optional().default(true),
  order: z.coerce.number().int().optional().default(0),
});

export type BlogCategoryFormData = z.input<typeof blogCategorySchema>;

/**
 * Blog Tag Validation Schemas
 */

export const blogTagSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  name: z.string().min(1, "Name is required").max(100),
});

export type BlogTagFormData = z.input<typeof blogTagSchema>;

/**
 * Blog Post Validation Schemas
 */

export const blogPostSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  featuredImage: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  publishedAt: z.coerce.date().optional(),
  categoryId: z.string().uuid().optional().or(z.literal("")),
  tagIds: z.array(z.string().uuid()).optional().default([]),
});

export type BlogPostFormData = z.input<typeof blogPostSchema>;

/**
 * Blog Post Translation Validation Schemas
 */

export const blogPostTranslationSchema = z.object({
  locale: z.string().min(2).max(10).default("en"),
  title: z.string().min(1, "Title is required").max(300),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  content: z.string().min(1, "Content is required"),
  seoTitle: z.string().max(70).optional().or(z.literal("")),
  seoDescription: z.string().max(160).optional().or(z.literal("")),
});

export type BlogPostTranslationFormData = z.input<typeof blogPostTranslationSchema>;

/**
 * Combined Blog Post with Translation Schema (for create/edit forms)
 */

export const blogPostWithTranslationSchema = blogPostSchema.merge(
  z.object({
    translation: blogPostTranslationSchema,
  })
);

export type BlogPostWithTranslationFormData = z.input<typeof blogPostWithTranslationSchema>;

/**
 * Event Validation Schemas
 */

export const eventSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  location: z.string().max(500).optional().or(z.literal("")),
  locationUrl: z.string().url().optional().or(z.literal("")),
  bannerImage: z.string().url().optional().or(z.literal("")),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  allowRegistration: z.boolean().optional().default(true),
  registrationClosed: z.boolean().optional().default(false),
  maxAttendees: z.coerce.number().int().positive().optional(),
});

export type EventFormData = z.input<typeof eventSchema>;

/**
 * Event Translation Validation Schemas
 */

export const eventTranslationSchema = z.object({
  locale: z.string().min(2).max(10).default("en"),
  title: z.string().min(1, "Title is required").max(300),
  description: z.string().min(1, "Description is required"),
  seoTitle: z.string().max(70).optional().or(z.literal("")),
  seoDescription: z.string().max(160).optional().or(z.literal("")),
});

export type EventTranslationFormData = z.input<typeof eventTranslationSchema>;

/**
 * Combined Event with Translation Schema (for create/edit forms)
 */

export const eventWithTranslationSchema = eventSchema.merge(
  z.object({
    translation: eventTranslationSchema,
  })
);

export type EventWithTranslationFormData = z.input<typeof eventWithTranslationSchema>;

/**
 * Event Registration Validation Schemas
 */

export const eventRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(200),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(50).optional().or(z.literal("")),
  notes: z.string().max(1000).optional().or(z.literal("")),
});

export type EventRegistrationFormData = z.input<typeof eventRegistrationSchema>;

/**
 * Registration Status Enum
 */

export const registrationStatusEnum = z.enum(["PENDING", "CONFIRMED", "CANCELLED"]);
export type RegistrationStatus = z.infer<typeof registrationStatusEnum>;

/**
 * Supported Locales
 */

export const SUPPORTED_LOCALES = ["en"] as const;
export const DEFAULT_LOCALE = "en";

// ============================================
// DYNAMIC FORM BUILDER SCHEMAS
// ============================================

/**
 * Field Type Enum - matches Prisma FieldType
 */
export const fieldTypeEnum = z.enum([
  "TEXT",
  "EMAIL", 
  "PHONE",
  "TEXTAREA",
  "SELECT",
  "CHECKBOX",
  "FILE",
]);
export type FieldType = z.infer<typeof fieldTypeEnum>;

/**
 * Field Type Labels for UI
 */
export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  TEXT: "Short Text",
  EMAIL: "Email Address",
  PHONE: "Phone Number",
  TEXTAREA: "Long Text",
  SELECT: "Dropdown",
  CHECKBOX: "Checkbox",
  FILE: "File Upload",
};

/**
 * Conditional Logic Operators
 */
export const conditionalOperatorEnum = z.enum([
  "equals",
  "not_equals",
  "contains",
  "is_checked",
]);
export type ConditionalOperator = z.infer<typeof conditionalOperatorEnum>;

/**
 * Conditional Logic Schema
 */
export const conditionalLogicSchema = z.object({
  dependsOnFieldId: z.string().uuid(),
  operator: conditionalOperatorEnum,
  value: z.string().optional(), // Not needed for is_checked
}).nullable().optional();

export type ConditionalLogic = z.infer<typeof conditionalLogicSchema>;

/**
 * Registration Field Schema - for creating/editing fields
 */
export const registrationFieldSchema = z.object({
  label: z.string().min(1, "Label is required").max(200),
  placeholder: z.string().max(200).optional().or(z.literal("")),
  fieldType: fieldTypeEnum,
  options: z.array(z.string()).optional().default([]),
  isRequired: z.boolean().optional().default(false),
  order: z.coerce.number().int().optional().default(0),
  step: z.coerce.number().int().min(1).optional().default(1),
  conditionalLogic: conditionalLogicSchema,
  maxFileSize: z.coerce.number().int().optional(), // For FILE type
  acceptedTypes: z.string().optional(), // For FILE type: "image/*,application/pdf"
});

export type RegistrationFieldFormData = z.input<typeof registrationFieldSchema>;

/**
 * Registration Form Schema - for form-level settings
 */
export const registrationFormSchema = z.object({
  isActive: z.boolean().default(true),
  totalSteps: z.coerce.number().int().min(1).default(1),
});

export type RegistrationFormFormData = z.input<typeof registrationFormSchema>;

/**
 * Dynamic Form Submission Schema Generator
 * Creates a Zod schema based on field definitions
 */
export function generateDynamicFormSchema(
  fields: Array<{
    id: string;
    label: string;
    fieldType: FieldType;
    isRequired: boolean;
    options?: string[] | null;
  }>
) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema: z.ZodTypeAny;

    switch (field.fieldType) {
      case "EMAIL":
        fieldSchema = z.string().email("Please enter a valid email");
        break;
      case "PHONE":
        fieldSchema = z.string().regex(
          /^[\d\s\-+()]*$/,
          "Please enter a valid phone number"
        );
        break;
      case "TEXTAREA":
        fieldSchema = z.string().max(2000);
        break;
      case "SELECT":
        if (field.options && field.options.length > 0) {
          fieldSchema = z.enum(field.options as [string, ...string[]]);
        } else {
          fieldSchema = z.string();
        }
        break;
      case "CHECKBOX":
        fieldSchema = z.boolean();
        break;
      case "FILE":
        // File is handled separately - store file metadata as JSON string
        fieldSchema = z.string().max(500); // Will store file name or URL
        break;
      case "TEXT":
      default:
        fieldSchema = z.string().max(500);
        break;
    }

    // Handle required vs optional
    if (field.isRequired) {
      if (field.fieldType === "CHECKBOX") {
        fieldSchema = (fieldSchema as z.ZodBoolean).refine(
          (val) => val === true,
          { message: `${field.label} is required` }
        );
      } else {
        fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label} is required`);
      }
    } else {
      if (field.fieldType !== "CHECKBOX") {
        fieldSchema = fieldSchema.optional().or(z.literal(""));
      }
    }

    shape[field.id] = fieldSchema;
  }

  return z.object(shape);
}

/**
 * Form Submission Response Type
 */
export type FormSubmissionResponse = Record<string, string | boolean>;
