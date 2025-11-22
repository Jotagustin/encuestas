import { useEffect, useState } from 'react'
import './App.css'
import { obtenerPreguntas, crearPregunta } from './api'
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

  return (
    <div className="app-root">
      <header>
        <h1>Centro de preguntas</h1>
        <p>Envía una pregunta y la entidad podrá responderla.</p>
      </header>

      <main>
        <section className="left">
          <h2>Formulario</h2>
          <TicketForm onCrear={manejarCrearPregunta} />
        </section>

        <section className="right">
          <h2>Preguntas recientes</h2>
          {cargando && <p>Cargando preguntas…</p>}
          {error && <p className="error">{error}</p>}
          {!cargando && <TicketList preguntas={preguntas} />}
        </section>
      </main>

      <footer>
        <small>Sistema de preguntas y respuestas</small>
      </footer>
    </div>
  )
}

export default App
