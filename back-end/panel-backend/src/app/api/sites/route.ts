
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@/lib/auth'; // Assuming auth is configured for NextAuth

const prisma = new PrismaClient();

// Schema for creating a new site
const createSiteSchema = z.object({
  name: z.string().min(1, 'Site adı boş olamaz'),
  description: z.string().optional(),
  domain: z.string().optional(),
  subdomain: z.string().optional(),
  demoId: z.string().optional(),
  theme: z.any().optional(), // Or a more specific Zod schema for theme
});

/**
 * GET /api/sites - List all sites for the authenticated user
 */
export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ 
      success: false, 
      message: 'Oturum açmanız gerekiyor', 
      error: { code: 'UNAUTHORIZED' } 
    }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const sortBy = searchParams.get('sortBy') || 'createdAt';
  const order = searchParams.get('order') || 'desc';

  const skip = (page - 1) * limit;

  try {
    const where = {
      userId: session.user.id,
      OR: search ? [
        { name: { contains: search, mode: 'insensitive' } },
        { domain: { contains: search, mode: 'insensitive' } },
        { subdomain: { contains: search, mode: 'insensitive' } },
      ] : undefined,
    };

    const [sites, total] = await prisma.$transaction([
      prisma.site.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
        include: {
          _count: {
            select: { pages: true },
          },
        },
      }),
      prisma.site.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        sites,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
    });

  } catch (error) {
    console.error("GET_SITES_ERROR", error);
    return NextResponse.json({ 
      success: false, 
      message: 'Siteler getirilirken bir hata oluştu.', 
      error: { code: 'INTERNAL_ERROR' } 
    }, { status: 500 });
  }
}

/**
 * POST /api/sites - Create a new site
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ 
      success: false, 
      message: 'Oturum açmanız gerekiyor', 
      error: { code: 'UNAUTHORIZED' } 
    }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = createSiteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: validation.error.issues[0].message,
        error: {
          code: 'VALIDATION_ERROR',
          field: validation.error.issues[0].path[0],
        },
      }, { status: 400 });
    }

    const { name, description, domain, subdomain, demoId, theme } = validation.data;

    // Check for unique domain/subdomain if they are provided
    if (domain || subdomain) {
      const existingSite = await prisma.site.findFirst({
        where: {
          OR: [
            domain ? { domain } : undefined,
            subdomain ? { subdomain } : undefined,
          ].filter(Boolean) as any,
        },
      });

      if (existingSite) {
        const field = existingSite.domain === domain ? 'domain' : 'subdomain';
        return NextResponse.json({
          success: false,
          message: `Bu ${field} zaten kullanımda`,
          error: {
            code: 'DOMAIN_EXISTS',
            field,
          },
        }, { status: 409 });
      }
    }

    const newSite = await prisma.site.create({
      data: {
        name,
        description,
        domain,
        subdomain,
        demoId,
        theme,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Site başarıyla oluşturuldu',
      data: { site: newSite },
    }, { status: 201 });

  } catch (error) {
    console.error("CREATE_SITE_ERROR", error);
    // Handle potential Prisma unique constraint errors if the first check fails due to a race condition
    if ((error as any).code === 'P2002') {
        return NextResponse.json({
          success: false,
          message: `Bu domain veya subdomain zaten kullanımda`,
          error: {
            code: 'DOMAIN_EXISTS',
          },
        }, { status: 409 });
    }
    return NextResponse.json({ 
      success: false, 
      message: 'Site oluşturulurken bir hata oluştu.', 
      error: { code: 'INTERNAL_ERROR' } 
    }, { status: 500 });
  }
}
