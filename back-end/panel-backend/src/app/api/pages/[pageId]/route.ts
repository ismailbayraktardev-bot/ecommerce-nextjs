
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

// Schema for updating a page (all fields are optional)
const updatePageSchema = z.object({
  title: z.string().min(1, 'Sayfa başlığı boş olamaz').optional(),
  slug: z.string().min(1, 'URL boş olamaz').regex(/^[a-z0-9-]+$/, 'URL sadece küçük harf, rakam ve tire içerebilir').optional(),
  content: z.any().optional(),
  published: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

/**
 * Helper function to authorize user access to a page
 */
async function authorizePageAccess(userId: string, pageId: string) {
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { site: true }, // Include the site to check for ownership
  });

  if (!page) {
    return { success: false, error: NextResponse.json({ success: false, message: 'Sayfa bulunamadı' }, { status: 404 }) };
  }

  // The user must own the site that this page belongs to
  if (page.site.userId !== userId) {
    return { success: false, error: NextResponse.json({ success: false, message: 'Bu sayfaya erişim yetkiniz yok' }, { status: 403 }) };
  }

  return { success: true, page, error: null };
}

/**
 * GET /api/pages/:pageId - Get page details
 */
export async function GET(request: NextRequest, { params }: { params: { pageId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Oturum açmanız gerekiyor' }, { status: 401 });
  }

  const { page, error } = await authorizePageAccess(session.user.id, params.pageId);
  if (error) return error;

  return NextResponse.json({ success: true, data: { page } });
}

/**
 * PATCH /api/pages/:pageId - Update a page
 */
export async function PATCH(request: NextRequest, { params }: { params: { pageId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Oturum açmanız gerekiyor' }, { status: 401 });
  }

  const { page, error: authError } = await authorizePageAccess(session.user.id, params.pageId);
  if (authError) return authError;

  try {
    const body = await request.json();
    const validation = updatePageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, message: validation.error.issues[0].message }, { status: 400 });
    }

    const { slug } = validation.data;

    // If slug is being updated, check for uniqueness within the same site
    if (slug && page) {
      const existingPage = await prisma.page.findUnique({
        where: {
          siteId_slug: { siteId: page.siteId, slug },
          id: { not: params.pageId }, // Exclude the current page
        },
      });
      if (existingPage) {
        return NextResponse.json({ success: false, message: 'Bu URL zaten başka bir sayfa tarafından kullanılıyor.' }, { status: 409 });
      }
    }

    const updatedPage = await prisma.page.update({
      where: { id: params.pageId },
      data: validation.data,
    });

    return NextResponse.json({ success: true, message: 'Sayfa güncellendi', data: { page: updatedPage } });

  } catch (error) {
    console.error("UPDATE_PAGE_ERROR", error);
    return NextResponse.json({ success: false, message: 'Sayfa güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}

/**
 * DELETE /api/pages/:pageId - Delete a page
 */
export async function DELETE(request: NextRequest, { params }: { params: { pageId: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Oturum açmanız gerekiyor' }, { status: 401 });
  }

  const { error: authError } = await authorizePageAccess(session.user.id, params.pageId);
  if (authError) return authError;

  try {
    await prisma.page.delete({
      where: { id: params.pageId },
    });

    return NextResponse.json({ success: true, message: 'Sayfa başarıyla silindi' });

  } catch (error) {
    console.error("DELETE_PAGE_ERROR", error);
    return NextResponse.json({ success: false, message: 'Sayfa silinirken bir hata oluştu.' }, { status: 500 });
  }
}
