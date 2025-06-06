// pages/consulta/volante.js
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Volante() {
  const [datosCodigo, setDatosCodigo] = useState(null);
  const [aliasMunicipio] = useState("MUNICIPIO.SANMARTIN.MP");

  useEffect(() => {
    const datos = JSON.parse(sessionStorage.getItem("datosCodigo"));
    const persona = JSON.parse(sessionStorage.getItem("datosPaso2"));
    if (datos && persona) {
      setDatosCodigo({ ...datos, ...persona });
    }
  }, []);

  useEffect(() => {
    if (!datosCodigo) return;

    const {
      valor_fiscal,
      valor_declarado,
      tipo_pago,
      tipo_tramite,
      tipo_documento,
      dni_cuit,
      apellido,
      nombre,
      localidad,
      domicilio_calle,
      domicilio_nro,
      tipo_dominio,
      dominio,
      origen,
      anio,
      codigo_mtm,
    } = datosCodigo;

    const baseFija = 5000;
    const alicuota = 0.003;
    const mayorValor = Math.max(Number(valor_fiscal || 0), Number(valor_declarado || 0));
    const baseVariable = mayorValor * alicuota;
    const cantidadMeses = parseInt(tipo_pago.replace("mes", "").replace("es", ""));
    const subtotal1 = baseFija;
    const subtotal2 = baseVariable * cantidadMeses;
    let totalPagar = subtotal1 + subtotal2;

    let descuento = 0;
    if (tipo_pago === "12meses") {
      descuento = 0.1 * totalPagar;
      totalPagar -= descuento;
    }

    const guardarEnDB = async () => {
      try {
        await fetch("/api/guardar-inscripcion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo_tramite,
            tipo_documento,
            dni_cuit,
            apellido,
            nombre,
            localidad,
            domicilio_calle,
            domicilio_nro,
            tipo_dominio,
            dominio,
            origen,
            anio,
            codigo_mtm,
            valor_fiscal: Number(valor_fiscal || 0),
            valor_declarado: Number(valor_declarado || 0),
            mayor_valor: mayorValor,
            base_fija: baseFija,
            alicuota,
            base_variable: baseVariable,
            tipo_pago: cantidadMeses,
            subtotal1,
            subtotal2,
            descuento,
            total: totalPagar,
          }),
        });
      } catch (err) {
        console.error("❌ Error al guardar inscripción:", err);
      }
    };

    guardarEnDB();
  }, [datosCodigo]);

  if (!datosCodigo) return <p className="text-center pt-20">Cargando...</p>;

  const {
    valor_fiscal,
    valor_declarado,
    tipo_pago,
    apellido,
    nombre,
    localidad,
    domicilio_calle,
    domicilio_nro,
    origen,
    anio,
    codigo_mtm,
  } = datosCodigo;

  const baseFija = 5000;
  const alicuota = 0.003;
  const mayorValor = Math.max(Number(valor_fiscal || 0), Number(valor_declarado || 0));
  const baseVariable = mayorValor * alicuota;
  const cantidadMeses = parseInt(tipo_pago.replace("mes", "").replace("es", ""));
  const subtotal1 = baseFija;
  const subtotal2 = baseVariable * cantidadMeses;
  let totalPagar = subtotal1 + subtotal2;

  let descuento = 0;
  if (tipo_pago === "12meses") {
    descuento = 0.1 * totalPagar;
    totalPagar -= descuento;
  }

  return (
    <div className="min-h-screen bg-white text-black pt-10 px-4">
      <div className="flex justify-center mb-4">
        <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
      </div>

      <h1 className="text-xl font-bold text-center mb-6">Paso 4: Volante de Pago</h1>

      <div className="bg-gray-100 p-6 rounded-xl max-w-xl mx-auto text-sm space-y-3">
        <p><strong>Mayor Valor:</strong> ${mayorValor.toLocaleString("es-AR")}</p>
        <p><strong>Base Fija:</strong> ${baseFija.toLocaleString("es-AR")}</p>
        <p><strong>Alicuota:</strong> {(alicuota * 100).toFixed(2)}%</p>
        <p><strong>Base Variable:</strong> ${baseVariable.toLocaleString("es-AR")}</p>
        <p><strong>Subtotal 1 (Base Fija):</strong> ${subtotal1.toLocaleString("es-AR")}</p>
        <p><strong>Subtotal 2 (Base Variable x Meses):</strong> ${subtotal2.toLocaleString("es-AR")}</p>
        {descuento > 0 && (
          <p className="text-green-700 font-semibold">Descuento por pago anual: -${descuento.toLocaleString("es-AR")}</p>
        )}
        <p className="text-lg font-semibold"><strong>Total a Pagar:</strong> ${totalPagar.toLocaleString("es-AR")}</p>
        <div className="mt-4">
          <p><strong>Alias para Transferencia:</strong></p>
          <p className="text-[#5b2b8c] text-lg font-bold">{aliasMunicipio}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6 max-w-xl mx-auto">
        <Link
          href="/consulta/codigo"
          className="bg-gray-200 text-[#5b2b8c] font-bold py-2 px-4 rounded-md shadow-md text-sm hover:shadow-xl hover:-translate-y-1"
        >
          ← Paso 3
        </Link>
        <button
          onClick={() => window.print()}
          className="bg-[#5b2b8c] text-white font-bold py-2 px-6 rounded-md shadow-md text-sm hover:shadow-xl hover:-translate-y-1"
        >
          Imprimir Volante
        </button>
      </div>
    </div>
  );
}
