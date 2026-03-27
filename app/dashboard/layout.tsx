import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Top bar */}
      <header className="bg-ink-900 text-cream-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-xl text-cream-50 hover:text-cream-200 transition-colors">
            Mi Blog
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="font-body text-sm text-ink-200 hover:text-cream-50 tracking-wide transition-colors">
              Posts
            </Link>
            <Link href="/dashboard/comments" className="font-body text-sm text-ink-200 hover:text-cream-50 tracking-wide transition-colors">
              Comentarios
            </Link>
            <Link href="/dashboard/categories" className="font-body text-sm text-ink-200 hover:text-cream-50 tracking-wide transition-colors">
              Categorías
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-body text-xs text-ink-400 hidden md:block">{session.user?.name}</span>
          <Link href="/api/auth/signout" className="font-body text-xs text-ink-300 hover:text-cream-50 transition-colors tracking-wide">
            Salir
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {children}
      </main>
    </div>
  )
}
