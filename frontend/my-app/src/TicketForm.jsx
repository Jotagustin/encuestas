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
      <label>
        Nombre
        <input value={usuario} onChange={(e) => setUsuario(e.target.value)} required placeholder="Tu nombre" />
      </label>

      <label>
        Empresa (opcional)
        <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Nombre de la empresa" />
      </label>

      <label>
        Categoría
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="general">General</option>
          <option value="soporte">Soporte</option>
          <option value="facturacion">Facturación</option>
        </select>
      </label>

      <label>
        Pregunta
        <textarea value={pregunta} onChange={(e) => setPregunta(e.target.value)} required placeholder="Escribe tu pregunta aquí" />
      </label>

      <div>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Enviando…' : 'Enviar pregunta'}
        </button>
        {msg && <span className="msg">{msg}</span>}
      </div>
    </form>
  )
}
