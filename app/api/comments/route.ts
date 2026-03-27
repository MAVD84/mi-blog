import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectDB } from '@/lib/mongodb'
import { Comment } from '@/lib/models/Comment'
import { authOptions } from '@/lib/auth'

// GET /api/comments?postId=xxx
export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const postId = searchParams.get('postId')

  if (!postId) return NextResponse.json({ error: 'postId requerido' }, { status: 400 })

  const comments = await Comment.find({ post: postId, approved: true })
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(comments)
}

// POST /api/comments
export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()

  const comment = await Comment.create({
    post:    body.postId,
    author:  body.author,
    email:   body.email,
    content: body.content,
  })

  return NextResponse.json(comment, { status: 201 })
}

// PATCH /api/comments — aprobar/rechazar (admin)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await connectDB()
  const { id, approved } = await req.json()
  const comment = await Comment.findByIdAndUpdate(id, { approved }, { new: true })

  return NextResponse.json(comment)
}

// DELETE /api/comments
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await connectDB()
  const { searchParams } = new URL(req.url)
  await Comment.findByIdAndDelete(searchParams.get('id'))

  return NextResponse.json({ success: true })
}
