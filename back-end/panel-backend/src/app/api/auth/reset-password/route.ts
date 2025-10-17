
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Token boş olamaz' }),
  password: z.string().min(6, { message: 'Şifre en az 6 karakter olmalıdır' }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = resetPasswordSchema.safeParse(body);

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

    const { token, password } = validation.data;

    // Hash the token from the user to match the one in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find the token in the database
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token: hashedToken,
        expires: {
          gte: new Date(), // Check if the token has not expired
        },
      },
    });

    if (!verificationToken) {
      return NextResponse.json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş bağlantı',
        error: {
          code: 'INVALID_TOKEN',
        },
      }, { status: 400 });
    }

    // Find the user associated with the token
    const user = await prisma.user.findUnique({
      where: {
        email: verificationToken.identifier,
      },
    });

    if (!user) {
      // This should technically not happen if the token is valid
      return NextResponse.json({
        success: false,
        message: 'Kullanıcı bulunamadı.',
        error: {
          code: 'USER_NOT_FOUND',
        },
      }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the verification token so it cannot be used again
    await prisma.verificationToken.delete({
      where: {
        token: verificationToken.token,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Şifreniz başarıyla güncellendi',
    }, { status: 200 });

  } catch (error) {
    console.error('RESET_PASSWORD_ERROR', error);
    return NextResponse.json({
      success: false,
      message: 'Beklenmedik bir hata oluştu.',
      error: {
        code: 'INTERNAL_ERROR',
      },
    }, { status: 500 });
  }
}
