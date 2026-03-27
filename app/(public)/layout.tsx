import { Header } from '@/components/blog/Header'
import { Footer } from '@/components/blog/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  )
}
