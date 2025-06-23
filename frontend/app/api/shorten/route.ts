import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateSlug } from '@/lib/generateslug'
import { isValidUrl } from '@/lib/validators'
import jwt from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  const JWT_SECRET = process.env.JWT_SECRET!;
  try {
    const { original } = await req.json()
    const token = req.headers.get('Authorization')?.split(' ')[1]; //Bearer token

    // Format: "Bearer <token>"

    if (!token) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});
    }
    const {user_id} = decoded as { user_id: string };
    console.log('Decoded user ID:', user_id);
    const user = await prisma.user.findUnique({
        where: { id: user_id },
    });

    if (!user) {
        return NextResponse.json({error: 'User not found'}, {status: 404});
    }
    // Validate the URL
    if (!isValidUrl(original)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    // Optional: Check if this URL has already been shortened
    const existing = await prisma.shortURL.findFirst({
      where: { original },
    })
    if (existing) {
      return NextResponse.json({ slug: existing.slug }, { status: 200 })
    }

    // Generate a unique slug
    let slug = generateSlug()
    let isUnique = false

    while (!isUnique) {
      const existingSlug = await prisma.shortURL.findUnique({
        where: { slug },
      })
      if (!existingSlug) {
        isUnique = true
      } else {
        slug = generateSlug()
      }
    }

    // Create the short URL entry
    await prisma.shortURL.create({
      data: {
        slug,
        original,
        user: {
          connect: { id: user_id },
        }
      },
    })

    return NextResponse.json({ slug }, { status: 201 })
  } catch (err) {
    console.error('POST /api/shorten error:', err)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
