import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { Category } from '@/lib/models/Category'
import { User } from '@/lib/models/User'
import { Comment } from '@/lib/models/Comment'
import { CommentForm } from '@/components/blog/CommentForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props) {
  await connectDB()
  const post = await Post.findOne({ slug: params.slug, published: true }).lean() as any
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function PostPage({ params }: Props) {
  await connectDB()

  const post = await Post.findOne({ slug: params.slug, published: true })
    .populate('author', 'name avatar bio')
    .populate('categories', 'name slug color')
    .lean()

  if (!post) notFound()

  const p = post as any

  const comments = await Comment.find({ post: p._id, approved: true })
    .sort({ createdAt: -1 })
    .lean()

  return (
    <article className="animate-fade-up">
      {p.categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {p.categories.map((cat: any) => (
            <Link key={cat._id} href={`/category/${cat.slug}`} className="tag">{cat.name}</Link>
          ))}
        </div>
      )}

      <h1 className="font-display text-4xl md:text-5xl text-ink-900 leading-tight mb-4">
        {p.title}
      </h1>

      <div className="flex items-center gap-4 text-xs text-ink-400 font-body tracking-wide mb-8">
        <span>{p.author?.name}</span>
        <span className="text-ink-200">·</span>
        <span>
          {p.publishedAt && new Date(p.publishedAt).toLocaleDateString('es-ES', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </span>
        {p.readingTime && (
          <>
            <span className="text-ink-200">·</span>
            <span>{p.readingTime} min de lectura</span>
          </>
        )}
      </div>

      <div className="rule" />

      {p.coverImage && (
        <div className="mb-8 overflow-hidden">
          <img src={p.coverImage} alt={p.title} className="w-full object-cover max-h-96" />
        </div>
      )}

      <div
        className="prose prose-ink max-w-none font-body"
        dangerouslySetInnerHTML={{ __html: p.content }}
      />

      <div className="rule mt-12" />

      {p.author?.bio && (
        <div className="bg-cream-100 border border-ink-100 px-6 py-5 mb-8">
          <p className="font-body text-xs tracking-widest uppercase text-ink-400 mb-1">Autor</p>
          <p className="font-display text-lg text-ink-900 mb-2">{p.author.name}</p>
          <p className="font-body text-sm text-ink-600 leading-relaxed">{p.author.bio}</p>
        </div>
      )}

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink-900 mb-6">
          Comentarios <span className="text-ink-300 font-body text-lg">({comments.length})</span>
        </h2>

        {comments.length === 0 ? (
          <p className="font-body text-sm text-ink-400 mb-8">Sé el primero en comentar.</p>
        ) : (
          <div className="space-y-6 mb-10">
            {comments.map((c: any) => (
              <div key={c._id.toString()} className="border-l-2 border-ink-200 pl-5">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-body text-sm font-semibold text-ink-800">{c.author}</span>
                  <span className="text-xs text-ink-400">
                    {new Date(c.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="font-body text-sm text-ink-600 leading-relaxed">{c.content}</p>
              </div>
            ))}
          </div>
        )}

        <CommentForm postId={p._id.toString()} />
      </section>
    </article>
  )
}