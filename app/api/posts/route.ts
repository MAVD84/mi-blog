import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import slugify from 'slugify'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { authOptions } from '@/lib/auth'

// GET /api/posts — lista pública de posts publicados
export async function GET(req: NextRequest) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const page     = parseInt(searchParams.get('page') ?? '1')
  const limit    = parseInt(searchParams.get('limit') ?? '10')
  const category = searchParams.get('category')
  const all      = searchParams.get('all') // admin: ver todos

  const session = await getServerSession(authOptions)
  const isAdmin = session?.user && (session.user as { role: string }).role === 'admin'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = {}
  if (!all || !isAdmin) query.published = true
  if (category) query.categories = category

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate('author', 'name avatar')
      .populate('categories', 'name slug color')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(query),
  ])

  return NextResponse.json({ posts, total, page, totalPages: Math.ceil(total / limit) })
}

// POST /api/posts — crear post (solo autores/admin)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()

  const slug = slugify(body.title, { lower: true, strict: true })

  const post = await Post.create({
    ...body,
    slug,
    author: (session.user as { id: string }).id,
  })

  return NextResponse.json(post, { status: 201 })
}
