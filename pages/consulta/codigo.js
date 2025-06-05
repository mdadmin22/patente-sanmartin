// pages/consulta/codigo.js
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ConsultaCodigo() {
  const router = useRouter();
  const { origen, anio } = router.query;
  const [codigoMTM, setCodigoMTM] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const handleConsulta = async () => {
    if (!codigoMTM) {
      setError("Ingrese el código MTM");
      return;
    }

    let codigoFinal = codigoMTM.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    if (origen === "Importado" || origen === "I") {
      const marca = codigoFinal.slice(0, 3);
      const tipo = codigoFinal.slice(3, 5);
      const modelo = codigoFinal.slice(5);
      codigoFinal = `${marca}${tipo}${modelo}`;
    }

    try {
      const res = await fetch(`/api/valorFiscal?codigo_mtm=${codigoFinal}&anio=${anio}`);
      if (!res.ok) throw new Error("Código no encontrado");
      const data = await res.json();
      setResultado(data);
      setError("");
    } catch (err) {
      setResultado(null);
      setError(err.message);
    }
  };

  // Función para formatear el valor fiscal
  const formatearMoneda = (valor) => {
    const numero = parseFloat(valor);
    return isNaN(numero) ? valor : numero.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  };

  return (
    <div className="min-h-screen bg-[#5b2b8c] text-white pt-10 px-4">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
      </div>

      {/* Encabezado */}
      <h2 className="text-2xl text-center font-semibold mb-6">
        Municipio de Gral. José de San Martín
      </h2>

      {/* Contenedor principal */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl max-w-xl mx-auto">
        <h1 className="text-xl font-bold text-center mb-6">Paso 3: Ingrese Código del Automotor</h1>

        <div className="space-y-4">
          {/* Origen y año de referencia */}
          <div className="flex justify-between gap-4 text-sm mb-2">
            <div className="w-1/2">
              <label className="block text-white/70">Origen:</label>
              <div className="px-3 py-2 rounded-md bg-white/20 text-white">{origen}</div>
            </div>

            <div className="w-1/2">
              <label className="block text-white/70">Año:</label>
              <div className="px-3 py-2 rounded-md bg-white/20 text-white">{anio}</div>
            </div>
          </div>

          {/* Input código */}
          <div>
            <label className="block text-sm font-medium">Código del automotor:</label>
            <input
              type="text"
              value={codigoMTM}
              onChange={(e) => setCodigoMTM(e.target.value)}
              placeholder={
                origen === "Importado" || origen === "I"
                  ? "Ej: MarcaTipoModelo (MTM)"
                  : "Ej: FabricaMarcaModelo (FMM)"
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-between items-center pt-6">
            <Link
              href="/consulta/origen"
              className="bg-white text-[#5b2b8c] font-bold py-2 px-4 rounded-md shadow-md text-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              ← Paso 2
            </Link>

            <button
              onClick={handleConsulta}
              className="bg-white text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md text-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              Consultar valor
            </button>
          </div>

          {/* Mensaje de error */}
          {error && <p className="text-red-400 font-semibold pt-4">{error}</p>}

          {/* Resultado formateado */}
          {resultado && (
            <div className="bg-white/20 p-4 mt-6 rounded-md">
              <h2 className="text-md font-bold mb-2">Valor de Tabla:</h2>
              <p className="text-sm mb-2"><strong>Descripción:</strong> {resultado.descripcion}</p>
              <p className="text-sm"><strong>Valor Fiscal:</strong> {formatearMoneda(resultado.valorFiscal)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
