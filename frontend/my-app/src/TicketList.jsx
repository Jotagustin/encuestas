export default function TicketList({ preguntas = [] }) {
  if (!preguntas.length) return <p>Aún no hay preguntas.</p>

  return (
    <ul className="ticket-list">
      {preguntas.map((t) => (
        <li key={t.id || t.codigo || Math.random()} className="ticket-item">
          <strong>{t.pregunta}</strong>
          <div className="meta">
            <span>{t.usuario}</span>
            {t.empresa && <span> — {t.empresa}</span>}
            {t.categoria && <span> ({t.categoria})</span>}
          </div>
          {t.respuesta && <div className="respuesta">Respuesta: {t.respuesta}</div>}
        </li>
      ))}
    </ul>
  )
}
