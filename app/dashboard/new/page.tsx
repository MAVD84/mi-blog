import { connectDB } from '@/lib/mongodb'
import { Category } from '@/lib/models/Category'
import { PostEditor } from '@/components/admin/PostEditor'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function NewPostPage() {
  await connectDB()
  const categories = await Category.find().sort({ name: 1 }).lean()

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="font-body text-sm text-ink-400 hover:text-ink-700 transition-colors">
          ← Volver
        </Link>
        <h1 className="font-display text-3xl text-ink-900">Nuevo post</h1>
      </div>
      <PostEditor categories={categories.map((c: any) => ({
        _id: c._id.toString(), name: c.name, slug: c.slug
      }))} />
    </div>
  )
}