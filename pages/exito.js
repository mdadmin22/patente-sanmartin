import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Exito() {
  const router = useRouter();
  const [inscripcion, setInscripcion] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const { external_reference } = router.query;

    if (!external_reference) return;

    const obtenerDatos = async () => {
      try {
        const res = await fetch(`/api/inscripcion?id=${external_reference}`);
        const data = await res.json();

        if (data && data.id) {
          setInscripcion(data);
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
    const mensaje = `✅ Alta de inscripción:\n\n• Dominio: ${inscripcion.dominio}\n• CUIT/DNI: ${inscripcion.dni_cuit}\n• Contribuyente: ${inscripcion.apellido} ${inscripcion.nombre}\n• Pago: $${Number(inscripcion.total).toLocaleString()}\n• Fecha: ${new Date(inscripcion.fecha_pago).toLocaleString()}\n\nID de pago: ${inscripcion.payment_id_mercadopago}`;
    const telefono = process.env.NEXT_PUBLIC_WHATSAPP_MUNICIPIO;
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  if (cargando) return <p className="text-center pt-20">Cargando comprobante...</p>;
  if (!inscripcion) return <p className="text-center pt-20 text-red-600">No se pudo cargar el comprobante.</p>;

  const subtotalCalculado = (parseFloat(inscripcion.base_fija || 0) + parseFloat(inscripcion.base_variable || 0)) - parseFloat(inscripcion.descuento || 0);

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
        <p><strong>Valor Fiscal:</strong> ${Number(inscripcion.valor_fiscal || 0).toLocaleString()}</p>
        <p><strong>Valor Declarado:</strong> ${Number(inscripcion.valor_declarado || 0).toLocaleString()}</p>

        <h2 className="text-lg font-semibold mt-6 mb-2">Detalle del Pago</h2>
        <p><strong>Forma de Pago:</strong> MercadoPago</p>
        <p><strong>Tipo de Pago:</strong> {inscripcion.tipo_pago} meses</p>
        <p><strong>Base Fija:</strong> ${Number(inscripcion.base_fija).toLocaleString()}</p>
        <p><strong>Base Variable:</strong> ${Number(inscripcion.base_variable).toLocaleString()}</p>
        <p><strong>Subtotal:</strong> ${subtotalCalculado.toLocaleString()}</p>
        {inscripcion.descuento > 0 && (
          <p className="text-green-700"><strong>Descuento aplicado:</strong> -${Number(inscripcion.descuento).toLocaleString()}</p>
        )}
        <p><strong>Fecha de Pago:</strong> {new Date(inscripcion.fecha_pago).toLocaleString()}</p>
        <p><strong>ID de Pago:</strong> {inscripcion.payment_id_mercadopago}</p>
        <p className="text-lg font-bold mt-2">Total Pagado: ${Number(inscripcion.total).toLocaleString()}</p>

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
