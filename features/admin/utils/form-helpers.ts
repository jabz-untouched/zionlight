/**
 * Form Builder Utility Functions
 * These are client-safe helpers for conditional logic and file validation
 */

import type { FormSubmissionResponse } from "../schemas";

// ============================================
// FILE VALIDATION
// ============================================

const MAX_FILE_SIZE = 10 * 1024; // 10KB hard limit
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];

export interface ConditionalLogic {
  dependsOnFieldId: string;
  operator: "equals" | "not_equals" | "contains" | "is_checked";
  value?: string;
}

/**
 * Validate a file before upload
 */
export function validateFile(
  file: { size: number; type: string; name: string },
  maxFileSize?: number | null,
  acceptedTypes?: string | null
): { valid: boolean; error?: string } {
  // Check hard limit
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File exceeds maximum size of ${MAX_FILE_SIZE / 1024}KB` };
  }

  // Check field-specific limit if set
  if (maxFileSize && file.size > maxFileSize) {
    return { valid: false, error: `File exceeds maximum size of ${maxFileSize / 1024}KB` };
  }

  // Parse accepted types
  const typesToCheck = acceptedTypes 
    ? acceptedTypes.split(",").map(t => t.trim())
    : ALLOWED_MIME_TYPES;

  // Check mime type
  const isTypeAllowed = typesToCheck.some(pattern => {
    if (pattern.endsWith("/*")) {
      // Wildcard like "image/*"
      return file.type.startsWith(pattern.replace("/*", "/"));
    }
    return file.type === pattern;
  });

  if (!isTypeAllowed) {
    return { valid: false, error: `File type ${file.type} is not allowed` };
  }

  return { valid: true };
}

// ============================================
// CONDITIONAL LOGIC HELPERS
// ============================================

/**
 * Evaluate if a field should be visible based on conditional logic
 */
export function evaluateConditionalLogic(
  conditionalLogic: ConditionalLogic | null | undefined,
  formData: FormSubmissionResponse,
  fields: Array<{ id: string; fieldType: string }>
): boolean {
  // If no conditional logic, field is always visible
  if (!conditionalLogic) return true;

  const { dependsOnFieldId, operator, value } = conditionalLogic;
  const dependentValue = formData[dependsOnFieldId];
  const dependentField = fields.find(f => f.id === dependsOnFieldId);

  if (!dependentField) return true;

  switch (operator) {
    case "equals":
      return String(dependentValue) === value;
    case "not_equals":
      return String(dependentValue) !== value;
    case "contains":
      return String(dependentValue || "").toLowerCase().includes((value || "").toLowerCase());
    case "is_checked":
      return dependentValue === true;
    default:
      return true;
  }
}

/**
 * Filter fields that should be visible based on conditional logic and current form data
 */
export function getVisibleFields<T extends { id: string; fieldType: string; conditionalLogic?: unknown }>(
  fields: T[],
  formData: FormSubmissionResponse
): T[] {
  return fields.filter(field => {
    const logic = field.conditionalLogic as ConditionalLogic | null;
    return evaluateConditionalLogic(logic, formData, fields);
  });
}
