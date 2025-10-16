import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Updated schema to match frontend
const registerSchema = z.object({
  firstName: z.string().min(1, 'Ad alanı boş olamaz'),
  lastName: z.string().min(1, 'Soyad alanı boş olamaz'),
  email: z.string().email('Geçerli bir e-posta adresi girin'),
  password: z.string().min(6, 'Şifre en az 6 karakter olmalıdır'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      // This now correctly handles missing fields and other validation errors
      return NextResponse.json({ message: validation.error.issues[0].message }, { status: 400 });
    }

    // Destructure validated data
    const { firstName, lastName, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Bu e-posta adresi zaten kullanımda' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Combine firstName and lastName for the 'name' field in the database
    const name = `${firstName} ${lastName}`.trim();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
        message: "Hesabınız başarıyla oluşturuldu",
        user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error("REGISTER_ERROR", error);
    return NextResponse.json({ message: 'Beklenmedik bir hata oluştu.' }, { status: 500 });
  }
}
