import { useState } from 'react'

export default function TicketForm({ onCrear }) {
  const [formulario, setFormulario] = useState({
    usuario: '',
    empresa: '',
    categoria: 'General',
    pregunta: ''
  })
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(e) {
    const { name, value } = e.target
    setFormulario({ ...formulario, [name]: value })
  }

  async function manejarEnvio(e) {
    e.preventDefault()
    
    if (!formulario.usuario || !formulario.pregunta) {
      alert('Por favor completa los campos requeridos')
      return
    }

    setEnviando(true)
    const resultado = await onCrear(formulario)
    setEnviando(false)

    if (resultado.ok) {
      setFormulario({
        usuario: '',
        empresa: '',
        categoria: 'General',
        pregunta: ''
      })
    } else {
      alert('Error al enviar la pregunta')
    }
  }

  return (
    <form onSubmit={manejarEnvio}>
      <div className="mb-3">
        <label className="form-label">Nombre <span className="text-danger">*</span></label>
        <input
          type="text"
          className="form-control"
          name="usuario"
          value={formulario.usuario}
          onChange={manejarCambio}
          placeholder="Tu nombre"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Empresa (opcional)</label>
        <input
          type="text"
          className="form-control"
          name="empresa"
          value={formulario.empresa}
          onChange={manejarCambio}
          placeholder="Nombre de la empresa"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Categoría</label>
        <select
          className="form-select"
          name="categoria"
          value={formulario.categoria}
          onChange={manejarCambio}
        >
          <option value="General">General</option>
          <option value="Soporte">Soporte</option>
          <option value="Ventas">Ventas</option>
          <option value="Técnico">Técnico</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Pregunta <span className="text-danger">*</span></label>
        <textarea
          className="form-control"
          name="pregunta"
          value={formulario.pregunta}
          onChange={manejarCambio}
          placeholder="Escribe tu pregunta aquí"
          rows="4"
          required
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary w-100"
        disabled={enviando}
      >
        {enviando ? 'Enviando...' : 'Enviar Pregunta'}
      </button>
    </form>
  )
}
