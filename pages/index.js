import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [formData, setFormData] = useState({
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

  const cedulaFrenteRef = useRef(null);
  const cedulaDorsoRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const res = await fetch("/api/guardar", {
        method: "POST",
        body: formDataToSend,
      });

      if (res.ok) {
        alert("✅ Datos enviados y guardados correctamente");
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

  return (
    <>
      <div className="page-background">
        <div className="logo-municipio">
          <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
        </div>
        <h2 className="titulo-municipio">Municipio de Gral. José de San Martín</h2>

        <div className="formulario-container">
          <h1 className="titulo-form">Registro/ALTA de Patente Municipal</h1>
          <form onSubmit={handleSubmit}>
            <label>Tipo de documento:</label>
            <select name="tipo_documento" value={formData.tipo_documento} onChange={handleChange}>
              <option value="DNI">DNI</option>
              <option value="CUIT">CUIT</option>
              <option value="CÉDULA">CÉDULA</option>
            </select>

            <label>Número:</label>
            <input
              type="text"
              name="dni_cuit"
              value={formData.dni_cuit}
              onChange={handleChange}
              required
            />

            <label>Provincia:</label>
            <input type="text" value="Chaco" disabled />

            <label>Departamento:</label>
            <input type="text" value="Ldor. Gral. San Martín" disabled />

            <label>Localidad:</label>
            <select name="localidad" value={formData.localidad} onChange={handleChange} required>
              <option value="">Seleccione localidad</option>
              {localidades.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>

            <label>Domicilio:</label>
            <input
              type="text"
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
              required
            />

            <label>Dominio:</label>
            <input
              type="text"
              name="dominio"
              value={formData.dominio}
              onChange={handleChange}
              required
            />

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

            <button type="submit">Enviar</button>
          </form>
        </div>

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
            font-size: 18px;
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
            font-size: 24px;
            font-weight: bold;
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
