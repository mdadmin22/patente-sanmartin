// pages/consulta/codigo.js
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ConsultaCodigo() {
  const router = useRouter();
  const { origen, anio, tipo_documento, dni_cuit, nombre, apellido, localidad, domicilio_calle, domicilio_nro } = router.query;

  const [codigoMTM, setCodigoMTM] = useState("");
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const [valorDeclarado, setValorDeclarado] = useState("");
  const [tipoPago, setTipoPago] = useState("1");

  const handleConsulta = async () => {
    if (!codigoMTM) {
      setError("Ingrese el código MTM/FMM");
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

  const formatMoneda = (valor) =>
    Number(valor).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    });

  return (
    <div className="min-h-screen bg-[#5b2b8c] text-white pt-10 px-4">
      <div className="flex justify-center mb-4">
        <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
      </div>

      <h2 className="text-2xl text-center font-semibold mb-6">
        Municipio de Gral. José de San Martín
      </h2>

      <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl max-w-xl mx-auto">
        <h1 className="text-xl font-bold text-center mb-6">Paso 3: Ingrese Código del Automotor</h1>

        <div className="space-y-4 text-sm">
          {/* Info del titular */}
          <div className="text-white/80">
            <p><strong>Origen:</strong> {origen}</p>
            <p><strong>Año:</strong> {anio}</p>
            <p><strong>Nombre:</strong> {apellido} {nombre}</p>
            <p><strong>Documento:</strong> {tipo_documento} {dni_cuit}</p>
            <p><strong>Domicilio:</strong> {domicilio_calle} {domicilio_nro}, {localidad}</p>
          </div>

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

          <div className="flex justify-between items-center pt-4">
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

          {error && <p className="text-red-400 font-semibold pt-4">{error}</p>}

          {/* Resultado formateado */}
          {resultado && (
            <div className="bg-white/20 p-4 mt-6 rounded-md space-y-3">
              <p className="font-semibold text-md">
                Valor de tabla: {formatMoneda(resultado.valorFiscal)}
              </p>
              <p className="text-sm italic">{resultado.descripcion}</p>

              {/* Campos adicionales */}
              <div>
                <label className="block text-sm font-medium">Valor declarado (opcional):</label>
                <input
                  type="number"
                  value={valorDeclarado}
                  onChange={(e) => setValorDeclarado(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                  placeholder="Ej: 3100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Tipo de pago:</label>
                <select
                  value={tipoPago}
                  onChange={(e) => setTipoPago(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
                >
                  <option value="1">1 mes</option>
                  <option value="6">6 meses</option>
                  <option value="12">12 meses</option>
                </select>
              </div>

              {/* Botón siguiente paso */}
              <button
                onClick={() => {
                  const mayor = Math.max(
                    Number(valorDeclarado || 0),
                    Number(resultado.valorFiscal)
                  );
                  router.push(
                    `consulta/volante?mayor_valor=${mayor}&tipo_pago=${tipoPago}`
                  );
                }}
                className="w-full mt-4 bg-white text-[#5b2b8c] font-bold py-2 px-4 rounded-md shadow-md hover:shadow-xl hover:-translate-y-1"
              >
                Generar Volante →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
