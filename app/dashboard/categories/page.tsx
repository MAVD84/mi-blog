'use client'
import { useEffect, useState } from 'react'

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  color?: string
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [form, setForm]             = useState({ name: '', description: '', color: '#c0392b' })
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState('')

  const fetchCategories = async () => {
    const res  = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => { fetchCategories() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/categories', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      setCategories(prev => [...prev, created])
      setForm({ name: '', description: '', color: '#c0392b' })
    } catch {
      setError('Error al crear la categoría.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return
    await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
    setCategories(prev => prev.filter(c => c._id !== id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Lista */}
      <div className="lg:col-span-2">
        <h1 className="font-display text-3xl text-ink-900 mb-6">Categorías</h1>

        {loading ? (
          <p className="font-body text-sm text-ink-400">Cargando...</p>
        ) : categories.length === 0 ? (
          <div className="border border-dashed border-ink-200 py-12 text-center">
            <p className="font-body text-sm text-ink-400">No hay categorías. Crea la primera.</p>
          </div>
        ) : (
          <div className="border border-ink-200 bg-white divide-y divide-ink-100">
            {categories.map(cat => (
              <div key={cat._id} className="flex items-center justify-between px-5 py-4 hover:bg-cream-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color || '#c0392b' }}
                  />
                  <div>
                    <p className="font-body text-sm font-semibold text-ink-900">{cat.name}</p>
                    <p className="font-body text-xs text-ink-400">/{cat.slug}</p>
                    {cat.description && (
                      <p className="font-body text-xs text-ink-500 mt-0.5">{cat.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="btn-ghost text-xs text-accent"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Formulario nueva categoría */}
      <div>
        <div className="border border-ink-200 bg-white px-6 py-6">
          <h2 className="font-display text-xl text-ink-900 mb-5">Nueva categoría</h2>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label className="label">Nombre</label>
              <input
                className="input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Tecnología"
                required
              />
            </div>
            <div>
              <label className="label">Descripción (opcional)</label>
              <textarea
                className="input min-h-[80px] resize-none"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Descripción breve..."
              />
            </div>
            <div>
              <label className="label">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  className="w-10 h-10 border border-ink-200 cursor-pointer bg-white p-0.5"
                />
                <span className="font-mono text-sm text-ink-500">{form.color}</span>
              </div>
            </div>
            {error && <p className="font-body text-xs text-accent">{error}</p>}
            <button type="submit" disabled={saving} className="btn-primary w-full text-center text-xs mt-2">
              {saving ? 'Creando...' : 'Crear categoría'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
