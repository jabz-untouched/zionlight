import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@zionlight.org" },
    update: {},
    create: {
      email: "admin@zionlight.org",
      password: hashedPassword,
      name: "Super Admin",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Created admin user:", admin.email);

  // Create sample program
  const program = await prisma.program.upsert({
    where: { slug: "community-outreach" },
    update: {},
    create: {
      title: "Community Outreach",
      slug: "community-outreach",
      description: "Our flagship community outreach program.",
      content: "Detailed information about the community outreach program...",
      isActive: true,
      isFeatured: true,
      order: 1,
    },
  });

  console.log("✅ Created sample program:", program.title);

  // Create sample team member
  const teamMember = await prisma.teamMember.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "John Doe",
      role: "Executive Director",
      bio: "Leading the foundation with passion and dedication.",
      isActive: true,
      isFeatured: true,
      order: 1,
    },
  });

  console.log("✅ Created sample team member:", teamMember.name);

  // Create sample gallery item
  const galleryItem = await prisma.galleryItem.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      title: "Community Event 2024",
      description: "Annual community gathering and celebration.",
      imageUrl: "/images/placeholder.jpg",
      category: "events",
      tags: ["community", "annual", "celebration"],
      isActive: true,
      isFeatured: true,
      order: 1,
    },
  });

  console.log("✅ Created sample gallery item:", galleryItem.title);

  // Create managed images
  const heroImage = await prisma.managedImage.upsert({
    where: { key: "home-hero" },
    update: {},
    create: {
      key: "home-hero",
      title: "Homepage Hero Image",
      description: "Main hero image for the homepage",
      altText: "Zionlight Family Foundation - Building bridges of hope",
      imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80",
      context: "HERO",
      position: "CENTER",
      isActive: true,
      order: 1,
    },
  });

  console.log("✅ Created hero image:", heroImage.title);

  const globalFallback = await prisma.managedImage.upsert({
    where: { key: "global-fallback" },
    update: {},
    create: {
      key: "global-fallback",
      title: "Global Fallback Image",
      description: "Default placeholder image used when no image is available",
      altText: "Zionlight Family Foundation",
      imageUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80",
      context: "GLOBAL",
      position: "CENTER",
      isActive: true,
      order: 1,
    },
  });

  console.log("✅ Created global fallback image:", globalFallback.title);

  const aboutFeature = await prisma.managedImage.upsert({
    where: { key: "home-about-feature" },
    update: {},
    create: {
      key: "home-about-feature",
      title: "About Section Feature",
      description: "Feature image for the homepage about section",
      altText: "Our mission in action",
      imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
      context: "HOME",
      position: "CENTER",
      isActive: true,
      order: 1,
    },
  });

  console.log("✅ Created about feature image:", aboutFeature.title);

  const ctaFeature = await prisma.managedImage.upsert({
    where: { key: "home-cta-feature" },
    update: {},
    create: {
      key: "home-cta-feature",
      title: "CTA Section Feature",
      description: "Feature image for the homepage call-to-action section",
      altText: "Join our community",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
      context: "HOME",
      position: "CENTER",
      isActive: true,
      order: 2,
    },
  });

  console.log("✅ Created CTA feature image:", ctaFeature.title);

  // Create additional hero images for the slider
  const heroImage2 = await prisma.managedImage.upsert({
    where: { key: "home-hero-2" },
    update: {},
    create: {
      key: "home-hero-2",
      title: "Community Together",
      description: "Hero slide showing community unity",
      altText: "Community members coming together in faith",
      imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80",
      context: "HERO",
      position: "CENTER",
      isActive: true,
      order: 2,
    },
  });

  console.log("✅ Created hero slide 2:", heroImage2.title);

  const heroImage3 = await prisma.managedImage.upsert({
    where: { key: "home-hero-3" },
    update: {},
    create: {
      key: "home-hero-3",
      title: "Empowering Youth",
      description: "Hero slide featuring youth programs",
      altText: "Youth empowerment and education programs",
      imageUrl: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80",
      context: "HERO",
      position: "CENTER",
      isActive: true,
      order: 3,
    },
  });

  console.log("✅ Created hero slide 3:", heroImage3.title);

  // ==========================================
  // SITE SETTINGS
  // ==========================================
  console.log("📝 Creating site settings...");

  const siteSettings = [
    { key: "footer-tagline", value: "Empowering communities through faith, love, and dedicated service. Building bridges of hope for a brighter tomorrow.", description: "Footer tagline text" },
    { key: "contact-email", value: "info@zionlight.org\nsupport@zionlight.org", description: "Contact email addresses" },
    { key: "contact-phone", value: "+1 (555) 123-4567\nMon-Fri: 9am - 5pm", description: "Contact phone numbers" },
    { key: "contact-address", value: "123 Faith Street, Community Center\nHope City, HC 12345", description: "Physical address" },
    { key: "social-facebook", value: "https://facebook.com/zionlightfoundation", description: "Facebook page URL" },
    { key: "social-instagram", value: "https://instagram.com/zionlightfoundation", description: "Instagram page URL" },
    { key: "social-twitter", value: "https://twitter.com/zionlightfdn", description: "Twitter/X page URL" },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("✅ Created site settings");

  // ==========================================
  // PAGE CONTENT
  // ==========================================
  console.log("📝 Creating page content...");

  // Home page content
  const homeContent = [
    {
      pageId: "home",
      sectionKey: "hero",
      title: "Building Bridges of Hope & Faith",
      subtitle: "Empowering Communities Since 2010",
      body: "Zionlight Family Foundation is dedicated to transforming lives through compassionate outreach, educational programs, and community empowerment.",
      isActive: true,
      order: 1,
    },
    {
      pageId: "home",
      sectionKey: "mission-preview",
      title: "Our Guiding Mission",
      subtitle: "Our Guiding Mission",
      body: "To serve with love, uplift with faith, and empower with action—creating lasting change in the lives we touch.",
      isActive: true,
      order: 2,
    },
    {
      pageId: "home",
      sectionKey: "cta",
      title: "Ready to Make a Difference?",
      body: "Join us in our mission to build stronger communities. Whether through volunteering, partnerships, or simply spreading the word—every action counts.",
      ctaText: "Get in Touch",
      ctaLink: "/contact",
      isActive: true,
      order: 3,
    },
    {
      pageId: "home",
      sectionKey: "stats",
      title: "Our Impact",
      body: "See how we've made a difference over the years.",
      metadata: JSON.stringify({
        stats: [
          { number: "15+", label: "Years of Service" },
          { number: "5,000+", label: "Lives Touched" },
          { number: "25+", label: "Programs Run" },
          { number: "100+", label: "Volunteers" },
        ],
      }),
      isActive: true,
      order: 4,
    },
  ];

  for (const content of homeContent) {
    await prisma.pageContent.upsert({
      where: {
        pageId_sectionKey: { pageId: content.pageId, sectionKey: content.sectionKey },
      },
      update: content,
      create: content,
    });
  }

  console.log("✅ Created home page content");

  // About page content
  const aboutContent = [
    {
      pageId: "about",
      sectionKey: "hero",
      title: "Who We Are",
      body: "Zionlight Family Foundation is a faith-based non-profit organization committed to transforming communities through compassion, service, and unwavering dedication to human dignity.",
      isActive: true,
      order: 1,
    },
    {
      pageId: "about",
      sectionKey: "story",
      title: "Our Story",
      body: `Founded in 2010, Zionlight Family Foundation emerged from a simple yet powerful vision: to be a beacon of hope for families and communities in need. What began as a small group of dedicated volunteers has grown into a thriving organization touching thousands of lives.

Our journey has been marked by countless stories of transformation—children receiving education, families finding stability, and communities discovering their collective strength. Each milestone reinforces our commitment to serving with love and integrity.

Today, we continue to expand our reach while staying true to our founding principles: faith, family, and community service.`,
      isActive: true,
      order: 2,
    },
    {
      pageId: "about",
      sectionKey: "vision",
      title: "Our Vision",
      body: "To see every family empowered, every community thriving, and every individual realizing their God-given potential. We envision a world where love transcends barriers and hope illuminates the darkest corners.",
      isActive: true,
      order: 3,
    },
    {
      pageId: "about",
      sectionKey: "mission",
      title: "Our Mission",
      body: "To serve with love, uplift with faith, and empower with action—creating lasting change through educational initiatives, community programs, and spiritual support that honor the dignity of every person we serve.",
      isActive: true,
      order: 4,
    },
    {
      pageId: "about",
      sectionKey: "hemer-values",
      title: "The HEMER Principles",
      subtitle: "Our Values",
      body: "Five core values that guide everything we do.",
      metadata: JSON.stringify({
        values: [
          { letter: "H", word: "Humility", description: "Serving others with a humble heart" },
          { letter: "E", word: "Excellence", description: "Striving for the highest standards" },
          { letter: "M", word: "Mercy", description: "Extending grace and compassion" },
          { letter: "E", word: "Empowerment", description: "Building capacity in communities" },
          { letter: "R", word: "Resilience", description: "Persevering through challenges" },
        ],
      }),
      isActive: true,
      order: 5,
    },
    {
      pageId: "about",
      sectionKey: "cta",
      title: "Join Our Journey",
      body: "Whether you want to volunteer, partner with us, or simply learn more about our work, we'd love to connect with you.",
      ctaText: "Get in Touch",
      ctaLink: "/contact",
      isActive: true,
      order: 6,
    },
  ];

  for (const content of aboutContent) {
    await prisma.pageContent.upsert({
      where: {
        pageId_sectionKey: { pageId: content.pageId, sectionKey: content.sectionKey },
      },
      update: content,
      create: content,
    });
  }

  console.log("✅ Created about page content");

  // Programs page content
  const programsContent = [
    {
      pageId: "programs",
      sectionKey: "hero",
      title: "Our Programs",
      body: "Through our diverse range of programs, we address the most pressing needs of our communities—from education and family support to spiritual growth and community development.",
      isActive: true,
      order: 1,
    },
    {
      pageId: "programs",
      sectionKey: "cta",
      title: "Want to Get Involved?",
      body: "Our programs thrive because of people like you. Whether you want to volunteer, partner, or support our work—there's a place for you.",
      ctaText: "Contact Us",
      ctaLink: "/contact",
      isActive: true,
      order: 2,
    },
  ];

  for (const content of programsContent) {
    await prisma.pageContent.upsert({
      where: {
        pageId_sectionKey: { pageId: content.pageId, sectionKey: content.sectionKey },
      },
      update: content,
      create: content,
    });
  }

  console.log("✅ Created programs page content");

  // Gallery page content
  const galleryContent = [
    {
      pageId: "gallery",
      sectionKey: "hero",
      title: "Gallery",
      body: "Capturing moments of hope, transformation, and community. Each image tells a story of lives touched and communities strengthened.",
      isActive: true,
      order: 1,
    },
  ];

  for (const content of galleryContent) {
    await prisma.pageContent.upsert({
      where: {
        pageId_sectionKey: { pageId: content.pageId, sectionKey: content.sectionKey },
      },
      update: content,
      create: content,
    });
  }

  console.log("✅ Created gallery page content");

  // Contact page content
  const contactContent = [
    {
      pageId: "contact",
      sectionKey: "hero",
      title: "Contact Us",
      body: "Have questions? Want to get involved? We'd love to hear from you. Reach out and let's start a conversation.",
      isActive: true,
      order: 1,
    },
  ];

  for (const content of contactContent) {
    await prisma.pageContent.upsert({
      where: {
        pageId_sectionKey: { pageId: content.pageId, sectionKey: content.sectionKey },
      },
      update: content,
      create: content,
    });
  }

  console.log("✅ Created contact page content");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
