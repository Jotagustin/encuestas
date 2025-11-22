import { useState } from 'react'

export default function TicketList({ preguntas = [], onSeleccionar }) {
  if (!preguntas.length) return <p>Aún no hay preguntas.</p>

  return (
    <ul className="list-group">
      {preguntas.map((t) => (
        <li key={t.id || t.codigo || Math.random()} className="list-group-item d-flex justify-content-between align-items-start">
          <div style={{ cursor: 'pointer' }} onClick={() => onSeleccionar && onSeleccionar(t)}>
            <div className="fw-bold">{t.pregunta}</div>
            <div className="small text-muted">{t.usuario}{t.empresa ? ` — ${t.empresa}` : ''}</div>
          </div>
          <div className="text-end">
            {t.respuesta ? <span className="badge bg-success">Respondida</span> : <span className="badge bg-secondary">Abierta</span>}
          </div>
        </li>
      ))}
    </ul>
  )
}
