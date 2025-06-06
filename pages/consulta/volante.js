// pages/volante.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Volante() {
  const router = useRouter();
  const {
    mayor_valor = 0,
    tipo_pago = 1, // mensual = 1, anual = 12
  } = router.query;

  const [baseFija] = useState(5000);
  const [alicuota] = useState(0.003);
  const [aliasMunicipio] = useState("MUNICIPIO.SANMARTIN.MP");

  const mayorValor = Number(mayor_valor);
  const tipoPago = Number(tipo_pago);

  const baseVariable = mayorValor * alicuota;
  const subtotal1 = baseFija;
  const subtotal2 = baseVariable * tipoPago;
  const totalPagar = subtotal1 + subtotal2;

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
        <p><strong>Subtotal 2 (Base Variable x Tipo Pago):</strong> ${subtotal2.toLocaleString("es-AR")}</p>
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
