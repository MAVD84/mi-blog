'use client'
import { useState } from 'react'

export function CommentForm({ postId }: { postId: string }) {
  const [form, setForm] = useState({ author: '', email: '', content: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, postId }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ author: '', email: '', content: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mt-10">
      <h3 className="font-display text-xl text-ink-900 mb-6">Dejar un comentario</h3>
      {status === 'success' ? (
        <div className="border border-ink-200 bg-cream-100 px-6 py-4">
          <p className="font-body text-sm text-ink-600">
            Tu comentario ha sido enviado y está pendiente de moderación. ¡Gracias!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre</label>
              <input
                className="input"
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
                required
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div>
            <label className="label">Comentario</label>
            <textarea
              className="input min-h-[120px] resize-y"
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              required
              placeholder="Escribe tu comentario..."
              maxLength={1000}
            />
          </div>
          {status === 'error' && (
            <p className="text-xs text-accent font-body">Hubo un error. Por favor intenta de nuevo.</p>
          )}
          <div>
            <button type="submit" disabled={status === 'loading'} className="btn-primary">
              {status === 'loading' ? 'Enviando...' : 'Enviar comentario'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
