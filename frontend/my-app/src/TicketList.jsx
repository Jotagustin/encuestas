export default function TicketList({ preguntas = [], seleccionada, onSeleccionar }) {
  if (!preguntas.length) {
    return <p className="text-muted">No hay preguntas aún</p>
  }

  return (
    <div className="lista-preguntas">
      {preguntas.map((pregunta) => (
        <div
          key={pregunta.id}
          className={`pregunta-item ${seleccionada?.id === pregunta.id ? 'seleccionada' : ''}`}
          onClick={() => onSeleccionar(pregunta)}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <div className="fw-bold mb-1">{pregunta.pregunta}</div>
              <div className="small text-muted">
                {pregunta.usuario}
                {pregunta.empresa && ` — ${pregunta.empresa}`}
                {pregunta.categoria && ` • ${pregunta.categoria}`}
              </div>
            </div>
            <div className="ms-2">
              {pregunta.respuesta ? (
                <span className="badge bg-success">Respondida</span>
              ) : (
                <span className="badge bg-warning text-dark">Pendiente</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
