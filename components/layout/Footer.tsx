export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Zionlight Family Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Social links and legal links will be added in future phases */}
          </div>
        </div>
      </div>
    </footer>
  );
}
