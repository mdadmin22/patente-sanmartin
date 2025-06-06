// pages/consulta/codigo.js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Paso3Codigo() {
  const router = useRouter();

  const [codigoMTM, setCodigoMTM] = useState("");
  const [anio, setAnio] = useState("");
  const [valorFiscal, setValorFiscal] = useState("");
  const [valorDeclarado, setValorDeclarado] = useState("");
  const [formaPago, setFormaPago] = useState("MercadoPago");
  const [tipoPago, setTipoPago] = useState("1mes");
  const [descripcion, setDescripcion] = useState("");
  const [datosPaso2, setDatosPaso2] = useState(null);

  useEffect(() => {
  const paso2 = JSON.parse(sessionStorage.getItem("datosPaso2"));
  if (paso2) {
    setDatosPaso2(paso2);
    setAnio(paso2.anio); // ✅ Esta es la línea que faltaba
  }
}, []);

  const consultarValorFiscal = async () => {
    if (!codigoMTM || !anio) {
      alert("Por favor complete el código MTM/FMM y asegúrese de que el año esté disponible.");
      return;
    }

    try {
      const res = await fetch(`/api/valorFiscal?codigo_mtm=${codigoMTM}&anio=${anio}`);
      const data = await res.json();
      if (data && data.valorFiscal) {
        setValorFiscal(data.valorFiscal);
      } else {
        alert("No se encontró valor fiscal para el código ingresado.");
      }
    } catch (error) {
      console.error("Error al consultar valor fiscal:", error);
      alert("Error al consultar valor fiscal.");
    }
  };

  const handleSiguiente = () => {
    const mayor_valor = Math.max(
      Number(valorFiscal || 0),
      Number(valorDeclarado || 0)
    );

    const datosCodigo = {
      codigo_mtm: codigoMTM,
      anio,
      valor_fiscal: valorFiscal,
      valor_declarado: valorDeclarado,
      forma_pago: formaPago,
      tipo_pago: tipoPago,
      mayor_valor,
    };
    sessionStorage.setItem("datosCodigo", JSON.stringify(datosCodigo));
    router.push("/consulta/volante");
  };

  const handleVolver = () => {
    router.push("/consulta/origen");
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] text-black pt-10 px-4">
      <h1 className="text-2xl font-bold text-center mb-6">Paso 3: Código del Automotor</h1>

      <div className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-md shadow-md">
        {datosPaso2 && (
          <div className="bg-gray-100 p-4 rounded">
            <p><strong>Dominio:</strong> {datosPaso2.dominio}</p>
            <p><strong>Origen:</strong> {datosPaso2.origen}</p>
            <p><strong>Tipo de dominio:</strong> {datosPaso2.tipo_dominio}</p>
            <p><strong>Año:</strong> {anio}</p>
          </div>
        )}

        <div>
          <label>Código MTM/FMM:</label>
          <input
            type="text"
            value={codigoMTM}
            onChange={(e) => setCodigoMTM(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label>Año:</label>
          <input
            type="text"
            value={anio}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <button
          onClick={consultarValorFiscal}
          className="bg-blue-600 text-white py-2 px-4 rounded-md"
        >
          Consultar Valor Fiscal
        </button>

        <div>
          <label>Valor Fiscal:</label>
          <input
            type="text"
            value={valorFiscal}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>

        <div>
          <label>Valor Declarado por el Contribuyente:</label>
          <input
            type="number"
            value={valorDeclarado}
            onChange={(e) => setValorDeclarado(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label>Forma de Pago:</label>
          <select
            value={formaPago}
            onChange={(e) => setFormaPago(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="MercadoPago">MercadoPago</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Efectivo">Efectivo</option>
          </select>
        </div>

        <div>
          <label>Tipo de Pago:</label>
          <select
            value={tipoPago}
            onChange={(e) => setTipoPago(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="1mes">1 mes</option>
            <option value="6meses">6 meses</option>
            <option value="12meses">12 meses</option>
          </select>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={handleVolver}
            className="bg-gray-400 text-white py-2 px-4 rounded-md"
          >
            Volver
          </button>
          <button
            onClick={handleSiguiente}
            className="bg-[#5b2b8c] text-white py-2 px-4 rounded-md"
          >
            Generar Volante
          </button>
        </div>
      </div>
    </div>
  );
}
