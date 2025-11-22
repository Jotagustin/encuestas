const API_BASE = import.meta.env.VITE_API_BASE || '/api'

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

export default {
  obtenerPreguntas,
  crearPregunta,
}
