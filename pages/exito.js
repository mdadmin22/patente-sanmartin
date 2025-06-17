// pages/exito.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Exito() {
  const router = useRouter();
  const [inscripcion, setInscripcion] = useState(null);
  const [inscripcionId, setInscripcionId] = useState(null); // ✅ ID del trámite
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const { external_reference } = router.query;
    const referencia = external_reference || sessionStorage.getItem("external_reference");

    if (!external_reference && referencia) {
      sessionStorage.removeItem("external_reference");
    }

    if (!referencia) return;

    setInscripcionId(referencia); // ✅ Guardamos el ID para mostrar y enviar

    const obtenerDatos = async () => {
      try {
        const res = await fetch(`/api/inscripcion?id=${referencia}`);
        const data = await res.json();

        if (data && data.id) {
          setInscripcion(data);

          try {
            const resValor = await fetch(`/api/valorFiscal?codigo_mtm=${data.codigo_mtm}&anio=${data.anio}`);
            const datos = await resValor.json();
            if (datos && datos.datosAutomotor) {
              setInscripcion(prev => ({
                ...prev,
                desc_marca: datos.datosAutomotor.descMarca,
                desc_modelo: datos.datosAutomotor.descModelo,
                desc_tipo: datos.datosAutomotor.descTipo,
              }));
            }
          } catch (err) {
            console.error("❌ Error al obtener descripción del automotor:", err);
          }

        } else {
          console.warn("❌ No se encontró la inscripción");
        }
      } catch (error) {
        console.error("❌ Error al obtener inscripción:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [router.query]);

  const handleEnviarWhatsapp = () => {
    if (!inscripcion) return;
    const mensaje = `✅ Alta de inscripción:
    
• Dominio: ${inscripcion.dominio}
• CUIT/DNI: ${inscripcion.dni_cuit}
• Contribuyente: ${inscripcion.apellido} ${inscripcion.nombre}
• Pago: $${Number(inscripcion.total).toLocaleString()}
• Fecha: ${new Date(inscripcion.fecha_pago).toLocaleString()}

🆔 ID Trámite: ${inscripcionId}
💳 ID de pago: ${inscripcion.payment_id_mercadopago}`;

    const telefono = process.env.NEXT_PUBLIC_WHATSAPP_MUNICIPIO;
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  if (cargando) return <p className="text-center pt-20">Cargando comprobante...</p>;
  if (!inscripcion) return <p className="text-center pt-20 text-red-600">No se pudo cargar el comprobante.</p>;

  return (
    <div className="min-h-screen bg-white text-black pt-10 px-4">
      <div className="flex justify-center mb-4">
        <Image src="/logo-municipio.jpg" alt="Logo Municipio" width={150} height={100} />
      </div>
      <h1 className="text-xl font-bold text-center text-green-700 mb-6">✅ ¡Pago Exitoso!</h1>
      <p className="text-center mb-6">Comprobante de Alta de Inscripción Municipal</p>

      <div className="max-w-2xl mx-auto bg-gray-100 p-6 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-2">Datos del Contribuyente</h2>
        <p><strong>Nombre:</strong> {inscripcion.apellido} {inscripcion.nombre}</p>
        <p><strong>Documento:</strong> {inscripcion.tipo_documento} {inscripcion.dni_cuit}</p>
        <p><strong>Domicilio:</strong> {inscripcion.domicilio_calle} {inscripcion.domicilio_nro}, {inscripcion.localidad}</p>
        <p><strong>Provincia:</strong> {inscripcion.provincia}</p>
        <p><strong>Email:</strong> {inscripcion.mail}</p>

        <h2 className="text-lg font-semibold mt-6 mb-2">Datos del Automotor</h2>
        <p><strong>Dominio:</strong> {inscripcion.dominio} ({inscripcion.tipo_dominio})</p>
        <p><strong>Origen:</strong> {inscripcion.origen}</p>
        <p><strong>Año:</strong> {inscripcion.anio}</p>
        <p><strong>Código MTM:</strong> {inscripcion.codigo_mtm}</p>
        {inscripcion.desc_marca && (
          <>
            <p><strong>Marca:</strong> {inscripcion.desc_marca}</p>
            <p><strong>Modelo:</strong> {inscripcion.desc_modelo}</p>
            {inscripcion.desc_tipo && <p><strong>Tipo:</strong> {inscripcion.desc_tipo}</p>}
          </>
        )}

        <h2 className="text-lg font-semibold mt-6 mb-2">Detalle del Cálculo</h2>
        <p><strong>Alias para Pago:</strong> MUNICIPIO.SANMARTIN.MP</p>
        <p><strong>Valor Tomado:</strong> ${Number(inscripcion.mayor_valor || 0).toLocaleString()}</p>
        {inscripcion.descuento > 0 && (
          <p className="text-green-700"><strong>Descuento:</strong> -${Number(inscripcion.descuento).toLocaleString()}</p>
        )}
        <p className="text-lg font-bold mt-2"><strong>Total:</strong> ${Number(inscripcion.total).toLocaleString()}</p>

        <h2 className="text-lg font-semibold mt-6 mb-2">Datos del Pago</h2>
        <p><strong>Forma de Pago:</strong> MercadoPago</p>
        <p><strong>Fecha de Pago:</strong> {new Date(inscripcion.fecha_pago).toLocaleString()}</p>
        <p><strong>ID de Pago:</strong> {inscripcion.payment_id_mercadopago}</p>
        <p><strong>ID Trámite:</strong> {inscripcionId}</p>

        <div className="text-lg font-bold mt-4 text-center">
          Total Pagado: ${Number(inscripcion.total).toLocaleString()}
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => window.print()}
            className="bg-[#5b2b8c] text-white font-bold py-2 px-6 rounded-md shadow-md hover:-translate-y-1"
          >
            Imprimir Comprobante
          </button>
          <button
            onClick={handleEnviarWhatsapp}
            className="bg-green-600 text-white font-bold py-2 px-6 rounded-md shadow-md hover:-translate-y-1"
          >
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
