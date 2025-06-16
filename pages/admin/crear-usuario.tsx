// pages/admin/crear-usuario.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function CrearUsuario() {
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('admin');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/crear-usuario', {
        nombre,
        email,
        rol,
        contraseña: password,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Usuario creado correctamente');
      router.push('/admin');
    } catch (err) {
      alert('Error al crear usuario');
    }
  };

  return (
    <div className="min-h-screen bg-[#5b2b8c] text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Crear nuevo usuario</h1>
      <div className="space-y-4">
        <div>
          <div>
  <label>Nombre completo:</label>
  <input
    className="block w-full p-2 rounded text-black"
    type="text"
    value={nombre}
    onChange={(e) => setNombre(e.target.value)}
  />
</div>

          <label>Email:</label>
          <input
            className="block w-full p-2 rounded text-black"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Rol:</label>
          <select
            className="block w-full p-2 rounded text-black"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          >
            <option value="admin">Administrador</option>
            <option value="operador">Operador</option>
          </select>
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            className="block w-full p-2 rounded text-black"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="bg-white text-[#5b2b8c] font-bold py-2 px-4 rounded mt-4"
          onClick={handleSubmit}
        >
          Crear usuario
        </button>
      </div>
    </div>
  );
}
