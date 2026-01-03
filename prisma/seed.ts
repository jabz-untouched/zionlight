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
