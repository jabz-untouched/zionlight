"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  registrationFieldSchema,
  FIELD_TYPE_LABELS,
  type RegistrationFieldFormData,
  type FieldType,
  type ConditionalOperator,
} from "@/features/admin/schemas";
import {
  addFormField,
  updateFormField,
  deleteFormField,
  reorderFormField,
  toggleFormActive,
  updateFormSettings,
} from "@/features/admin/actions/form-builder";
import { Button, Card, Input, Label, Textarea, FormError } from "@/features/admin/components";

const CONDITIONAL_OPERATOR_LABELS: Record<ConditionalOperator, string> = {
  equals: "Equals",
  not_equals: "Does not equal",
  contains: "Contains",
  is_checked: "Is checked",
};

interface FormField {
  id: string;
  label: string;
  placeholder: string | null;
  fieldType: string;
  options: string[] | null;
  isRequired: boolean;
  order: number;
  step: number;
  conditionalLogic: {
    dependsOnFieldId: string;
    operator: string;
    value?: string;
  } | null;
  maxFileSize: number | null;
  acceptedTypes: string | null;
}

interface FormBuilderProps {
  formId: string;
  isActive: boolean;
  totalSteps: number;
  fields: FormField[];
}

export function FormBuilder({ formId, isActive, totalSteps, fields }: FormBuilderProps) {
  const [isPending, startTransition] = useTransition();
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formActive, setFormActive] = useState(isActive);
  const [formTotalSteps, setFormTotalSteps] = useState(totalSteps);

  const handleToggleActive = () => {
    startTransition(async () => {
      const result = await toggleFormActive(formId, !formActive);
      if (result.success) {
        setFormActive(!formActive);
      }
    });
  };

  const handleUpdateTotalSteps = (newTotalSteps: number) => {
    startTransition(async () => {
      const result = await updateFormSettings(formId, {
        isActive: formActive,
        totalSteps: newTotalSteps,
      });
      if (result.success) {
        setFormTotalSteps(newTotalSteps);
      }
    });
  };

  const handleMoveField = (fieldId: string, direction: "up" | "down") => {
    startTransition(async () => {
      await reorderFormField(fieldId, direction);
    });
  };

  const handleDeleteField = (fieldId: string) => {
    if (!confirm("Are you sure you want to delete this field?")) return;
    startTransition(async () => {
      await deleteFormField(fieldId);
    });
  };

  return (
    <div className="space-y-6">
      {/* Form Status Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Registration Form Status</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {formActive 
                ? "Form is active and accepting registrations" 
                : "Form is inactive and hidden from public"}
            </p>
          </div>
          <Button
            onClick={handleToggleActive}
            disabled={isPending}
            variant={formActive ? "danger" : "primary"}
          >
            {formActive ? "Disable Form" : "Enable Form"}
          </Button>
        </div>
      </Card>

      {/* Multi-Step Settings */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Multi-Step Form Settings</h3>
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalSteps">Number of Steps</Label>
            <div className="flex items-center gap-2">
              <select
                id="totalSteps"
                value={formTotalSteps}
                onChange={(e) => handleUpdateTotalSteps(parseInt(e.target.value))}
                className="w-24 px-3 py-2 border rounded-md bg-background"
                disabled={isPending}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "step" : "steps"}
                  </option>
                ))}
              </select>
              <span className="text-sm text-muted-foreground">
                {formTotalSteps === 1 
                  ? "Single page form" 
                  : `Form will be split into ${formTotalSteps} pages`}
              </span>
            </div>
          </div>
        </div>
        {formTotalSteps > 1 && (
          <p className="text-sm text-muted-foreground mt-3">
            Assign each field to a step using the &quot;Step&quot; dropdown when editing fields.
          </p>
        )}
      </Card>

      {/* Field List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Form Fields</h3>
          <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
            + Add Field
          </Button>
        </div>

        {/* Add New Field Form */}
        {showAddForm && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/30">
            <FieldForm
              allFields={fields}
              totalSteps={formTotalSteps}
              onSubmit={async (data) => {
                const result = await addFormField(formId, data);
                if (result.success) {
                  setShowAddForm(false);
                }
                return result;
              }}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Existing Fields */}
        <div className="space-y-3">
          {fields.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No fields yet. Add your first field to get started.
            </p>
          ) : (
            fields.map((field, index) => (
              <div key={field.id}>
                {editingFieldId === field.id ? (
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <FieldForm
                      initialData={field}
                      allFields={fields.filter(f => f.id !== field.id)}
                      totalSteps={formTotalSteps}
                      onSubmit={async (data) => {
                        const result = await updateFormField(field.id, data);
                        if (result.success) {
                          setEditingFieldId(null);
                        }
                        return result;
                      }}
                      onCancel={() => setEditingFieldId(null)}
                    />
                  </div>
                ) : (
                  <FieldCard
                    field={field}
                    index={index}
                    totalFields={fields.length}
                    isPending={isPending}
                    onEdit={() => setEditingFieldId(field.id)}
                    onDelete={() => handleDeleteField(field.id)}
                    onMoveUp={() => handleMoveField(field.id, "up")}
                    onMoveDown={() => handleMoveField(field.id, "down")}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Preview Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Form Preview</h3>
        <div className="p-4 border rounded-lg bg-background">
          {fields.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Add fields to see a preview
            </p>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <FieldPreview key={field.id} field={field} />
              ))}
              <Button disabled className="w-full">
                Submit Registration
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// ============================================
// Field Card Component
// ============================================

interface FieldCardProps {
  field: FormField;
  index: number;
  totalFields: number;
  isPending: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function FieldCard({
  field,
  index,
  totalFields,
  isPending,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: FieldCardProps) {
  return (
    <div className="flex items-center gap-3 p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors">
      {/* Reorder Buttons */}
      <div className="flex flex-col gap-1">
        <button
          onClick={onMoveUp}
          disabled={isPending || index === 0}
          className="p-1 hover:bg-muted rounded disabled:opacity-30"
          title="Move up"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={onMoveDown}
          disabled={isPending || index === totalFields - 1}
          className="p-1 hover:bg-muted rounded disabled:opacity-30"
          title="Move down"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Field Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate">{field.label}</span>
          {field.isRequired && (
            <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">
              Required
            </span>
          )}
          {field.step > 1 && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
              Step {field.step}
            </span>
          )}
          {field.conditionalLogic && (
            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
              Conditional
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground flex-wrap">
          <span className="px-2 py-0.5 bg-muted rounded text-xs">
            {FIELD_TYPE_LABELS[field.fieldType as FieldType] || field.fieldType}
          </span>
          {field.fieldType === "FILE" && field.maxFileSize && (
            <span className="text-xs">Max: {field.maxFileSize / 1024}KB</span>
          )}
          {field.placeholder && (
            <span className="truncate">Placeholder: {field.placeholder}</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={onEdit}>
          Edit
        </Button>
        <Button size="sm" variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Field Form Component
// ============================================

interface FieldFormProps {
  initialData?: FormField;
  allFields: FormField[];
  totalSteps: number;
  onSubmit: (data: RegistrationFieldFormData) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

function FieldForm({ initialData, allFields, totalSteps, onSubmit, onCancel }: FieldFormProps) {
  const [isPending, startTransition] = useTransition();
  const [optionsText, setOptionsText] = useState(
    initialData?.options?.join("\n") || ""
  );
  const [hasConditionalLogic, setHasConditionalLogic] = useState(
    !!initialData?.conditionalLogic
  );
  const [conditionalFieldId, setConditionalFieldId] = useState(
    initialData?.conditionalLogic?.dependsOnFieldId || ""
  );
  const [conditionalOperator, setConditionalOperator] = useState<ConditionalOperator>(
    (initialData?.conditionalLogic?.operator as ConditionalOperator) || "equals"
  );
  const [conditionalValue, setConditionalValue] = useState(
    initialData?.conditionalLogic?.value || ""
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFieldFormData>({
    resolver: zodResolver(registrationFieldSchema),
    defaultValues: {
      label: initialData?.label || "",
      placeholder: initialData?.placeholder || "",
      fieldType: (initialData?.fieldType as FieldType) || "TEXT",
      isRequired: initialData?.isRequired || false,
      options: initialData?.options || [],
      step: initialData?.step || 1,
      maxFileSize: initialData?.maxFileSize || undefined,
      acceptedTypes: initialData?.acceptedTypes || "",
    },
  });

  const fieldType = watch("fieldType");
  const showOptions = fieldType === "SELECT";
  const showFileOptions = fieldType === "FILE";

  const handleFormSubmit = handleSubmit((data) => {
    startTransition(async () => {
      // Parse options from textarea
      if (showOptions) {
        data.options = optionsText
          .split("\n")
          .map((o) => o.trim())
          .filter((o) => o.length > 0);
      } else {
        data.options = [];
      }

      // Set conditional logic
      if (hasConditionalLogic && conditionalFieldId) {
        data.conditionalLogic = {
          dependsOnFieldId: conditionalFieldId,
          operator: conditionalOperator,
          value: conditionalOperator === "is_checked" ? undefined : conditionalValue,
        };
      } else {
        data.conditionalLogic = null;
      }

      await onSubmit(data);
    });
  });

  // Get available fields for conditional logic (exclude current field)
  const availableFieldsForCondition = allFields.filter(
    f => f.fieldType !== "FILE" // Can't depend on file fields
  );

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <h4 className="font-medium text-sm text-muted-foreground mb-2">
        {initialData ? "Edit Field" : "Add New Field"}
      </h4>

      <div className="grid grid-cols-2 gap-4">
        {/* Field Type */}
        <div className="space-y-2">
          <Label htmlFor="fieldType">Field Type</Label>
          <select
            {...register("fieldType")}
            className="w-full px-3 py-2 border rounded-md bg-background"
          >
            {Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Step Selection */}
        {totalSteps > 1 && (
          <div className="space-y-2">
            <Label htmlFor="step">Form Step</Label>
            <select
              {...register("step")}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <option key={step} value={step}>
                  Step {step}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Required Toggle */}
        <div className="space-y-2">
          <Label>Required</Label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isRequired")}
              className="w-4 h-4 rounded border"
            />
            <span className="text-sm">This field is required</span>
          </label>
        </div>
      </div>

      {/* Label */}
      <div className="space-y-2">
        <Label htmlFor="label">Label (Question Text)</Label>
        <Input
          {...register("label")}
          placeholder="e.g., What is your dietary preference?"
        />
        {errors.label && <FormError message={errors.label.message} />}
      </div>

      {/* Placeholder */}
      <div className="space-y-2">
        <Label htmlFor="placeholder">Placeholder Text (Optional)</Label>
        <Input
          {...register("placeholder")}
          placeholder="e.g., Select an option..."
        />
      </div>

      {/* Options for SELECT */}
      {showOptions && (
        <div className="space-y-2">
          <Label htmlFor="options">Options (one per line)</Label>
          <Textarea
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            placeholder="Option 1&#10;Option 2&#10;Option 3"
            rows={4}
          />
          <p className="text-xs text-muted-foreground">
            Enter each option on a new line
          </p>
        </div>
      )}

      {/* File Upload Options */}
      {showFileOptions && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <h5 className="font-medium text-sm">File Upload Settings</h5>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (bytes)</Label>
              <Input
                type="number"
                {...register("maxFileSize")}
                placeholder="10240"
                max={10240}
              />
              <p className="text-xs text-muted-foreground">
                Maximum: 10,240 bytes (10KB)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="acceptedTypes">Accepted File Types</Label>
              <Input
                {...register("acceptedTypes")}
                placeholder="image/*,application/pdf"
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated MIME types
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Conditional Logic */}
      {availableFieldsForCondition.length > 0 && (
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <div className="flex items-center justify-between">
            <h5 className="font-medium text-sm">Conditional Logic</h5>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConditionalLogic}
                onChange={(e) => setHasConditionalLogic(e.target.checked)}
                className="w-4 h-4 rounded border"
              />
              <span className="text-sm">Show only when condition is met</span>
            </label>
          </div>

          {hasConditionalLogic && (
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Depends on Field</Label>
                <select
                  value={conditionalFieldId}
                  onChange={(e) => setConditionalFieldId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">Select a field...</option>
                  {availableFieldsForCondition.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Operator</Label>
                <select
                  value={conditionalOperator}
                  onChange={(e) => setConditionalOperator(e.target.value as ConditionalOperator)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  {Object.entries(CONDITIONAL_OPERATOR_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              {conditionalOperator !== "is_checked" && (
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    value={conditionalValue}
                    onChange={(e) => setConditionalValue(e.target.value)}
                    placeholder="Enter value..."
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : initialData ? "Update Field" : "Add Field"}
        </Button>
      </div>
    </form>
  );
}

// ============================================
// Field Preview Component
// ============================================

function FieldPreview({ field }: { field: FormField }) {
  const fieldType = field.fieldType as FieldType;

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {fieldType === "TEXTAREA" ? (
        <Textarea
          placeholder={field.placeholder || ""}
          disabled
          className="bg-muted/50"
        />
      ) : fieldType === "SELECT" ? (
        <select className="w-full px-3 py-2 border rounded-md bg-muted/50" disabled>
          <option value="">{field.placeholder || "Select an option..."}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : fieldType === "CHECKBOX" ? (
        <label className="flex items-center gap-2 cursor-not-allowed opacity-70">
          <input type="checkbox" disabled className="w-4 h-4 rounded border" />
          <span className="text-sm">{field.placeholder || "I agree"}</span>
        </label>
      ) : fieldType === "FILE" ? (
        <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50 cursor-not-allowed opacity-70">
          <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm text-muted-foreground">
            {field.placeholder || "Click to upload a file"} 
            {field.maxFileSize && ` (Max: ${field.maxFileSize / 1024}KB)`}
          </span>
        </div>
      ) : (
        <Input
          type={fieldType === "EMAIL" ? "email" : fieldType === "PHONE" ? "tel" : "text"}
          placeholder={field.placeholder || ""}
          disabled
          className="bg-muted/50"
        />
      )}
    </div>
  );
}
