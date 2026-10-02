/**
 * Prisma Database Seed Script for Google Cloud SQL (PostgreSQL 15)
 * 
 * Usage:
 * npx tsx scripts/seed.ts
 */

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DXN Orion database seeding...');

  const adminEmail = process.env.ADMIN_EMAIL || 'shivam@dxn-orion.com';
  // Standard bcrypt hash for initial password or configured
  const defaultPasswordHash = '$2b$12$eX8zW1hI6dFqB9T3yU8eQO6tE3s1a4K9l0M1n2O3p4Q5r6S7t8U9v';

  // 1. Seed Super Admin
  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Shivam Pratap Singh',
      role: 'SUPER_ADMIN',
      passwordHash: defaultPasswordHash
    }
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Seed Categories
  const categories = [
    { name: 'Location Guides', slug: 'location-guides', description: 'Detailed insights on Sector 22D, connectivity, and Yamuna Expressway micro-markets.' },
    { name: 'Investment & ROI', slug: 'investment-roi', description: 'Capital appreciation forecasts, pre-launch price advantages, and rental yields.' },
    { name: 'Infrastructure', slug: 'infrastructure', description: 'Updates on Jewar Airport, Film City, Pod Taxis, and Eastern Peripheral Expressway.' },
    { name: 'Apartment Guides', slug: 'apartment-guides', description: 'Floor plans, luxury architecture, vastu compliance, and interior planning.' },
    { name: 'RERA & Legal', slug: 'rera-legal', description: 'UP RERA verification, buyer rights, legal checklists, and allotment procedures.' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }
  console.log(`✅ ${categories.length} Categories seeded.`);

  // 3. Seed Settings
  await prisma.siteSetting.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'DXN Orion',
      phone: '+919876543210',
      whatsappNumber: '+919876543210',
      email: 'sales@dxn-orion.com',
      reraNumber: 'UPRERA-PRJ-2025-APP-88492',
      ga4Id: 'G-DXNORION22D',
      metaPixelId: '7849102938471',
      googleAdsId: 'AW-984029182',
      gscVerification: 'google-site-verification=dxn_orion_yamuna_exp_sec22d'
    }
  });
  console.log('✅ Site settings seeded.');

  console.log('🎉 Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
