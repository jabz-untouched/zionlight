"use client";

import { useState, useRef } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  generateDynamicFormSchema, 
  type FieldType, 
  type FormSubmissionResponse,
  type ConditionalOperator,
} from "@/features/admin/schemas";
import { submitDynamicForm } from "@/features/admin/actions/form-builder";
import { 
  evaluateConditionalLogic,
  validateFile,
} from "@/features/admin/utils/form-helpers";
import { Button, Card } from "@/features/admin/components";
import { trackEventRegistration } from "@/lib/analytics";

interface ConditionalLogic {
  dependsOnFieldId: string;
  operator: ConditionalOperator;
  value?: string;
}

interface FormField {
  id: string;
  label: string;
  placeholder: string | null;
  fieldType: string;
  options: string[] | null;
  isRequired: boolean;
  order: number;
  step: number;
  conditionalLogic: ConditionalLogic | null;
  maxFileSize: number | null;
  acceptedTypes: string | null;
}

interface DynamicRegistrationFormProps {
  eventId: string;
  eventSlug: string;
  eventTitle: string;
  formId: string;
  fields: FormField[];
  totalSteps: number;
  maxAttendees: number | null;
  submissionCount: number;
}

export function DynamicRegistrationForm({
  eventId,
  eventSlug,
  eventTitle,
  formId,
  fields,
  totalSteps,
  maxAttendees,
  submissionCount,
}: DynamicRegistrationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fileData, setFileData] = useState<Record<string, { name: string; data: string; size: number; type: string }>>({});

  const spotsLeft = maxAttendees ? maxAttendees - submissionCount : null;

  // Generate dynamic schema based on field definitions
  const dynamicSchema = generateDynamicFormSchema(
    fields.map((f) => ({
      id: f.id,
      label: f.label,
      fieldType: f.fieldType as FieldType,
      isRequired: f.isRequired,
      options: f.options,
    }))
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSubmissionResponse>({
    resolver: zodResolver(dynamicSchema) as Resolver<FormSubmissionResponse>,
    defaultValues: fields.reduce((acc, field) => {
      if (field.fieldType === "CHECKBOX") {
        acc[field.id] = false;
      } else {
        acc[field.id] = "";
      }
      return acc;
    }, {} as FormSubmissionResponse),
  });

  // Track when user starts filling the form
  const handleFormFocus = () => {
    if (!hasStarted) {
      setHasStarted(true);
      trackEventRegistration(eventSlug, "start");
    }
  };

  const onSubmit = async (data: FormSubmissionResponse) => {
    setError(null);

    const result = await submitDynamicForm(eventId, formId, data);

    if (result.success) {
      setIsSubmitted(true);
      trackEventRegistration(eventSlug, "success");
    } else {
      const errorMessage = result.error || "Something went wrong. Please try again.";
      setError(errorMessage);
      trackEventRegistration(eventSlug, "error", errorMessage);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-green-800 dark:text-green-200">
            Registration Successful!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            Thank you for registering for <strong>{eventTitle}</strong>. 
            We&apos;ll be in touch with more details soon.
          </p>
        </div>
      </Card>
    );
  }

  // Get visible fields for current step (respecting conditional logic)
  const formValues = watch();
  const visibleFields = fields.filter((field) => {
    // Check conditional logic
    if (field.conditionalLogic) {
      const isVisible = evaluateConditionalLogic(
        field.conditionalLogic,
        formValues,
        fields
      );
      if (!isVisible) return false;
    }
    return true;
  });

  const currentStepFields = visibleFields.filter((f) => f.step === currentStep);
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  const handleNextStep = () => {
    // Validate current step fields before proceeding
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-lg font-semibold">Register for this Event</h3>
      
      {/* Multi-step Progress */}
      {totalSteps > 1 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((currentStep / totalSteps) * 100)}% complete
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {spotsLeft !== null && spotsLeft <= 10 && spotsLeft > 0 && (
        <div className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-200">
          ⚠️ Only {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} remaining!
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} onFocus={handleFormFocus} className="space-y-4">
        {currentStepFields.map((field) => (
          <DynamicField
            key={field.id}
            field={field}
            register={register}
            watch={watch}
            setValue={setValue}
            error={errors[field.id]?.message as string | undefined}
            fileData={fileData}
            setFileData={setFileData}
          />
        ))}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-2">
          {!isFirstStep && totalSteps > 1 && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handlePrevStep}
              className="flex-1"
            >
              ← Back
            </Button>
          )}
          
          {isLastStep ? (
            <Button type="submit" className="flex-1" loading={isSubmitting}>
              Register Now
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={handleNextStep}
              className="flex-1"
            >
              Next →
            </Button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By registering, you agree to receive event-related communications.
        </p>
      </form>
    </Card>
  );
}

// ============================================
// Dynamic Field Renderer
// ============================================

interface DynamicFieldProps {
  field: FormField;
  register: ReturnType<typeof useForm<FormSubmissionResponse>>["register"];
  watch: ReturnType<typeof useForm<FormSubmissionResponse>>["watch"];
  setValue: ReturnType<typeof useForm<FormSubmissionResponse>>["setValue"];
  error?: string;
  fileData: Record<string, { name: string; data: string; size: number; type: string }>;
  setFileData: React.Dispatch<React.SetStateAction<Record<string, { name: string; data: string; size: number; type: string }>>>;
}

function DynamicField({ field, register, watch, setValue, error, fileData, setFileData }: DynamicFieldProps) {
  const fieldType = field.fieldType as FieldType;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputClasses = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary";
  const errorClasses = error || fileError ? "border-destructive" : "";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);

    // Validate file
    const validation = validateFile(
      { size: file.size, type: file.type, name: file.name },
      field.maxFileSize,
      field.acceptedTypes
    );

    if (!validation.valid) {
      setFileError(validation.error || "Invalid file");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1] || "";
      setFileData((prev) => ({
        ...prev,
        [field.id]: {
          name: file.name,
          data: base64,
          size: file.size,
          type: file.type,
        },
      }));
      setValue(field.id, file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {fieldType !== "CHECKBOX" && (
        <label className="mb-1 block text-sm font-medium">
          {field.label}
          {field.isRequired && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {fieldType === "TEXTAREA" ? (
        <textarea
          {...register(field.id)}
          rows={3}
          className={`${inputClasses} ${errorClasses}`}
          placeholder={field.placeholder || ""}
        />
      ) : fieldType === "SELECT" ? (
        <select
          {...register(field.id)}
          className={`${inputClasses} ${errorClasses}`}
        >
          <option value="">{field.placeholder || "Select an option..."}</option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : fieldType === "CHECKBOX" ? (
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={watch(field.id) as boolean}
            onChange={(e) => setValue(field.id, e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border"
          />
          <span className="text-sm">
            {field.label}
            {field.isRequired && <span className="text-destructive ml-1">*</span>}
          </span>
        </label>
      ) : fieldType === "FILE" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={field.acceptedTypes || "image/*,application/pdf"}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`${inputClasses} ${errorClasses} flex items-center gap-2 cursor-pointer hover:bg-muted/50`}
          >
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-muted-foreground">
              {fileData[field.id]?.name || field.placeholder || "Click to upload a file"}
            </span>
          </button>
          {fileData[field.id] && (
            <p className="mt-1 text-xs text-muted-foreground">
              {fileData[field.id]?.name} ({((fileData[field.id]?.size ?? 0) / 1024).toFixed(1)}KB)
            </p>
          )}
          {field.maxFileSize && (
            <p className="mt-1 text-xs text-muted-foreground">
              Max size: {field.maxFileSize / 1024}KB
            </p>
          )}
        </div>
      ) : (
        <input
          {...register(field.id)}
          type={fieldType === "EMAIL" ? "email" : fieldType === "PHONE" ? "tel" : "text"}
          className={`${inputClasses} ${errorClasses}`}
          placeholder={field.placeholder || ""}
        />
      )}

      {(error || fileError) && (
        <p className="mt-1 text-xs text-destructive">{error || fileError}</p>
      )}
    </div>
  );
}
