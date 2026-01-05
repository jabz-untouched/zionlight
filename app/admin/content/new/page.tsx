import type { Metadata } from "next";
import { PageContentForm } from "../_components/page-content-form";

export const metadata: Metadata = {
  title: "Add Content | Content Management",
  description: "Add a new page content section.",
};

export default function NewPageContentPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add New Content</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new content section for a page. Each section is identified by its page and section key.
        </p>
      </div>

      <PageContentForm />
    </div>
  );
}
