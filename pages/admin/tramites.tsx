//pages/admin/tramites.tsx
// Importaciones extra necesarias
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Tramite {
  id: number;
  tipo_tramite: string;
  dominio: string;
  estado_tramite: string;
  estado_pago_contribuyente: string;
  nombre: string;
  apellido: string;
  creado_en: string;
  creado_por: string;
  payment_id_mercadopago: string;
  descuento: number;
  total: number;
  mail: string;
  telefono: string;
  domicilio_calle: string;
  domicilio_nro: string;
}

interface TramitesResponse {
  success: boolean;
  tramites: Tramite[];
}

export default function Tramites() {
  const [autorizado, setAutorizado] = useState(false);
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [filtroTexto, setFiltroTexto] = useState(""); // ✅ Buscador general
  const [filtroEstado, setFiltroEstado] = useState(""); // ✅ Filtro estado trámite
  const [filtroPago, setFiltroPago] = useState(""); // ✅ Filtro estado pago
  const [filtroTipo, setFiltroTipo] = useState(""); // ✅ Filtro tipo trámite
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload || payload.rol !== 'admin') {
      router.push('/admin/login');
      return;
    }

    setAutorizado(true);

    const obtenerTramites = async () => {
      try {
        const res = await axios.get<TramitesResponse>('/api/tramites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setTramites(res.data.tramites);
        }
      } catch (error) {
        console.error('Error al obtener trámites:', error);
      }
    };

    obtenerTramites();
  }, [router]);

  const actualizarEstadoTramite = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.post<{ success: boolean }>('/api/actualizar-tramite', {
        id,
        nuevoEstado,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setTramites((prev) =>
          prev.map((t) => t.id === id ? { ...t, estado_tramite: nuevoEstado } : t)
        );
      }
    } catch (error) {
      console.error('Error al actualizar el trámite:', error);
    }
  };

  // ✅ Lógica para filtrar los trámites mostrados
  const tramitesFiltrados = tramites.filter(t => {
    const texto = `${t.id} ${t.tipo_tramite} ${t.nombre} ${t.apellido} ${t.mail} ${t.telefono} ${t.dominio}`.toLowerCase();
    const coincideTexto = texto.includes(filtroTexto.toLowerCase());
    const coincideEstado = filtroEstado ? t.estado_tramite === filtroEstado : true;
    const coincidePago = filtroPago ? t.estado_pago_contribuyente === filtroPago : true;
    const coincideTipo = filtroTipo ? t.tipo_tramite === filtroTipo : true;
    return coincideTexto && coincideEstado && coincidePago && coincideTipo;
  });

  if (!autorizado) return <p>Verificando acceso...</p>;

  return (
    <div className="min-h-screen bg-white text-black pt-10 px-6">
      <h1 className="text-2xl font-bold mb-4">Listado de Trámites</h1>

      {/* ✅ Filtros y búsqueda */}
      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <input
          type="text"
          placeholder="Buscar por nombre, dominio, mail..."
          value={filtroTexto}
          onChange={e => setFiltroTexto(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Estado Trámite</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
        <select
          value={filtroPago}
          onChange={e => setFiltroPago(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Estado Pago</option>
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
        </select>
        <select
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tipo Trámite</option>
          <option value="ALTA">ALTA</option>
          <option value="TRANSFERENCIA">TRANSFERENCIA</option>
          <option value="BAJA">BAJA</option>
        </select>
      </div>

      {/* ✅ Tabla filtrada */}
      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Acciones</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Estado Trámite</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Mail</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Domicilio</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Creado por</th>
            <th className="border p-2">Dominio</th>
            <th className="border p-2">Descuento</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Estado Pago</th>
            <th className="border p-2">Payment ID</th>
          </tr>
        </thead>
        <tbody>
          {tramitesFiltrados.map((t) => (
            <tr key={t.id}>
              <td className="border p-2 text-center">{t.id}</td>
              <td className="border p-2 text-center">
                {t.estado_tramite === 'pendiente' && (
                  <>
                    <button
                      className="text-green-600 font-semibold"
                      onClick={() => actualizarEstadoTramite(t.id, 'aprobado')}
                    >
                      ✅
                    </button>
                    <button
                      className="text-red-600 font-semibold ml-2"
                      onClick={() => actualizarEstadoTramite(t.id, 'rechazado')}
                    >
                      ❌
                    </button>
                  </>
                )}
              </td>
              <td className="border p-2">{t.tipo_tramite}</td>
              <td className="border p-2">{t.estado_tramite}</td>
              <td className="border p-2">{t.nombre} {t.apellido}</td>
              <td className="border p-2">{t.mail}</td>
              <td className="border p-2">{t.telefono}</td>
              <td className="border p-2">{t.domicilio_calle} {t.domicilio_nro}</td>
              <td className="border p-2">{new Date(t.creado_en).toLocaleDateString()}</td>
              <td className="border p-2">{t.creado_por}</td>
              <td className="border p-2">{t.dominio}</td>
              <td className="border p-2">
                {t.descuento.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
              </td>
              <td className="border p-2">
                {t.total.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
              </td>
              <td className="border p-2">{t.estado_pago_contribuyente}</td>
              <td className="border p-2">{t.payment_id_mercadopago}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
