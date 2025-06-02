// Importamos hooks de React y el componente de imagen optimizada de Next.js
import { useState, useRef } from "react";
import Image from "next/image";

// Componente principal de la página
export default function Home() {
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    tipo_documento: "DNI",
    dni_cuit: "",
    provincia: "Chaco", // valor fijo
    departamento: "Ldor. Gral. San Martín", // valor fijo
    localidad: "",
    domicilio: "",
    dominio: "",
    tipo_dominio: "Mercosur", // puede ser "Mercosur" o "Modelo Anterior"
    cedula_frente: null, // archivo
    cedula_dorso: null,  // archivo
  });

  // Referencias a los campos de archivo para poder limpiarlos luego
  const cedulaFrenteRef = useRef(null);
  const cedulaDorsoRef = useRef(null);

  // Función que actualiza el estado al cambiar cualquier input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Si el campo tiene archivos, guardamos el archivo
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      // Si es un campo de texto o select, guardamos el valor
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del form

    const formDataToSend = new FormData();
    // Carga todos los valores del formulario (incluye los archivos)
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      // Enviamos los datos al endpoint /api/guardar
      const res = await fetch("/api/guardar", {
        method: "POST",
        body: formDataToSend,
      });

      // Si todo salió bien, limpiamos el formulario
      if (res.ok) {
        alert("✅ Datos enviados y guardados correctamente");

        // Reseteamos el formulario a valores iniciales
        setFormData({
          tipo_documento: "DNI",
          dni_cuit: "",
          provincia: "Chaco",
          departamento: "Ldor. Gral. San Martín",
          localidad: "",
          domicilio: "",
          dominio: "",
          tipo_dominio: "Mercosur",
          cedula_frente: null,
          cedula_dorso: null,
        });

        // Limpiamos los campos de archivo
        if (cedulaFrenteRef.current) cedulaFrenteRef.current.value = "";
        if (cedulaDorsoRef.current) cedulaDorsoRef.current.value = "";
      } else {
        alert("❌ Error al enviar datos");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error al enviar datos");
    }
  };

  // Lista de localidades disponibles
  const localidades = [
    "Gral. José de San Martín",
    "Pampa Almirón",
    "Pampa del Indio",
    "La Eduvigis",
    "Laguna Limpia",
    "Selvas del Río de Oro",
    "Ciervo Petiso",
    "Presidencia Roca",
    "El Sauzalito",
  ];

  // Renderizado del formulario
  return (
    <>
      <div className="page-background">
        {/* Logo del municipio */}
        <div className="logo-municipio">
          <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
        </div>

        <h2 className="titulo-municipio">Municipio de Gral. José de San Martín</h2>

        <div className="formulario-container">
          <h1 className="titulo-form">Registro/ALTA de Patente Municipal</h1>

          <form onSubmit={handleSubmit}>
            {/* Selección de tipo de documento */}
            <label>Tipo de documento:</label>
            <select name="tipo_documento" value={formData.tipo_documento} onChange={handleChange}>
              <option value="DNI">DNI</option>
              <option value="CUIT">CUIT</option>
              <option value="CÉDULA">CÉDULA</option>
            </select>

            {/* Campo numérico de documento */}
            <label>Número:</label>
            <input
              type="text"
              name="dni_cuit"
              value={formData.dni_cuit}
              onChange={handleChange}
              required
            />

            {/* Campos de provincia y departamento (no modificables) */}
            <label>Provincia:</label>
            <input type="text" value="Chaco" disabled />

            <label>Departamento:</label>
            <input type="text" value="Ldor. Gral. San Martín" disabled />

            {/* Selector de localidad */}
            <label>Localidad:</label>
            <select name="localidad" value={formData.localidad} onChange={handleChange} required>
              <option value="">Seleccione localidad</option>
              {localidades.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            {/* Campo de domicilio */}
            <label>Domicilio:</label>
            <input
              type="text"
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
              required
            />

            {/* Campo de patente */}
            <label>Dominio:</label>
            <input
              type="text"
              name="dominio"
              value={formData.dominio}
              onChange={handleChange}
              required
            />

            {/* Selección de tipo de patente */}
            <label>Tipo de dominio:</label>
            <select
              name="tipo_dominio"
              value={formData.tipo_dominio}
              onChange={handleChange}
              required
            >
              <option value="Mercosur">Mercosur</option>
              <option value="Modelo Anterior">Modelo Anterior</option>
            </select>

            {/* Subida de fotos del frente y dorso de la cédula */}
            <label>📷 Cédula del automotor (frente):</label>
            <input
              type="file"
              name="cedula_frente"
              accept="image/*"
              onChange={handleChange}
              required
              ref={cedulaFrenteRef}
            />

            <label>📷 Cédula del automotor (dorso):</label>
            <input
              type="file"
              name="cedula_dorso"
              accept="image/*"
              onChange={handleChange}
              required
              ref={cedulaDorsoRef}
            />

            {/* Botón de envío */}
            <button type="submit">Enviar</button>
          </form>
        </div>

        {/* Estilos embebidos */}
        <style jsx>{`
          .page-background {
            background-color: #5b2b8c;
            min-height: 100vh;
            padding-top: 40px;
            color: #fff;
          }

          .logo-municipio {
            display: flex;
            justify-content: center;
            margin-bottom: 10px;
          }

          .titulo-municipio {
            text-align: center;
            font-size: 24px;
            color: #fff;
            margin-bottom: 20px;
          }

          .formulario-container {
            background: rgba(255, 255, 255, 0.05);
            padding: 30px;
            border-radius: 10px;
            max-width: 600px;
            margin: auto;
          }

          .titulo-form {
            text-align: center;
            font-size: 20px;
            color: #fff;
            margin-bottom: 30px;
          }

          label {
            display: block;
            margin-top: 20px;
            font-weight: normal;
            color: #fff;
            font-size: 15px;
          }

          input,
          select {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border-radius: 5px;
            border: 1px solid #ccc;
            background-color: #fff;
            color: #000;
            font-size: 15px;
          }

          button {
            display: block;
            margin: 30px auto 0 auto;
            padding: 12px 20px;
            background-color: #fff;
            color: #5b2b8c;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
          }

          button:hover {
            background-color: #e6e6e6;
          }
        `}</style>
      </div>
    </>
  );
}
