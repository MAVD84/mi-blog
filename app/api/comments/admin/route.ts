import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { connectDB } from '@/lib/mongodb'
import { Comment } from '@/lib/models/Comment'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await connectDB()
  const comments = await Comment.find()
    .populate('post', 'title slug')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(comments)
}
