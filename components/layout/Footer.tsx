import Link from "next/link";
import Image from "next/image";
import { getSiteSettings } from "@/features/admin/actions/site-settings";

// Default tagline
const defaultTagline = "Empowering communities through faith, love, and dedicated service. Building bridges of hope for a brighter tomorrow.";

const footerLinks = {
  organization: [
    { href: "/about", label: "About Us" },
    { href: "/programs", label: "Our Programs" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/legal#privacy", label: "Privacy Policy" },
    { href: "/legal#terms", label: "Terms of Service" },
  ],
};

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    facebook: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  };
  return <>{icons[name]}</>;
}

export async function Footer() {
  // Fetch site settings for dynamic content
  const siteSettings = await getSiteSettings([
    "footer-tagline",
    "social-facebook",
    "social-instagram",
    "social-twitter",
  ]);
  
  const tagline = siteSettings["footer-tagline"] || defaultTagline;
  
  // Build social links from settings
  const socialLinks = [
    { href: siteSettings["social-facebook"] || "https://facebook.com", label: "Facebook", icon: "facebook" },
    { href: siteSettings["social-instagram"] || "https://instagram.com", label: "Instagram", icon: "instagram" },
    { href: siteSettings["social-twitter"] || "https://twitter.com", label: "Twitter", icon: "twitter" },
  ];

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 mb-4 min-h-[44px] touch-action-manipulation">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                <Image
                  src="/logo.png"
                  alt="Zionlight Family Foundation"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-semibold text-base sm:text-lg">Zionlight Family Foundation</span>
            </Link>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-5 sm:mb-6">
              {tagline}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all touch-action-manipulation"
                  aria-label={link.label}
                >
                  <SocialIcon name={link.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.organization.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="inline-flex items-center min-h-[44px] sm:min-h-0 text-sm sm:text-base text-muted-foreground hover:text-primary active:scale-95 transition-all touch-action-manipulation"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Legal</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="inline-flex items-center min-h-[44px] sm:min-h-0 text-sm sm:text-base text-muted-foreground hover:text-primary active:scale-95 transition-all touch-action-manipulation"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} Zionlight Family Foundation. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              A registered 501(c)(3) non-profit organization
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
