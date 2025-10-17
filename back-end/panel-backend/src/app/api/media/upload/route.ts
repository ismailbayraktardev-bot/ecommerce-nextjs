
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Helper function to authorize user access to a site
 */
async function authorizeSiteAccess(userId: string, siteId: string) {
  const site = await prisma.site.findUnique({ where: { id: siteId } });
  if (!site) return { success: false, message: 'Site bulunamadı' };
  if (site.userId !== userId) return { success: false, message: 'Bu siteye erişim yetkiniz yok' };
  return { success: true };
}

/**
 * POST /api/media/upload - Upload a new media file for a site
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Oturum açmanız gerekiyor' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const siteId = formData.get('siteId') as string | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Dosya bulunamadı.' }, { status: 400 });
    }
    if (!siteId) {
      return NextResponse.json({ success: false, message: 'Site ID'si gerekli.' }, { status: 400 });
    }

    // Authorize user access to the site
    const authResult = await authorizeSiteAccess(session.user.id, siteId);
    if (!authResult.success) {
      return NextResponse.json({ success: false, message: authResult.message }, { status: 403 });
    }

    // Create a unique filename
    const originalName = file.name;
    const fileExtension = path.extname(originalName);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${path.basename(originalName, fileExtension)}-${uniqueSuffix}${fileExtension}`;

    // Define the path to save the file
    // Note: In a real production app, this should be a cloud storage service (S3, Cloudinary, etc.)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', siteId);
    const filePath = path.join(uploadDir, filename);
    const publicUrl = `/uploads/${siteId}/${filename}`;

    // Ensure the upload directory exists
    await require('fs').promises.mkdir(uploadDir, { recursive: true });

    // Read the file buffer and write it to the filesystem
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Create a record in the database
    const newMedia = await prisma.media.create({
      data: {
        filename,
        originalName,
        mimeType: file.type,
        size: file.size,
        url: publicUrl, // URL path to access the file
        siteId,
      },
    });

    return NextResponse.json({ success: true, message: 'Dosya başarıyla yüklendi', data: { media: newMedia } }, { status: 201 });

  } catch (error) {
    console.error("MEDIA_UPLOAD_ERROR", error);
    return NextResponse.json({ success: false, message: 'Dosya yüklenirken bir hata oluştu.' }, { status: 500 });
  }
}
