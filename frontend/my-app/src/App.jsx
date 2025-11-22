import { useEffect, useState } from 'react'
import './App.css'
import { obtenerPreguntas, crearPregunta, actualizarPregunta } from './api'
import TicketForm from './TicketForm'
import TicketList from './TicketList'
import ResponsesPanel from './ResponsesPanel'

function EditModal({ pregunta, onClose, onSave }) {
  const [form, setForm] = useState({ ...pregunta })
  const [guardando, setGuardando] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setGuardando(true)
    await onSave(form.id, form)
    setGuardando(false)
    onClose()
  }

  if (!pregunta) return null
  return (
    <div className="modal-editar-bg">
      <div className="modal-editar">
        <h3 className="mb-3">Editar registro</h3>
        <form onSubmit={handleSave}>
          <div className="mb-2">
            <label className="form-label">Nombre</label>
            <input name="usuario" className="form-control" value={form.usuario || ''} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label className="form-label">Empresa</label>
            <input name="empresa" className="form-control" value={form.empresa || ''} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label className="form-label">Categoría</label>
            <select name="categoria" className="form-select" value={form.categoria || ''} onChange={handleChange}>
              <option value="general">General</option>
              <option value="soporte">Soporte</option>
              <option value="facturacion">Facturación</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label">Pregunta</label>
            <textarea name="pregunta" className="form-control" value={form.pregunta || ''} onChange={handleChange} />
          </div>

          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-primary" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar'}</button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function App() {
  const [preguntas, setPreguntas] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [editando, setEditando] = useState(false)
  const [preguntaEditar, setPreguntaEditar] = useState(null)


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

  function seleccionarPregunta(pregunta, abrirModal = false) {
    setSeleccionada(pregunta)
    if (abrirModal) {
      setPreguntaEditar(pregunta)
      setEditando(true)
    }
  }

  async function manejarGuardarEdicion(id, datos) {
    try {
      const actualizada = await actualizarPregunta(id, datos)
      setPreguntas(preguntas.map(p => p.id === id ? actualizada : p))
      setSeleccionada(actualizada)
      setPreguntaEditar(null)
      setEditando(false)
      return { ok: true }
    } catch (err) {
      console.error('Error al guardar edición:', err)
      return { ok: false, error: err.message }
    }
  }

  return (
    <div className="app-container ">
      <div className="contenedor-centrado">
        <header className="text-center mb-4 pt-4">
          <h1 className="h2 mb-2">Centro de Preguntas</h1>
          <p className="text-muted">Envía una pregunta y la entidad podrá responderla</p>
        </header>

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


        <div className="row g-4">
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
                  <p className="text-muted">
                    Selecciona una pregunta para ver su respuesta
                    <br />
                    <span className="d-block mt-2">Si la pregunta está abierta, aquí podrás responderla.</span>
                  </p>
                )}
              </div>
            </div>
          </div>

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

        {editando && (
          <EditModal 
            pregunta={preguntaEditar} 
            onClose={() => { setEditando(false); setPreguntaEditar(null); }} 
            onSave={manejarGuardarEdicion} 
          />
        )}

        <footer className="text-center mt-4 mb-3">
        </footer>
      </div>
    </div>
  )
}

export default App

