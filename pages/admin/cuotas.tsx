// pages/admin/cuotas.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminCuotas() {
  const router = useRouter();
  const { dominio: dominioQuery } = router.query;

  const [dominio, setDominio] = useState("");
  const [cuotas, setCuotas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const buscarCuotas = async (dom) => {
    if (!dom) return;
    setCargando(true);
    const res = await fetch(`/api/cuotas?dominio=${dom}`);
    const data = await res.json();
    setCuotas(data.cuotas || []);
    setCargando(false);
  };

  useEffect(() => {
    if (typeof dominioQuery === "string") {
      setDominio(dominioQuery);
      buscarCuotas(dominioQuery);
    }
  }, [dominioQuery]);

  const pagadas = cuotas.filter((c) => c.estado === "pagada");
  const pendientes = cuotas.filter((c) => c.estado !== "pagada");

  // ✅ MODIFICACIÓN: sumamos como número, no como texto
  const totalAdeudado = pendientes.reduce(
    (acc, c) => acc + (parseFloat(c.monto) || 0),
    0
  );
  const totalAbonado = pagadas.reduce(
    (acc, c) => acc + (parseFloat(c.monto) || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">🔍 Consulta de Cuotas por Dominio</h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Ej: AZ111ZB"
          value={dominio}
          onChange={(e) => setDominio(e.target.value.toUpperCase())}
          className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-md w-64"
        />
        <button
          onClick={() => buscarCuotas(dominio)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
        >
          Buscar
        </button>
      </div>

      {cuotas.length > 0 && (
        <div className="mb-4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <p>📌 Total de cuotas: <strong>{cuotas.length}</strong></p>
          <p>✅ Cuotas pagadas: <strong>{pagadas.length}</strong></p>
          <p>⌛ Cuotas pendientes: <strong>{pendientes.length}</strong></p>
          <p>💵 Total abonado: <strong>{totalAbonado.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</strong></p>
          <p>💰 Total adeudado: <strong>{totalAdeudado.toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</strong></p>
        </div>
      )}

      {cargando && <p className="text-yellow-400">Cargando cuotas...</p>}

      {cuotas.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
            <thead>
              <tr className="text-left border-b border-gray-700">
                <th className="py-2 px-4">#</th>
                <th className="py-2 px-4">Estado</th>
                <th className="py-2 px-4">Vencimiento</th>
                <th className="py-2 px-4">Pago</th>
                <th className="py-2 px-4">Importe</th>
                <th className="py-2 px-4">Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {cuotas.map((c, i) => (
                
                <tr
                  key={c.id}
                  className={`border-b border-gray-700 ${
                    c.estado === "pagada" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  <td className="py-2 px-4">{i + 1}</td>
                  <td className="py-2 px-4 capitalize">{c.estado}</td>
                  <td className="py-2 px-4">
                    {c.fecha_vencimiento?.substring(0, 10)}
                  </td>
                  <td className="py-2 px-4">
                    {c.fecha_pago ? c.fecha_pago.substring(0, 10) : "-"}
                  </td>
                  <td className="py-2 px-4">
                    {c.monto?.toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    }) ?? "-"}
                  </td>
                  <td className="py-2 px-4">
                    {c.payment_id_mercadopago || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {cuotas.length === 0 && !cargando && dominio && (
        <p className="text-red-400 mt-4">No se encontraron cuotas para ese dominio.</p>
      )}
    </div>
  );
}
