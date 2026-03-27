'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Category { _id: string; name: string; slug: string }

interface PostEditorProps {
  categories: Category[]
  initialData?: {
    _id?: string
    title?: string
    excerpt?: string
    content?: string
    coverImage?: string
    categories?: string[]
    published?: boolean
  }
}

export function PostEditor({ categories, initialData }: PostEditorProps) {
  const router = useRouter()
  const isEdit = !!initialData?._id

  const [form, setForm] = useState({
    title:       initialData?.title       ?? '',
    excerpt:     initialData?.excerpt     ?? '',
    content:     initialData?.content     ?? '',
    coverImage:  initialData?.coverImage  ?? '',
    categories:  initialData?.categories  ?? [] as string[],
    published:   initialData?.published   ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const toggleCategory = (id: string) => {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter(c => c !== id)
        : [...f.categories, id],
    }))
  }

  const handleSave = async (publish?: boolean) => {
    setSaving(true)
    setError('')
    try {
      const body = { ...form, published: publish ?? form.published }
      const res = await fetch(
        isEdit ? `/api/posts/${initialData!._id}` : '/api/posts',
        {
          method:  isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(body),
        }
      )
      if (!res.ok) throw new Error()
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Error al guardar. Intenta de nuevo.')
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este post? Esta acción no se puede deshacer.')) return
    await fetch(`/api/posts/${initialData!._id}`, { method: 'DELETE' })
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main */}
      <div className="lg:col-span-2 flex flex-col gap-5">
        <div>
          <label className="label">Título</label>
          <input
            className="input text-lg"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="El título del post..."
          />
        </div>

        <div>
          <label className="label">Extracto</label>
          <textarea
            className="input min-h-[80px] resize-none"
            value={form.excerpt}
            onChange={e => setForm({ ...form, excerpt: e.target.value })}
            placeholder="Resumen breve del post (máx. 300 caracteres)"
            maxLength={300}
          />
          <p className="text-xs text-ink-400 mt-1 font-body text-right">{form.excerpt.length}/300</p>
        </div>

        <div>
          <label className="label">Contenido (HTML)</label>
          <textarea
            className="input min-h-[400px] resize-y font-mono text-sm"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            placeholder="<p>Escribe tu contenido aquí...</p>"
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-5">
        {/* Acciones */}
        <div className="border border-ink-200 bg-white px-5 py-5">
          <h3 className="font-body text-xs tracking-widest uppercase text-ink-500 mb-4">Acciones</h3>
          <div className="flex flex-col gap-2">
            <button onClick={() => handleSave(false)} disabled={saving} className="btn-secondary w-full text-center text-xs">
              Guardar borrador
            </button>
            <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary w-full text-center text-xs">
              {form.published ? 'Actualizar' : 'Publicar'}
            </button>
            {isEdit && (
              <button onClick={handleDelete} disabled={saving} className="btn-ghost w-full text-center text-xs text-accent hover:text-accent">
                Eliminar post
              </button>
            )}
          </div>
          {error && <p className="text-xs text-accent mt-3 font-body">{error}</p>}
        </div>

        {/* Categories */}
        <div className="border border-ink-200 bg-white px-5 py-5">
          <h3 className="font-body text-xs tracking-widest uppercase text-ink-500 mb-4">Categorías</h3>
          {categories.length === 0 ? (
            <p className="font-body text-xs text-ink-400">No hay categorías. Créalas en el panel.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {categories.map(cat => (
                <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.categories.includes(cat._id)}
                    onChange={() => toggleCategory(cat._id)}
                    className="accent-accent"
                  />
                  <span className="font-body text-sm text-ink-700 group-hover:text-ink-900 transition-colors">
                    {cat.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Cover image */}
        <div className="border border-ink-200 bg-white px-5 py-5">
          <h3 className="font-body text-xs tracking-widest uppercase text-ink-500 mb-4">Imagen de portada</h3>
          <input
            className="input text-sm"
            value={form.coverImage}
            onChange={e => setForm({ ...form, coverImage: e.target.value })}
            placeholder="https://..."
          />
          {form.coverImage && (
            <img src={form.coverImage} alt="Cover preview" className="mt-3 w-full object-cover h-32" />
          )}
        </div>
      </div>
    </div>
  )
}
