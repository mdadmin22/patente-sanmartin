import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function Paso3Codigo() {
  const router = useRouter();

  const [fabrica, setFabrica] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");

  const [marcaImp, setMarcaImp] = useState("");
  const [modeloImp, setModeloImp] = useState("");
  const [tipoImp, setTipoImp] = useState("");

  const [codigoMTM, setCodigoMTM] = useState("");
  const [anio, setAnio] = useState("");
  const [valorFiscal, setValorFiscal] = useState("");
  const [valorDeclarado, setValorDeclarado] = useState("");
  const [formaPago, setFormaPago] = useState("MercadoPago");
  const [tipoPago, setTipoPago] = useState("1mes");
  const [descripcion, setDescripcion] = useState("");
  const [datosPaso2, setDatosPaso2] = useState(null);
  const [datosAutomotor, setDatosAutomotor] = useState(null);

  useEffect(() => {
    const paso2 = JSON.parse(sessionStorage.getItem("datosPaso2"));
    if (paso2) {
      setDatosPaso2(paso2);
      setAnio(paso2.anio);
    }
  }, []);

  const consultarValorFiscal = async () => {
    let codigoMTMFinal = "";

    if (datosPaso2?.origen === "N") {
      codigoMTMFinal = `${fabrica}${marca}${modelo}`.toUpperCase();
      if (codigoMTMFinal.length < 7) {
        alert("El código nacional debe tener 7 caracteres.");
        return;
      }
    } else {
      // ✅ CORRECCIÓN: Marca (3) + Tipo (2) + Modelo (3)
      if (
        marcaImp.length !== 3 ||
        tipoImp.length !== 2 ||
        modeloImp.length !== 3
      ) {
        alert("El código importado debe tener formato Marca (3) + Tipo (2) + Modelo (3)");
        return;
      }

      codigoMTMFinal = `${marcaImp}${tipoImp}${modeloImp}`;
    }

    setCodigoMTM(codigoMTMFinal);

    try {
      const res = await fetch(`/api/valorFiscal?codigo_mtm=${codigoMTMFinal}&anio=${anio}`);
      const data = await res.json();

      if (data && data.valorFiscal) {
        setValorFiscal(data.valorFiscal);

        const automotorFinal = {
          dominio: datosPaso2?.dominio || "",
          tipo_dominio: datosPaso2?.tipo_dominio || "",
          origen: datosPaso2?.origen || "",
          anio: datosPaso2?.anio || anio,
          codigo_mtm: data.datosAutomotor.codigoMTM || codigoMTMFinal,
          valor_fiscal: data.valorFiscal,
          desc_marca: data.datosAutomotor.descMarca || "",
          desc_modelo: data.datosAutomotor.descModelo || "",
          desc_tipo: data.datosAutomotor.descTipo || "",
        };

        setDatosAutomotor(automotorFinal);
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
      datos_automotor: datosAutomotor,
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

        {datosPaso2?.origen === "N" ? (
          <>
            <label>Código Automotor Nacional:</label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={3}
                placeholder="Fábrica (3)"
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
                value={fabrica}
                onChange={(e) => setFabrica(e.target.value.toUpperCase())}
              />
              <input
                type="text"
                maxLength={2}
                placeholder="Marca (2)"
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
                value={marca}
                onChange={(e) => setMarca(e.target.value.toUpperCase())}
              />
              <input
                type="text"
                maxLength={2}
                placeholder="Modelo (2)"
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
                value={modelo}
                onChange={(e) => setModelo(e.target.value.toUpperCase())}
              />
            </div>
          </>
        ) : (
          <>
            <label>Código Automotor Importado:</label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={3}
                placeholder="Marca (3)"
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
                value={marcaImp}
                onChange={(e) => setMarcaImp(e.target.value)}
              />
              <input
                type="text"
                maxLength={3}
                placeholder="Modelo (3)"
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
                value={modeloImp}
                onChange={(e) => setModeloImp(e.target.value)}
              />
              <input
                type="text"
                maxLength={2}
                placeholder="Tipo (2)"
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
                value={tipoImp}
                onChange={(e) => setTipoImp(e.target.value)}
              />
            </div>
          </>
        )}

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
