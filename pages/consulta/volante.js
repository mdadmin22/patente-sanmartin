import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Volante() {
  const [datosCodigo, setDatosCodigo] = useState(null);
  const [aliasMunicipio] = useState("MUNICIPIO.SANMARTIN.MP");
  const [datosCalculo, setDatosCalculo] = useState(null);
  const [pagoUrl, setPagoUrl] = useState(null);
  const [cargandoPago, setCargandoPago] = useState(false);

  useEffect(() => {
    const datos = JSON.parse(sessionStorage.getItem("datosCodigo"));
    const persona = JSON.parse(sessionStorage.getItem("datosPaso2"));

    if (datos && persona) {
      setDatosCodigo({
        ...persona,
        ...datos,
        datos_automotor: {
          ...(datos.datos_automotor || {}),
        },
      });
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
      razon_social,
      provincia,
      departamento,
      localidad,
      domicilio_calle,
      domicilio_nro,
      telefono,
      mail,
      mail_repetir,
      tipo_dominio,
      dominio,
      origen,
      anio,
      codigo_mtm,
      forma_pago,
      datos_automotor,
    } = datosCodigo;

    const baseFija = 5000;
    const alicuota = 0.0005;
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
    } else if (tipo_pago === "6meses") {
      descuento = 0.05 * totalPagar;
      totalPagar -= descuento;
    }

    setDatosCalculo({
      baseFija,
      baseVariable,
      cantidadMeses,
      subtotal1,
      subtotal2,
      descuento,
      totalPagar,
      mayorValor,
      alicuota,
    });

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
            razon_social: datos_automotor?.razon_social || "",
            provincia,
            departamento,
            localidad,
            domicilio_calle,
            domicilio_nro,
            telefono,
            mail,
            mail_repetir,
            tipo_dominio,
            dominio,
            origen,
            anio,
            foto_titulo_url: datos_automotor?.foto_titulo_url || null,
            cedula_frente_url: datos_automotor?.cedula_frente_url || null,
            cedula_dorso_url: datos_automotor?.cedula_dorso_url || null,
            codigo_mtm,
            valor_fiscal: Number(valor_fiscal || 0),
            valor_declarado: Number(valor_declarado || 0),
            forma_pago,
            tipo_pago: cantidadMeses,
            mayor_valor: mayorValor,
            base_fija: baseFija,
            meses: cantidadMeses,
            alicuota,
            base_variable: baseVariable,
            subtotal1,
            subtotal2,
            descuento,
            total: totalPagar,
          }),
        });
        console.log("✅ Datos guardados correctamente");
      } catch (err) {
        console.error("❌ Error al guardar inscripción:", err);
      }
    };

    guardarEnDB();
  }, [datosCodigo]);

  const generarPago = async () => {
    setCargandoPago(true);
    try {
      const res = await fetch("/api/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inscripcion_id: datosCodigo?.id || 0,
          nombre: `${datosCodigo.apellido} ${datosCodigo.nombre}`,
          monto: datosCalculo?.totalPagar || 0,
          dominio: datosCodigo.dominio,
        }),
      });
      const data = await res.json();
      console.log("🔗 init_point recibido:", data.init_point);
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("No se pudo generar el link de pago. Intente nuevamente.");
        setCargandoPago(false);
      }
    } catch (error) {
      console.error("❌ Error al generar preferencia:", error);
      alert("Error al generar el link de pago.");
      setCargandoPago(false);
    }
  };

  if (!datosCodigo || !datosCalculo) return <p className="text-center pt-20">Cargando...</p>;

  return (
    <div className="min-h-screen bg-white text-black pt-10 px-4">
      <div className="flex justify-center mb-4">
        <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
      </div>
      <h1 className="text-xl font-bold text-center mb-6">Paso 4: Volante de Pago</h1>
      <p className="text-center text-green-700 font-semibold mb-6">
        Los datos fueron guardados correctamente en la base de datos.
      </p>
      <div className="max-w-xl mx-auto bg-gray-100 p-4 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Datos del Contribuyente</h2>
        <p><strong>Nombre:</strong> {datosCodigo.apellido} {datosCodigo.nombre}</p>
        <p><strong>Documento:</strong> {datosCodigo.tipo_documento} {datosCodigo.dni_cuit}</p>
        <p><strong>Domicilio:</strong> {datosCodigo.domicilio_calle} {datosCodigo.domicilio_nro}, {datosCodigo.localidad}</p>
        <p><strong>Provincia:</strong> {datosCodigo.provincia}</p>
        <p><strong>Email:</strong> {datosCodigo.mail}</p>
      </div>
      <div className="max-w-xl mx-auto bg-gray-100 p-4 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Datos del Automotor</h2>
        <p><strong>Dominio:</strong> {datosCodigo.dominio} ({datosCodigo.tipo_dominio})</p>
        <p><strong>Origen:</strong> {datosCodigo.origen}</p>
        <p><strong>Año:</strong> {datosCodigo.anio}</p>
        <p><strong>Código MTM:</strong> {datosCodigo.codigo_mtm}</p>
        <p><strong>Valor Fiscal:</strong> ${Number(datosCodigo.valor_fiscal || 0).toLocaleString()}</p>
        <p><strong>Valor Declarado:</strong> ${Number(datosCodigo.valor_declarado || 0).toLocaleString()}</p>
      </div>
      <div className="max-w-xl mx-auto bg-gray-100 p-4 rounded-md shadow-md mb-8">
        <h2 className="text-lg font-bold mb-2">Detalle del Cálculo</h2>
        <p><strong>Alias para Pago:</strong> {aliasMunicipio}</p>
        <p><strong>Valor Tomado (Mayor entre Fiscal y Declarado):</strong> ${datosCalculo.mayorValor.toLocaleString()}</p>
        <p><strong>Alicuota:</strong> {(datosCalculo.alicuota * 100).toFixed(2)}%</p>
        <p><strong>Base Fija:</strong> ${datosCalculo.baseFija.toLocaleString()}</p>
        <p><strong>Base Variable ({datosCalculo.cantidadMeses} meses):</strong> ${datosCalculo.subtotal2.toLocaleString()}</p>
        {datosCalculo.descuento > 0 && (
          <p className="text-green-600 font-semibold">
            <strong>Descuento:</strong> -${datosCalculo.descuento.toLocaleString()}
          </p>
        )}
        <p className="text-lg font-bold mt-2">
          Total a Pagar: ${datosCalculo.totalPagar.toLocaleString()}
        </p>
        <div className="mt-6 text-center">
          {cargandoPago ? (
            <div className="flex flex-col items-center gap-2 text-blue-700 font-semibold">
              <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Redireccionando al pago seguro...
            </div>
          ) : (
            <button onClick={generarPago} className="bg-[#009ee3] text-white font-bold py-2 px-6 rounded-md shadow-md text-sm hover:shadow-xl hover:-translate-y-1">
              Pagar con MercadoPago
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-6 max-w-xl mx-auto">
        <Link href="/consulta/codigo" className="bg-gray-200 text-[#5b2b8c] font-bold py-2 px-4 rounded-md shadow-md text-sm hover:shadow-xl hover:-translate-y-1">
          ← Paso 3
        </Link>
        <button onClick={() => window.print()} className="bg-[#5b2b8c] text-white font-bold py-2 px-6 rounded-md shadow-md text-sm hover:shadow-xl hover:-translate-y-1">
          Imprimir Volante
        </button>
      </div>
    </div>
  );
}
