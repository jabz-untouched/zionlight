import Link from "next/link";
import { cn } from "@/utils/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

interface DataTableProps<T> {
  columns: {
    key: keyof T | "actions";
    label: string;
    render?: (item: T) => React.ReactNode;
  }[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  columns,
  data,
  emptyMessage = "No items found",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left font-medium"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-muted/30">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3">
                  {col.render
                    ? col.render(item)
                    : String(item[col.key as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({
  active,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        active
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
      )}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({ label, error, children, required }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors",
        "focus:ring-2 focus:ring-primary",
        error ? "border-destructive" : "border-border",
        className
      )}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition-colors",
        "focus:ring-2 focus:ring-primary",
        error ? "border-destructive" : "border-border",
        className
      )}
      rows={4}
      {...props}
    />
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded border-border text-primary focus:ring-primary",
          className
        )}
        {...props}
      />
      {label}
    </label>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline" | "destructive";
  size?: "sm" | "md";
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90":
            variant === "primary",
          "border border-border bg-background hover:bg-muted":
            variant === "secondary" || variant === "outline",
          "bg-destructive text-white hover:bg-destructive/90":
            variant === "danger" || variant === "destructive",
          "hover:bg-muted": variant === "ghost",
        },
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-sm": size === "md",
        },
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg border bg-background p-6", className)}>
      {children}
    </div>
  );
}

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ children, className, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-sm font-medium", className)}
      {...props}
    >
      {children}
    </label>
  );
}

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}
