import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// Schema for updating a site (all fields are optional)
const updateSiteSchema = z.object({
  name: z.string().min(1, 'Site adı boş olamaz').optional(),
  description: z.string().optional(),
  domain: z.string().optional(),
  subdomain: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  theme: z.any().optional(),
  customCSS: z.string().optional(),
});

async function getSiteAndAuthorize(req: NextRequest, params: { siteId: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { user: null, site: null, error: NextResponse.json({ success: false, message: 'Oturum açmanız gerekiyor', error: { code: 'UNAUTHORIZED' } }, { status: 401 }) };
  }

  const { siteId } = params;
  if (!siteId) {
    return { user: null, site: null, error: NextResponse.json({ success: false, message: 'Site ID\'si gerekli' }, { status: 400 }) };
  }

  const site = await prisma.site.findUnique({
    where: { id: siteId },
  });

  if (!site) {
    return { user: null, site: null, error: NextResponse.json({ success: false, message: 'Site bulunamadı', error: { code: 'SITE_NOT_FOUND' } }, { status: 404 }) };
  }

  if (site.userId !== session.user.id) {
    return { user: null, site: null, error: NextResponse.json({ success: false, message: 'Bu siteye erişim yetkiniz yok', error: { code: 'FORBIDDEN' } }, { status: 403 }) };
  }

  return { user: session.user, site, error: null };
}

/**
 * GET /api/sites/:siteId - Get site details
 */
export async function GET(request: NextRequest, { params }: { params: { siteId: string } }) {
  const { site, error } = await getSiteAndAuthorize(request, params);
  if (error) return error;

  // Refetch with counts
  const siteWithCounts = await prisma.site.findUnique({
      where: { id: params.siteId },
      include: {
          _count: {
              select: { pages: true, media: true }
          }
      }
  });

  return NextResponse.json({ success: true, data: { site: siteWithCounts } });
}

/**
 * PATCH /api/sites/:siteId - Update a site
 */
export async function PATCH(request: NextRequest, { params }: { params: { siteId: string } }) {
  const { site, error: authError } = await getSiteAndAuthorize(request, params);
  if (authError) return authError;

  try {
    const body = await request.json();
    const validation = updateSiteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: validation.error.issues[0].message,
        error: { code: 'VALIDATION_ERROR', field: validation.error.issues[0].path[0] },
      }, { status: 400 });
    }

    const { domain, subdomain } = validation.data;

    // Check for unique domain/subdomain if they are being updated
    if (domain || subdomain) {
      const existingSite = await prisma.site.findFirst({
        where: {
          id: { not: params.siteId }, // Exclude the current site from the check
          OR: [
            domain ? { domain } : undefined,
            subdomain ? { subdomain } : undefined,
          ].filter(Boolean) as any,
        },
      });

      if (existingSite) {
        const field = existingSite.domain === domain ? 'domain' : 'subdomain';
        return NextResponse.json({ success: false, message: `Bu ${field} zaten kullanımda`, error: { code: 'DOMAIN_EXISTS', field } }, { status: 409 });
      }
    }

    const updatedSite = await prisma.site.update({
      where: { id: params.siteId },
      data: validation.data,
    });

    return NextResponse.json({ success: true, message: 'Site güncellendi', data: { site: updatedSite } });

  } catch (error) {
    console.error("UPDATE_SITE_ERROR", error);
    return NextResponse.json({ success: false, message: 'Site güncellenirken bir hata oluştu.', error: { code: 'INTERNAL_ERROR' } }, { status: 500 });
  }
}

/**
 * DELETE /api/sites/:siteId - Delete a site
 */
export async function DELETE(request: NextRequest, { params }: { params: { siteId: string } }) {
  const { site, error: authError } = await getSiteAndAuthorize(request, params);
  if (authError) return authError;

  try {
    await prisma.site.delete({
      where: { id: params.siteId },
    });

    return NextResponse.json({ success: true, message: 'Site başarıyla silindi' });

  } catch (error) {
    console.error("DELETE_SITE_ERROR", error);
    return NextResponse.json({ success: false, message: 'Site silinirken bir hata oluştu.', error: { code: 'INTERNAL_ERROR' } }, { status: 500 });
  }
}