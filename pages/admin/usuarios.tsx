// pages/admin/usuarios.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

interface UsuariosResponse {
  success: boolean;
  usuarios: Usuario[];
}

interface CrearUsuarioResponse {
  success: boolean;
  nuevoUsuario: Usuario;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [autorizado, setAutorizado] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [rol, setRol] = useState('operador');
  const [mensaje, setMensaje] = useState('');
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

    axios.get<UsuariosResponse>('/api/usuarios', {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.data.success) {
        setUsuarios(res.data.usuarios);
      }
    });
  }, []);

  const crearUsuario = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await axios.post<CrearUsuarioResponse>(
    '/api/crear-usuario',
    { nombre, email, clave, rol },
    { headers: { Authorization: `Bearer ${token}` } }
    );

    if (res.data.success) {
      setMensaje('✅ Usuario creado con éxito');
      setUsuarios([...usuarios, res.data.nuevoUsuario]);
      setNombre('');
      setEmail('');
      setClave('');
      setRol('operador');
      setMostrarModal(false);
    } else {
      setMensaje('❌ Error al crear el usuario');
    }
  };

  if (!autorizado) return <p>Verificando acceso...</p>;

  return (
    <div className="min-h-screen bg-[#fefefe] text-black pt-10 px-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios Municipales</h1>

      <button
        onClick={() => setMostrarModal(true)}
        className="mb-4 bg-[#5b2b8c] text-white font-bold py-2 px-4 rounded-md shadow hover:shadow-lg"
      >
        ➕ Crear nuevo usuario
      </button>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td className="border p-2 text-center">{u.id}</td>
              <td className="border p-2">{u.nombre}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2 text-center">{u.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Crear nuevo usuario</h2>

            {mensaje && (
              <p className="text-sm text-blue-700 font-semibold mb-3">{mensaje}</p>
            )}

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              />
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
              >
                <option value="operador">Operador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={crearUsuario}
                className="px-4 py-2 rounded-md bg-[#5b2b8c] text-white font-semibold hover:shadow-lg"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
