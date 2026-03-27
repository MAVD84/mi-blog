import { connectDB } from '@/lib/mongodb'
import { Category } from '@/lib/models/Category'
import { Post } from '@/lib/models/Post'
import Link from 'next/link'

export const revalidate = 60

export default async function CategoriesPage() {
  await connectDB()
  const categories = await Category.find().sort({ name: 1 }).lean() as any[]

  const counts = await Promise.all(
    categories.map(cat =>
      Post.countDocuments({ categories: cat._id, published: true })
    )
  )

  return (
    <div className="animate-fade-up">
      <p className="font-body text-xs tracking-[0.3em] uppercase text-ink-400 mb-3">Explorar</p>
      <h1 className="font-display text-4xl md:text-5xl text-ink-900 mb-12">Categorías</h1>

      {categories.length === 0 ? (
        <p className="font-body text-sm text-ink-400">No hay categorías aún.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat._id.toString()}
              href={`/category/${cat.slug}`}
              className="group border border-ink-200 px-6 py-5 hover:border-ink-500 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-display text-xl text-ink-900 group-hover:text-accent transition-colors">
                  {cat.name}
                </h2>
                <span className="font-body text-xs text-ink-400">{counts[i]} posts</span>
              </div>
              {cat.description && (
                <p className="font-body text-sm text-ink-500 leading-relaxed">{cat.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
