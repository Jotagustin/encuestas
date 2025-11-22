import { useState, useEffect } from 'react'

export default function ResponsesPanel({ pregunta, onGuardar }) {
  const [respuesta, setRespuesta] = useState('')
  const [editando, setEditando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    setRespuesta(pregunta.respuesta || '')
    setEditando(!pregunta.respuesta)
  }, [pregunta])

  async function guardar() {
    if (!respuesta.trim()) {
      alert('La respuesta no puede estar vacía')
      return
    }

    setGuardando(true)
    const resultado = await onGuardar(pregunta.id, {
      respuesta: respuesta.trim(),
      estado: 'respondido'
    })
    setGuardando(false)

    if (resultado.ok) {
      setEditando(false)
    } else {
      alert('Error al guardar la respuesta')
    }
  }

  function cancelar() {
    setRespuesta(pregunta.respuesta || '')
    setEditando(false)
  }

  return (
    <div>

      <div className="mb-3 p-3 bg-light rounded">
        <div className="fw-bold mb-2">Pregunta:</div>
        <div className="mb-2">{pregunta.pregunta}</div>
        <div className="small text-muted">
          Por: {pregunta.usuario}
          {pregunta.empresa && ` (${pregunta.empresa})`}
        </div>
      </div>

      {!editando && pregunta.respuesta ? (

        <div>
          <div className="mb-3">
            <div className="fw-bold mb-2">Respuesta:</div>
            <div className="p-3 bg-light rounded">{pregunta.respuesta}</div>
          </div>
          <button 
            className="btn btn-outline-primary btn-sm" 
            onClick={() => setEditando(true)}
          >
            Modificar Respuesta
          </button>
        </div>
      ) : (

        <div>
          <label className="form-label fw-bold">Respuesta:</label>
          <textarea
            className="form-control mb-2"
            value={respuesta}
            onChange={(e) => setRespuesta(e.target.value)}
            placeholder="Escribe la respuesta aquí..."
            rows="5"
          />
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={guardar}
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : 'Guardar Respuesta'}
            </button>
            {pregunta.respuesta && (
              <button
                className="btn btn-secondary"
                onClick={cancelar}
                disabled={guardando}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
