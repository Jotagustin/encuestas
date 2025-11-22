import { useEffect, useState } from 'react'
import './App.css'
import { obtenerPreguntas, crearPregunta, actualizarPregunta } from './api'
import TicketForm from './TicketForm'
import TicketList from './TicketList'
import ResponsesPanel from './ResponsesPanel'

function App() {
  const [preguntas, setPreguntas] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Cargar preguntas al inicio
  useEffect(() => {
    cargarPreguntas()
  }, [])

  async function cargarPreguntas() {
    try {
      setCargando(true)
      const data = await obtenerPreguntas()
      setPreguntas(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      console.error('Error al cargar preguntas:', err)
      setError('No se pudieron cargar las preguntas')
    } finally {
      setCargando(false)
    }
  }

  async function manejarCrearPregunta(datos) {
    try {
      const nueva = await crearPregunta(datos)
      setPreguntas([nueva, ...preguntas])
      return { ok: true }
    } catch (err) {
      console.error('Error al crear pregunta:', err)
      return { ok: false, error: err.message }
    }
  }

  async function manejarGuardarRespuesta(id, datos) {
    try {
      const actualizada = await actualizarPregunta(id, datos)
      setPreguntas(preguntas.map(p => p.id === id ? actualizada : p))
      setSeleccionada(actualizada)
      return { ok: true }
    } catch (err) {
      console.error('Error al guardar respuesta:', err)
      return { ok: false, error: err.message }
    }
  }

  function seleccionarPregunta(pregunta) {
    setSeleccionada(pregunta)
  }

  return (
    <div className="app-container ">
      <div className="contenedor-centrado">
        <header className="text-center mb-4 pt-4">
          <h1 className="h2 mb-2">Centro de Preguntas</h1>
          <p className="text-muted">Envía una pregunta y la entidad podrá responderla</p>
        </header>

        {/* Formulario arriba centrado */}
        <div className="row justify-content-center mb-4">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h2 className="h5 mb-3">Nueva Pregunta</h2>
                <TicketForm onCrear={manejarCrearPregunta} />
              </div>
            </div>
          </div>
        </div>

        {/* Fila inferior: Respuestas (izquierda) y Preguntas (derecha) */}
        <div className="row g-4">
          {/* Columna IZQUIERDA: Respuestas */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5 mb-3">Respuesta</h2>
                {seleccionada ? (
                  <ResponsesPanel 
                    pregunta={seleccionada} 
                    onGuardar={manejarGuardarRespuesta} 
                  />
                ) : (
                  <p className="text-muted">Selecciona una pregunta para ver/editar su respuesta</p>
                )}
              </div>
            </div>
          </div>

          {/* Columna DERECHA: Preguntas Recientes */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5 mb-3">Preguntas Recientes</h2>
                {cargando ? (
                  <p className="text-muted">Cargando...</p>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <TicketList 
                    preguntas={preguntas} 
                    seleccionada={seleccionada}
                    onSeleccionar={seleccionarPregunta} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-4 mb-3">
          <small className="text-muted">Sistema de preguntas y respuestas</small>
        </footer>
      </div>
    </div>
  )
}

export default App
