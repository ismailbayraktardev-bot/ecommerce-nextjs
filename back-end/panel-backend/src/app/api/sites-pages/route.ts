
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// Schema for creating a new page
const createPageSchema = z.object({
  title: z.string().min(1, 'Sayfa başlığı boş olamaz'),
  slug: z.string().min(1, 'URL boş olamaz').regex(/^[a-z0-9-]+$/, 'URL sadece küçük harf, rakam ve tire içerebilir'),
  content: z.any().optional(), // JSON content for the page builder
  published: z.boolean().optional().default(false),
});

/**
 * Helper function to authorize user access to a site
 */
async function authorizeSiteAccess(userId: string, siteId: string) {
  const site = await prisma.site.findUnique({
    where: { id: siteId },
  });
  if (!site) {
    return { success: false, error: NextResponse.json({ success: false, message: 'Site bulunamadı' }, { status: 404 }) };
  }
  if (site.userId !== userId) {
    return { success: false, error: NextResponse.json({ success: false, message: 'Bu siteye erişim yetkiniz yok' }, { status: 403 }) };
  }
  return { success: true, error: null };
}

/**
 * GET /api/sites/:siteId/pages - List all pages for a specific site
 */
export async function GET(request: NextRequest, { params }: { params: { siteId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Oturum açmanız gerekiyor' }, { status: 401 });
  }

  const { siteId } = params;
  const authResult = await authorizeSiteAccess(session.user.id, siteId);
  if (!authResult.success) return authResult.error!;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';

  const skip = (page - 1) * limit;

  try {
    const where = {
      siteId,
      title: { contains: search, mode: 'insensitive' },
    };

    const [pages, total] = await prisma.$transaction([
      prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.page.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        pages,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });

  } catch (error) {
    console.error("GET_PAGES_ERROR", error);
    return NextResponse.json({ success: false, message: 'Sayfalar getirilirken bir hata oluştu.' }, { status: 500 });
  }
}

/**
 * POST /api/sites/:siteId/pages - Create a new page for a specific site
 */
export async function POST(request: NextRequest, { params }: { params: { siteId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Oturum açmanız gerekiyor' }, { status: 401 });
  }

  const { siteId } = params;
  const authResult = await authorizeSiteAccess(session.user.id, siteId);
  if (!authResult.success) return authResult.error!;

  try {
    const body = await request.json();
    const validation = createPageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const { title, slug, content, published } = validation.data;

    // Check for unique slug within the site
    const existingPage = await prisma.page.findUnique({
      where: { siteId_slug: { siteId, slug } },
    });

    if (existingPage) {
      return NextResponse.json({ success: false, message: 'Bu URL zaten başka bir sayfa tarafından kullanılıyor.' }, { status: 409 });
    }

    const newPage = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        published,
        siteId,
        userId: session.user.id, // Associate page with the user as well
      },
    });

    return NextResponse.json({ success: true, message: 'Sayfa başarıyla oluşturuldu', data: { page: newPage } }, { status: 201 });

  } catch (error) {
    console.error("CREATE_PAGE_ERROR", error);
    return NextResponse.json({ success: false, message: 'Sayfa oluşturulurken bir hata oluştu.' }, { status: 500 });
  }
}
