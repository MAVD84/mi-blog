import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/posts/[id]
export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const post = await Post.findById(params.id)
    .populate('author', 'name avatar bio')
    .populate('categories', 'name slug color')
    .lean()

  if (!post) return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 })
  return NextResponse.json(post)
}

// PATCH /api/posts/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await connectDB()
  const body = await req.json()
  const post = await Post.findByIdAndUpdate(params.id, body, { new: true })

  if (!post) return NextResponse.json({ error: 'Post no encontrado' }, { status: 404 })
  return NextResponse.json(post)
}

// DELETE /api/posts/[id]
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await connectDB()
  await Post.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}
