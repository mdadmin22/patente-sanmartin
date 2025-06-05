// pages/alta.js
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router"; // 🧭 Para redirigir luego del envío

export default function Alta() {
  const router = useRouter();
  const { marca, modelo, tipo, valorFiscal, anio, origen } = router.query;

  const [formData, setFormData] = useState({
    tipo_documento: "DNI",
    dni_cuit: "",
    provincia: "Chaco",
    departamento: "Ldor. Gral. San Martín",
    localidad: "",
    domicilio: "",
    dominio: "",
    tipo_dominio: "Mercosur",
    telefono: "",
    mail: "",
    mail_repetir: "", // 🔧 nuevo campo
  });

  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    // 💡 Validar coincidencia de mails
    if (formData.mail !== formData.mail_repetir) {
      alert("❌ Los correos no coinciden");
      setEnviando(false);
      return;
    }

    // 💡 Validar teléfono (solo números y al menos 10 dígitos)
    const telefonoLimpio = formData.telefono.replace(/\D/g, "");
    if (telefonoLimpio.length < 10) {
      alert("❌ El teléfono debe tener al menos 10 dígitos");
      setEnviando(false);
      return;
    }

        const { mail_repetir, ...datosAEnviar } = formData;

    try {
      const res = await fetch("/api/guardar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosAEnviar),
      });


      if (res.ok) {
        router.push("/consulta/origen");
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
      <div className="flex justify-center mb-4">
        <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
      </div>

      <h2 className="text-2xl text-center font-semibold mb-6">
        Municipio de Gral. José de San Martín
      </h2>

      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl max-w-xl mx-auto">
        <h1 className="text-xl font-bold text-center mb-4">Paso 1: Alta de Patente Municipal</h1>

        {marca && (
          <div className="mb-4 p-4 bg-white/20 rounded-md">
            <h3 className="text-sm font-semibold mb-2">Datos del Automotor consultado:</h3>
            <p><strong>Marca:</strong> {marca}</p>
            <p><strong>Modelo:</strong> {modelo}</p>
            <p><strong>Tipo:</strong> {tipo || '—'}</p>
            <p><strong>Año:</strong> {anio}</p>
            <p><strong>Origen:</strong> {origen}</p>
            <p><strong>Valor fiscal:</strong> ${valorFiscal}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label>Tipo de documento:</label>
            <select name="tipo_documento" value={formData.tipo_documento} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm">
              <option value="DNI">DNI</option>
              <option value="CUIT">CUIT</option>
              <option value="CÉDULA">CÉDULA</option>
            </select>
          </div>

          <div>
            <label>Número:</label>
            <input type="text" name="dni_cuit" value={formData.dni_cuit} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm" />
          </div>

          <div>
            <label>Provincia:</label>
            <input type="text" value="Chaco" disabled className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-black text-sm" />
          </div>

          <div>
            <label>Departamento:</label>
            <input type="text" value="Ldor. Gral. San Martín" disabled className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-black text-sm" />
          </div>

          <div>
            <label>Localidad:</label>
            <select name="localidad" value={formData.localidad} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm">
              <option value="">Seleccione localidad</option>
              {localidades.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label>Domicilio:</label>
            <input type="text" name="domicilio" value={formData.domicilio} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm" />
          </div>

          <div>
            <label>Dominio:</label>
            <input type="text" name="dominio" value={formData.dominio} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm" />
          </div>

          <div>
            <label>Tipo de dominio:</label>
            <select name="tipo_dominio" value={formData.tipo_dominio} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm">
              <option value="Mercosur">Mercosur</option>
              <option value="Modelo Anterior">Modelo Anterior</option>
            </select>
          </div>

          <div>
            <label>Teléfono:</label>
            <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="Ej: 3624669140" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm" />
          </div>

          <div>
            <label>Email:</label>
            <input type="email" name="mail" value={formData.mail} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm" />
          </div>

          <div>
            <label>Repetir Email:</label>
            <input type="email" name="mail_repetir" value={formData.mail_repetir} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm" />
          </div>

          <div className="flex justify-between items-center pt-6">
            <Link href="/" className="bg-white text-[#5b2b8c] font-bold py-2 px-4 rounded-md shadow-md text-sm transition-all hover:shadow-xl hover:-translate-y-1">
              ← Volver
            </Link>

            <button type="submit" disabled={enviando} className={`${
              enviando ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl hover:-translate-y-1"
            } bg-white text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md text-sm transition-all`}>
              {enviando ? "Paso 3..." : "Siguiente paso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
