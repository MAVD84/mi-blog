import Link from 'next/link'
import { IPost } from '@/lib/models/Post'
import { ICategory } from '@/lib/models/Category'

interface PopulatedPost extends Omit<IPost, 'author' | 'categories'> {
  author: { name: string; avatar?: string }
  categories: ICategory[]
}

export function PostCard({ post }: { post: PopulatedPost }) {
  return (
    <article className="group border-b border-ink-100 py-8 first:pt-0 last:border-b-0">
      <div className="flex flex-col gap-3">

        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {post.categories.map((cat) => (
              <Link key={cat._id} href={`/category/${cat.slug}`} className="tag">
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/post/${post.slug}`}>
          <h2 className="font-display text-2xl md:text-3xl text-ink-900 leading-snug
                         group-hover:text-accent transition-colors duration-200">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="font-body text-ink-600 text-base leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-ink-400 font-body tracking-wide mt-1">
          <span>{post.author?.name}</span>
          <span className="text-ink-200">·</span>
          <span>
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })
              : 'Borrador'}
          </span>
          {post.readingTime && (
            <>
              <span className="text-ink-200">·</span>
              <span>{post.readingTime} min de lectura</span>
            </>
          )}
        </div>
      </div>
    </article>
  )
}
