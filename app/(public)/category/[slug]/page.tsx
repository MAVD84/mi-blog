import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Category } from '@/lib/models/Category'
import { Post } from '@/lib/models/Post'
import { PostCard } from '@/components/blog/PostCard'

export const dynamic = 'force-dynamic'

interface Props { params: { slug: string } }

export default async function CategoryPage({ params }: Props) {
  await connectDB()

  const category = await Category.findOne({ slug: params.slug }).lean()
  if (!category) notFound()

  const cat = category as any

  const posts = await Post.find({ categories: cat._id, published: true })
    .populate('author', 'name avatar')
    .populate('categories', 'name slug color')
    .sort({ publishedAt: -1 })
    .lean()

  return (
    <div className="animate-fade-up">
      <div className="mb-12">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-ink-400 mb-3">Categoría</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink-900 mb-2">{cat.name}</h1>
        {cat.description && (
          <p className="font-body text-ink-600 mt-2">{cat.description}</p>
        )}
        <p className="font-body text-xs text-ink-400 mt-3">{posts.length} publicaciones</p>
        <div className="rule-accent w-12 mt-4" />
      </div>

      {posts.length === 0 ? (
        <p className="font-body text-sm text-ink-400">No hay publicaciones en esta categoría.</p>
      ) : (
        posts.map((post: any) => <PostCard key={post._id.toString()} post={post} />)
      )}
    </div>
  )
}