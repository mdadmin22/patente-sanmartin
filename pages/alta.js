import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Alta() {
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

  const [enviando, setEnviando] = useState(false);

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
    setEnviando(true);

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
    } finally {
      setEnviando(false);
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
    <div className="min-h-screen bg-[#5b2b8c] text-white pt-10 px-4">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
      </div>

      {/* Título */}
      <h2 className="text-2xl text-center font-semibold mb-6">
        Municipio de Gral. José de San Martín
      </h2>

      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl max-w-xl mx-auto">
        <h1 className="text-xl font-bold text-center mb-4">Registro / ALTA de Patente Municipal</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label>Tipo de documento:</label>
            <select
              name="tipo_documento"
              value={formData.tipo_documento}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm"
            >
              <option value="DNI">DNI</option>
              <option value="CUIT">CUIT</option>
              <option value="CÉDULA">CÉDULA</option>
            </select>
          </div>

          <div>
            <label>Número:</label>
            <input
              type="text"
              name="dni_cuit"
              value={formData.dni_cuit}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm"
            />
          </div>

          <div>
            <label>Provincia:</label>
            <input
              type="text"
              value="Chaco"
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-black text-sm"
            />
          </div>

          <div>
            <label>Departamento:</label>
            <input
              type="text"
              value="Ldor. Gral. San Martín"
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-black text-sm"
            />
          </div>

          <div>
            <label>Localidad:</label>
            <select
              name="localidad"
              value={formData.localidad}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm"
            >
              <option value="">Seleccione localidad</option>
              {localidades.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Domicilio:</label>
            <input
              type="text"
              name="domicilio"
              value={formData.domicilio}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm"
            />
          </div>

          <div>
            <label>Dominio:</label>
            <input
              type="text"
              name="dominio"
              value={formData.dominio}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm"
            />
          </div>

          <div>
            <label>Tipo de dominio:</label>
            <select
              name="tipo_dominio"
              value={formData.tipo_dominio}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm"
            >
              <option value="Mercosur">Mercosur</option>
              <option value="Modelo Anterior">Modelo Anterior</option>
            </select>
          </div>

          <div>
            <label>📷 Cédula del automotor (frente):</label>
            <input
              type="file"
              name="cedula_frente"
              accept="image/*"
              onChange={handleChange}
              required
              ref={cedulaFrenteRef}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm"
            />
          </div>

          <div>
            <label>📷 Cédula del automotor (dorso):</label>
            <input
              type="file"
              name="cedula_dorso"
              accept="image/*"
              onChange={handleChange}
              required
              ref={cedulaDorsoRef}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm"
            />
          </div>

          {/* Botones con efectos visuales y estado "enviando" */}
          <div className="flex justify-between items-center pt-6">
            <Link
              href="/"
              className="bg-white text-[#5b2b8c] font-bold py-2 px-4 rounded-md shadow-md text-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              ← Volver
            </Link>

            <button
              type="submit"
              disabled={enviando}
              className={`${
                enviando ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl hover:-translate-y-1"
              } bg-white text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md text-sm transition-all`}
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
