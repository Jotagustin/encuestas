let API_BASE = '/api'
try {
  // En Vite se expone en import.meta.env; usar try/catch para evitar crashes en entornos
  // donde import.meta no esté disponible (o en scripts no módulos).
  if (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) {
    API_BASE = import.meta.env.VITE_API_BASE
  }
} catch (e) {
  // fallback silencioso: dejamos '/api'
  // console.warn('No se pudo leer import.meta.env.VITE_API_BASE, usando /api')
}

export async function obtenerPreguntas() {
  const res = await fetch(`${API_BASE}/tickets/`)
  if (!res.ok) throw new Error('No se pudo obtener la lista de preguntas')
  return res.json()
}

export async function crearPregunta(datos) {
  const res = await fetch(`${API_BASE}/tickets/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`No se pudo crear la pregunta: ${res.status} ${text}`)
  }
  return res.json()
}

export async function actualizarPregunta(id, datos) {
  const res = await fetch(`${API_BASE}/tickets/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`No se pudo actualizar la pregunta: ${res.status} ${text}`)
  }
  return res.json()
}

export default {
  obtenerPreguntas,
  crearPregunta,
  actualizarPregunta,
}
