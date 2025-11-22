let API_BASE = '/api'
try {

  if (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) {
    API_BASE = import.meta.env.VITE_API_BASE
  }
} catch (e) {

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
    method: 'PUT',
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
