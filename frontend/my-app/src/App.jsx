import { useEffect, useState } from 'react'
import './App.css'
import { obtenerPreguntas, crearPregunta, actualizarPregunta } from './api'
import TicketForm from './TicketForm'
import TicketList from './TicketList'
import ResponsesPanel from './ResponsesPanel'

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

        <section className="col-12 col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="h5">Formulario</h2>
              <TicketForm onCrear={manejarCrearPregunta} />
            </div>
          </div>
        </section>

        <section className="col-12 col-lg-6">
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

          <div className="card">
            <div className="card-body">
              <h2 className="h6">Respuestas</h2>
              {seleccionada ? (
                <ResponsesPanel pregunta={seleccionada} onGuardar={guardarRespuesta} />
              ) : (
                <p className="text-muted">Selecciona una pregunta para ver/editar su respuesta</p>
              )}
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
