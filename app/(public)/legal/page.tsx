import type { Metadata } from "next";
import { 
  Section, 
  Container, 
  Badge,
} from "@/components/ui";
import { MotionDiv } from "@/components/ui";

export const metadata: Metadata = {
  title: "Legal | Zionlight Family Foundation",
  description: "Privacy policy, terms of service, and legal information for Zionlight Family Foundation.",
};

export default function LegalPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <Container className="relative z-10">
          <MotionDiv className="max-w-3xl">
            <Badge variant="primary" className="mb-4">Legal</Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Legal Information
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Our commitment to transparency and your rights.
            </p>
          </MotionDiv>
        </Container>
      </section>

      {/* Navigation */}
      <Section className="py-8 border-b border-border">
        <Container>
          <div className="flex gap-6">
            <a href="#privacy" className="text-sm font-medium hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-sm font-medium hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </Container>
      </Section>

      {/* Privacy Policy */}
      <Section id="privacy">
        <Container size="sm">
          <MotionDiv>
            <h2 className="text-3xl font-bold mb-8">Privacy Policy</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-muted-foreground mb-6">
                <strong className="text-foreground">Last Updated:</strong> January 1, 2026
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h3>
              <p className="mb-4">
                At Zionlight Family Foundation, we are committed to protecting your privacy. 
                We collect information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Contact us through our website</li>
                <li>Subscribe to our newsletter</li>
                <li>Participate in our programs</li>
                <li>Volunteer with our organization</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h3>
              <p className="mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Respond to your inquiries and requests</li>
                <li>Send you updates about our programs and activities</li>
                <li>Improve our services and website</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Information Sharing</h3>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to 
                outside parties except when required by law or with your explicit consent.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Data Security</h3>
              <p className="mb-4">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Your Rights</h3>
              <p className="mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Contact Us</h3>
              <p className="mb-4">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mb-4">
                <strong className="text-foreground">Email:</strong> privacy@zionlight.org<br />
                <strong className="text-foreground">Address:</strong> 123 Faith Street, Hope City, HC 12345
              </p>
            </div>
          </MotionDiv>
        </Container>
      </Section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Terms of Service */}
      <Section id="terms">
        <Container size="sm">
          <MotionDiv>
            <h2 className="text-3xl font-bold mb-8">Terms of Service</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-muted-foreground mb-6">
                <strong className="text-foreground">Last Updated:</strong> January 1, 2026
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h3>
              <p className="mb-4">
                By accessing and using this website, you accept and agree to be bound by the 
                terms and provisions of this agreement.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Use of Website</h3>
              <p className="mb-4">
                You agree to use this website only for lawful purposes and in a way that does 
                not infringe the rights of, restrict, or inhibit anyone else&apos;s use and 
                enjoyment of the website.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Intellectual Property</h3>
              <p className="mb-4">
                All content on this website, including text, graphics, logos, images, and 
                software, is the property of Zionlight Family Foundation and is protected 
                by copyright and other intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Disclaimer</h3>
              <p className="mb-4">
                The information provided on this website is for general informational purposes 
                only. We make no representations or warranties of any kind, express or implied, 
                about the completeness, accuracy, reliability, suitability, or availability of 
                the information.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Limitation of Liability</h3>
              <p className="mb-4">
                In no event shall Zionlight Family Foundation be liable for any loss or damage 
                including, without limitation, indirect or consequential loss or damage arising 
                from or in connection with the use of this website.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">6. External Links</h3>
              <p className="mb-4">
                Our website may contain links to external websites. We have no control over 
                the content and availability of those sites and are not responsible for their 
                content or privacy practices.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">7. Changes to Terms</h3>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. Changes will be 
                effective immediately upon posting on this website. Your continued use of 
                the website constitutes acceptance of the modified terms.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">8. Governing Law</h3>
              <p className="mb-4">
                These terms shall be governed by and construed in accordance with the laws 
                of the jurisdiction in which Zionlight Family Foundation is registered, 
                without regard to its conflict of law provisions.
              </p>

              <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">9. Contact Information</h3>
              <p className="mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="mb-4">
                <strong className="text-foreground">Email:</strong> legal@zionlight.org<br />
                <strong className="text-foreground">Address:</strong> 123 Faith Street, Hope City, HC 12345
              </p>
            </div>
          </MotionDiv>
        </Container>
      </Section>
    </>
  );
}
