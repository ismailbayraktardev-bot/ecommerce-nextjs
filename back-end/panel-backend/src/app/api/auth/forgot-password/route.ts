
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import crypto from 'crypto';

const prisma = new PrismaClient();

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Geçerli bir e-posta adresi girin' }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = forgotPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: validation.error.issues[0].message,
        error: {
          code: 'VALIDATION_ERROR',
          field: 'email',
        },
      }, { status: 400 });
    }

    const { email } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // We send a success response even if the user is not found to prevent email enumeration.
      // This is a security best practice.
      return NextResponse.json({
        success: true,
        message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi',
      }, { status: 200 });
    }

    // Generate a secure, random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set token expiration to 1 hour from now
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    // Store the hashed token in the database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires,
      },
    });

    // In a real application, you would send an email with the resetToken (the unhashed version)
    // For now, we will log it to the console as requested.
    console.log(`Password Reset Token for ${email}: ${resetToken}`);
    
    // TODO: Implement actual email sending here.
    // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    // await sendEmail({ to: email, subject: 'Password Reset', html: `Click <a href="${resetUrl}">here</a> to reset your password.` });

    return NextResponse.json({
      success: true,
      message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi',
    }, { status: 200 });

  } catch (error) {
    console.error('FORGOT_PASSWORD_ERROR', error);
    return NextResponse.json({
      success: false,
      message: 'Beklenmedik bir hata oluştu.',
      error: {
        code: 'INTERNAL_ERROR',
      },
    }, { status: 500 });
  }
}
