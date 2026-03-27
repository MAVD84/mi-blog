'use client'
import { useEffect, useState } from 'react'

interface Comment {
  _id: string
  author: string
  email: string
  content: string
  approved: boolean
  createdAt: string
  post: string
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')

  const fetchComments = async () => {
    setLoading(true)
    const res = await fetch('/api/comments/admin')
    const data = await res.json()
    setComments(data)
    setLoading(false)
  }

  useEffect(() => { fetchComments() }, [])

  const handleApprove = async (id: string, approved: boolean) => {
    await fetch('/api/comments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, approved }),
    })
    setComments(prev => prev.map(c => c._id === id ? { ...c, approved } : c))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este comentario?')) return
    await fetch(`/api/comments?id=${id}`, { method: 'DELETE' })
    setComments(prev => prev.filter(c => c._id !== id))
  }

  const filtered = comments.filter(c => {
    if (filter === 'pending')  return !c.approved
    if (filter === 'approved') return c.approved
    return true
  })

  return (
    <div>
      <h1 className="font-display text-3xl text-ink-900 mb-6">Comentarios</h1>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`font-body text-xs tracking-widest uppercase px-4 py-2 border transition-colors
              ${filter === f
                ? 'bg-ink-900 text-cream-50 border-ink-900'
                : 'border-ink-200 text-ink-600 hover:border-ink-500'}`}
          >
            {f === 'pending' ? 'Pendientes' : f === 'approved' ? 'Aprobados' : 'Todos'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-body text-sm text-ink-400">Cargando...</p>
      ) : filtered.length === 0 ? (
        <div className="border border-dashed border-ink-200 py-12 text-center">
          <p className="font-body text-sm text-ink-400">No hay comentarios en esta sección.</p>
        </div>
      ) : (
        <div className="border border-ink-200 bg-white divide-y divide-ink-100">
          {filtered.map(comment => (
            <div key={comment._id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-body text-sm font-semibold text-ink-900">{comment.author}</span>
                    <span className="font-body text-xs text-ink-400">{comment.email}</span>
                    <span className="font-body text-xs text-ink-300">
                      {new Date(comment.createdAt).toLocaleDateString('es-ES')}
                    </span>
                    {!comment.approved && (
                      <span className="font-body text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5">
                        Pendiente
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-ink-600 leading-relaxed">{comment.content}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!comment.approved ? (
                    <button
                      onClick={() => handleApprove(comment._id, true)}
                      className="btn-primary text-xs"
                    >
                      Aprobar
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(comment._id, false)}
                      className="btn-secondary text-xs"
                    >
                      Desaprobar
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="btn-ghost text-xs text-accent"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
