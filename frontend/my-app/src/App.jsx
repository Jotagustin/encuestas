import { useEffect, useState } from 'react'
import './App.css'
import { obtenerPreguntas, crearPregunta, actualizarPregunta } from './api'
import TicketForm from './TicketForm'
import TicketList from './TicketList'

function App() {
  const [preguntas, setPreguntas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    setCargando(true)
    obtenerPreguntas()
      .then((data) => {
        if (!mounted) return
        setPreguntas(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        console.error(err)
        setError('No se pudo obtener tickets')
      })
      .finally(() => {
        if (mounted) setCargando(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  async function manejarCrearPregunta(payload) {
    try {
      const creada = await crearPregunta(payload)
      // Agregar al listado local (optimista)
      setPreguntas((s) => [creada, ...s])
      return { ok: true }
    } catch (e) {
      console.error(e)
      return { ok: false, error: e }
    }
  }

  async function manejarActualizarPregunta(id, datos) {
    try {
      const actualizada = await actualizarPregunta(id, datos)
      setPreguntas((s) => s.map((p) => (p.id === actualizada.id ? actualizada : p)))
      return { ok: true, data: actualizada }
    } catch (e) {
      console.error(e)
      return { ok: false, error: e }
    }
  }

  const [seleccionada, setSeleccionada] = useState(null)

  function seleccionarPregunta(pregunta) {
    setSeleccionada(pregunta)
  }
  
  // wrapper: actualiza la pregunta en la lista y actualiza la selección
  async function guardarRespuesta(id, datos) {
    const res = await manejarActualizarPregunta(id, datos)
    if (res && res.ok && res.data) {
      setSeleccionada(res.data)
    }
    return res
  }

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="h3">Centro de preguntas</h1>
        <p className="text-muted">Envía una pregunta y la entidad podrá responderla.</p>
      </header>

      <main className="row gx-4">
        {/* columna vacía opcional a la izquierda */}
        <div className="col-md-1" />

        {/* centro: formulario */}
        <section className="col-md-5">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Formulario</h2>
              <TicketForm onCrear={manejarCrearPregunta} />
            </div>
          </div>
        </section>

        {/* derecha: preguntas y respuestas */}
        <section className="col-md-6">
          <div className="row">
            <div className="col-md-8">
              <div className="card mb-3">
                <div className="card-body">
                  <h2 className="h6">Preguntas recientes</h2>
                  {cargando && <p>Cargando preguntas…</p>}
                  {error && <div className="alert alert-danger">{error}</div>}
                  {!cargando && (
                    <TicketList preguntas={preguntas} onSeleccionar={seleccionarPregunta} />
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-3">
                <div className="card-body">
                  <h2 className="h6">Respuestas</h2>
                  {/* panel de respuestas: si hay seleccionada, mostrar editor y contenido */}
                  {seleccionada ? (
                    <div>
                      <div className="mb-2">
                        <strong>{seleccionada.pregunta}</strong>
                        <div className="text-muted small">{seleccionada.usuario}{seleccionada.empresa ? ` — ${seleccionada.empresa}` : ''}</div>
                      </div>
                      <ResponsesPanel pregunta={seleccionada} onGuardar={guardarRespuesta} />
                    </div>
                  ) : (
                    <p className="text-muted">Selecciona una pregunta para ver/editar su respuesta</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-4 text-center text-muted">
        <small>Sistema de preguntas y respuestas</small>
      </footer>
    </div>
  )
}

export default App
