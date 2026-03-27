import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-ink-200 mt-24">
      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display text-lg text-ink-500">Blog.</span>
        <p className="font-body text-xs text-ink-400 tracking-wide">
          © {new Date().getFullYear()} — Todos los derechos reservados
        </p>
        <nav className="flex gap-6">
          <Link href="/" className="font-body text-xs text-ink-500 hover:text-ink-800 tracking-wide transition-colors">Inicio</Link>
          <Link href="/categories" className="font-body text-xs text-ink-500 hover:text-ink-800 tracking-wide transition-colors">Categorías</Link>
        </nav>
      </div>
    </footer>
  )
}
