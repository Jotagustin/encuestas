import { useState } from 'react';

const API_URL = "http://127.0.0.1:8000/api/tickets/";

export default function TicketList({ preguntas = [], onSeleccionar }) {

  const eliminar = async (id, e) => {
    e.stopPropagation(); 

    if (!confirm("¿Seguro que deseas eliminar esta respuesta?")) return;

    try {
      const res = await fetch(`${API_URL}${id}/`, { method: "DELETE" });
      
      if (!res.ok) throw new Error("Error al eliminar");
      
      window.location.reload();

    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  };

  if (!preguntas.length) return <p>Aún no hay preguntas.</p>;

  return (
    <ul className="list-group">
      {preguntas.map((t) => (
        <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
          
          <div style={{ cursor: 'pointer', flex: 1 }} onClick={() => onSeleccionar && onSeleccionar(t)}>
            <div className="fw-bold">{t.pregunta}</div>
            <div className="small text-muted">
                {t.usuario} {t.empresa ? `— ${t.empresa}` : ''}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            
            <div className="me-2">
              {t.respuesta ? 
                <span className="badge bg-success">Respondida</span> : 
                <span className="badge bg-secondary">Abierta</span>
              }
            </div>

            <button
                className="btn btn-sm btn-danger"
                onClick={(e) => eliminar(t.id, e)}
            >
                Eliminar
            </button>

          </div>
        </li>
      ))}
    </ul>
  );
}