'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export function Header() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="border-b border-ink-200 bg-cream-50/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-display text-2xl text-ink-900 tracking-tight hover:text-accent transition-colors">
          Mi Blog
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-body text-sm text-ink-600 hover:text-ink-900 tracking-wide transition-colors">
            Inicio
          </Link>
          <Link href="/categories" className="font-body text-sm text-ink-600 hover:text-ink-900 tracking-wide transition-colors">
            Categorías
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="font-body text-sm text-ink-600 hover:text-ink-900 tracking-wide transition-colors">
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-ghost text-sm"
              >
                Salir
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-primary text-xs tracking-widest uppercase">
              Entrar
            </Link>
          )}
        </nav>

        {/* Hamburger mobile */}
        <button
          className="md:hidden text-ink-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-ink-100 bg-cream-50 px-6 py-4 flex flex-col gap-4">
          <Link href="/" className="font-body text-sm text-ink-700" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link href="/categories" className="font-body text-sm text-ink-700" onClick={() => setMenuOpen(false)}>Categorías</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="font-body text-sm text-ink-700" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="text-left font-body text-sm text-ink-700">Salir</button>
            </>
          ) : (
            <Link href="/login" className="font-body text-sm text-ink-700" onClick={() => setMenuOpen(false)}>Entrar</Link>
          )}
        </div>
      )}
    </header>
  )
}
