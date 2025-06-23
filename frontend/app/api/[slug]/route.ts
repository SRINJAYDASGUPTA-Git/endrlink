import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/db'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl?.pathname.split('/').pop() || ''
  const data = await prisma.shortURL.findUnique({ where: { slug: slug } })
  if (!data) return NextResponse.redirect(new URL('/', req.url))

  await prisma.shortURL.update({ where: { slug: slug }, data: { clicks: { increment: 1 } } })
  return NextResponse.redirect(data.original)
}