import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Admin user
  const adminEmail = 'admin@gradiator.com';
  const adminPassword = await bcrypt.hash('Admin123!', 10);

  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
    return;
  }

  // Create admin
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);

  // Create demo site
  const demoSite = await prisma.site.create({
    data: {
      name: 'Demo Site',
      description: 'Örnek site - Test için oluşturuldu',
      subdomain: 'demo',
      userId: admin.id,
    },
  });

  console.log('Demo site created:', demoSite.name);

  // Create demo page
  const demoPage = await prisma.page.create({
    data: {
      title: 'Ana Sayfa',
      slug: 'ana-sayfa',
      content: {
        blocks: [
          {
            id: 'heading-1',
            type: 'heading',
            order: 0,
            props: {
              text: 'Gradiator CMS\'e Hoş Geldiniz!',
              level: 1,
              alignment: 'center',
            },
          },
          {
            id: 'text-1',
            type: 'text',
            order: 1,
            props: {
              text: 'Bu demo sayfadır. Page Builder ile düzenleyebilirsiniz.',
              alignment: 'center',
            },
          },
          {
            id: 'button-1',
            type: 'button',
            order: 2,
            props: {
              text: 'Hemen Başla',
              href: '/dashboard',
              variant: 'primary',
              alignment: 'center',
              size: 'lg',
            },
          },
        ],
      },
      metaTitle: 'Ana Sayfa - Demo Site',
      metaDescription: 'Gradiator CMS demo site ana sayfası',
      isPublished: true,
      siteId: demoSite.id,
    },
  });

  console.log('Demo page created:', demoPage.title);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
