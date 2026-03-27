import { connectDB } from '@/lib/mongodb'
import { Post } from '@/lib/models/Post'
import { PostCard } from '@/components/blog/PostCard'

export const revalidate = 60

export default async function HomePage() {
  await connectDB()

  const posts = await Post.find({ published: true })
    .populate('author', 'name avatar')
    .populate('categories', 'name slug color')
    .sort({ publishedAt: -1 })
    .limit(20)
    .lean()

  return (
    <div>
      {/* Hero */}
      <div className="mb-16 animate-fade-up">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-ink-400 mb-3">Bienvenido al blog</p>
        <h1 className="font-display text-5xl md:text-6xl text-ink-900 leading-none mb-4">
          Ideas, reflexiones<br />
          <span className="text-accent">&amp; aprendizajes.</span>
        </h1>
        <div className="rule-accent w-16" />
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-body text-ink-400 text-sm tracking-wide">Aún no hay publicaciones.</p>
        </div>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        posts.map((post: any) => <PostCard key={post._id.toString()} post={post} />)
      )}
    </div>
  )
}
