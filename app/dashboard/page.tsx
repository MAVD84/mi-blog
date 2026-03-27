import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  await connectDB()

  const posts = await Post.find()
    .populate('categories', 'name slug')
    .sort({ createdAt: -1 })
    .lean()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink-900">Posts</h1>
        <Link href="/dashboard/new" className="btn-primary text-xs tracking-widest uppercase">
          + Nuevo post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="border border-dashed border-ink-200 py-16 text-center">
          <p className="font-body text-sm text-ink-400 mb-4">No hay posts todavía.</p>
          <Link href="/dashboard/new" className="btn-secondary text-xs">Crear el primero</Link>
        </div>
      ) : (
        <div className="border border-ink-200 bg-white divide-y divide-ink-100">
          {posts.map((post: any) => (
            <div key={post._id.toString()} className="flex items-center justify-between px-5 py-4 hover:bg-cream-50 transition-colors">
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-body text-sm font-semibold text-ink-900 truncate">{post.title}</p>
                <p className="font-body text-xs text-ink-400 mt-0.5">
                  {post.published
                    ? `Publicado · ${new Date(post.publishedAt || post.createdAt).toLocaleDateString('es-ES')}`
                    : 'Borrador'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {post.published && (
                  <Link
                    href={`/post/${post.slug}`}
                    target="_blank"
                    className="btn-ghost text-xs"
                  >
                    Ver
                  </Link>
                )}
                <Link
                  href={`/dashboard/edit/${post._id.toString()}`}
                  className="btn-secondary text-xs"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
