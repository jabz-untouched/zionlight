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
