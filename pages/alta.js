// pages/alta.js
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router"; // 🧭 Para redirigir luego del envío

export default function Alta() {
  const router = useRouter();
  const { marca, modelo, tipo, valorFiscal, anio, origen } = router.query;

  const [formData, setFormData] = useState({
    // 🟣 Paso 1: Datos del titular
    apellido: "",
    nombre: "",
    tipo_documento: "DNI",
    dni_cuit: "",
    provincia: "Chaco",
    departamento: "Ldor. Gral. San Martín",
    localidad: "",
    domicilio_calle: "",
    domicilio_nro: "",
    telefono: "",
    mail: "",
    mail_repetir: "",
  });

  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    if (formData.mail !== formData.mail_repetir) {
      alert("❌ Los correos no coinciden");
      setEnviando(false);
      return;
    }

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
        <h1 className="text-xl font-bold text-center mb-4">Paso 1: Datos del Titular</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <fieldset className="border-t border-white/20 pt-4">
            <legend className="text-white font-semibold mb-2">Datos del Titular</legend>

            <div>
              <label>Apellido:</label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm" />
            </div>

            <div>
              <label>Nombre:</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm" />
            </div>

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
              <label>Calle:</label>
              <input type="text" name="domicilio_calle" value={formData.domicilio_calle} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm" />
            </div>

            <div>
              <label>Número:</label>
              <input type="text" name="domicilio_nro" value={formData.domicilio_nro} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black text-sm" />
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
          </fieldset>

          <div className="flex justify-between items-center pt-6">
            <Link href="/" className="bg-white text-[#5b2b8c] font-bold py-2 px-4 rounded-md shadow-md text-sm transition-all hover:shadow-xl hover:-translate-y-1">
              ← Volver
            </Link>

            <button type="submit" disabled={enviando} className={`$
              {enviando ? "opacity-50 cursor-not-allowed" : "hover:shadow-xl hover:-translate-y-1"}
              bg-white text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md text-sm transition-all`}>
              {enviando ? "Paso 2..." : "Siguiente paso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
