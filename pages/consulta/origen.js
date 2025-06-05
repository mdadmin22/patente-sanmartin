// pages/consulta/origen.js
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function SeleccionOrigen() {
  const router = useRouter();
  const [origen, setOrigen] = useState("N");
  const [anio, setAnio] = useState("2024");

  const manejarSiguiente = () => {
    router.push(`/consulta/codigo?origen=${origen}&anio=${anio}`);
  };

  return (
    <div className="min-h-screen bg-[#5b2b8c] text-white pt-10 px-4">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
      </div>

      {/* Título principal */}
      <h2 className="text-2xl text-center font-semibold mb-6">
        Municipio de Gral. José de San Martín
      </h2>

      {/* Contenedor del paso */}
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl max-w-xl mx-auto">
        <h1 className="text-xl font-bold text-center mb-6">Paso 2: Seleccione Origen y Año</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Procedencia:</label>
            <select
              value={origen}
              onChange={(e) => setOrigen(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
            >
              <option value="N">Nacional</option>
              <option value="I">Importado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Año:</label>
            <input
              type="number"
              value={anio}
              onChange={(e) => setAnio(e.target.value)}
              min="2000"
              max="2025"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-between items-center pt-6">
            <Link
              href="/alta"
              className="bg-white text-[#5b2b8c] font-bold py-2 px-4 rounded-md shadow-md text-sm transition-all hover:shadow-xl hover:-translate-y-1"
            >
              ← Paso 2
            </Link>

            <button
              onClick={manejarSiguiente}
              className="bg-white text-[#5b2b8c] font-bold py-2 px-6 rounded-md shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              Siguiente paso →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
