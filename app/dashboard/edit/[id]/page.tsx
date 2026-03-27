import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { Category } from '@/lib/models/Category'
import { PostEditor } from '@/components/admin/PostEditor'
import Link from 'next/link'

interface Props { params: { id: string } }

export default async function EditPostPage({ params }: Props) {
  await connectDB()

  const [post, categories] = await Promise.all([
    Post.findById(params.id).lean(),
    Category.find().sort({ name: 1 }).lean(),
  ])

  if (!post) notFound()

  const p = post as any

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="font-body text-sm text-ink-400 hover:text-ink-700 transition-colors">
          ← Volver
        </Link>
        <h1 className="font-display text-3xl text-ink-900">Editar post</h1>
      </div>
      <PostEditor
        categories={categories.map((c: any) => ({
          _id: c._id.toString(), name: c.name, slug: c.slug
        }))}
        initialData={{
          _id:        p._id.toString(),
          title:      p.title,
          excerpt:    p.excerpt,
          content:    p.content,
          coverImage: p.coverImage ?? '',
          categories: p.categories.map((c: any) => c.toString()),
          published:  p.published,
        }}
      />
    </div>
  )
}
