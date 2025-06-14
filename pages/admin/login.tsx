// pages/admin/login.tsx
import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';



interface LoginResponse {
  success: boolean;
  token?: string;
}


export default function LoginAdmin() {
  const [email, setEmail] = useState<string>('');
  const [clave, setClave] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post<LoginResponse>('/api/login', { email, clave });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        router.push('/admin');
      } else {
        setError('Credenciales inválidas.');
      }
    } catch (err) {
      setError('Error en el servidor.');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '3rem' }}>
      <h2>Login Municipal</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={clave}
          onChange={(e) => setClave(e.target.value)} required />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
