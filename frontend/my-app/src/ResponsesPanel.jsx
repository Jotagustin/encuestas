import { useState, useEffect } from 'react'

export default function ResponsesPanel({ pregunta, onGuardar }) {
  const [texto, setTexto] = useState(pregunta.respuesta || '')
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    setTexto(pregunta.respuesta || '')
    setEditando(false)
  }, [pregunta])

  async function guardar() {
    if (!onGuardar) return
    setGuardando(true)
    try {
      await onGuardar(pregunta.id, { respuesta: texto, estado: 'respondido' })
      setEditando(false)
    } catch (e) {
      console.error(e)
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div>
      {pregunta.respuesta && !editando ? (
        <div>
          <div className="mb-2">{pregunta.respuesta}</div>
          <div>
            <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditando(true)}>Editar respuesta</button>
          </div>
        </div>
      ) : (
        <div>
          <textarea className="form-control mb-2" value={texto} onChange={(e) => setTexto(e.target.value)} style={{ minHeight: 120 }} />
          <div>
            <button className="btn btn-primary btn-sm" onClick={guardar} disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
            <button className="btn btn-secondary btn-sm ms-2" onClick={() => { setEditando(false); setTexto(pregunta.respuesta || '') }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}
