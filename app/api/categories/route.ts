import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import slugify from 'slugify'
import { connectDB } from '@/lib/mongodb'
import { Category } from '@/lib/models/Category'
import { authOptions } from '@/lib/auth'

export async function GET() {
  await connectDB()
  const categories = await Category.find().sort({ name: 1 }).lean()
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await connectDB()
  const body = await req.json()
  const slug = slugify(body.name, { lower: true, strict: true })

  const category = await Category.create({ ...body, slug })
  return NextResponse.json(category, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await connectDB()
  const { searchParams } = new URL(req.url)
  await Category.findByIdAndDelete(searchParams.get('id'))
  return NextResponse.json({ success: true })
}
