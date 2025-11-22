import { useState } from 'react'

export default function TicketForm({ onCrear }) {
  const [usuario, setUsuario] = useState('')
  const [pregunta, setPregunta] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [categoria, setCategoria] = useState('general')
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setMsg(null)
    setSubmitting(true)
    const datos = { usuario, pregunta, empresa, categoria }
    try {
      const res = await onCrear(datos)
      if (res && res.ok) {
        setUsuario('')
        setPregunta('')
        setEmpresa('')
        setCategoria('general')
        setMsg('Enviado correctamente')
      } else {
        setMsg('No se pudo enviar la pregunta')
      }
    } catch (e) {
      console.error(e)
      setMsg('No se pudo enviar la pregunta')
    } finally {
      setSubmitting(false)
      setTimeout(() => setMsg(null), 2500)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="ticket-form">
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input className="form-control" value={usuario} onChange={(e) => setUsuario(e.target.value)} required placeholder="Tu nombre" />
      </div>

      <div className="mb-3">
        <label className="form-label">Empresa (opcional)</label>
        <input className="form-control" value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nombre de la empresa" />
      </div>

      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="general">General</option>
          <option value="soporte">Soporte</option>
          <option value="facturacion">Facturación</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Pregunta</label>
        <textarea className="form-control" value={pregunta} onChange={(e) => setPregunta(e.target.value)} required placeholder="Escribe tu pregunta aquí" />
      </div>

      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? 'Enviando…' : 'Enviar pregunta'}
        </button>
        {msg && <div className="text-success small">{msg}</div>}
      </div>
    </form>
  )
}
