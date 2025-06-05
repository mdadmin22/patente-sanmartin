import { useState } from 'react';
import styles from '../styles/Consulta.module.css';

export default function Consulta() {
  const [codigo, setCodigo] = useState('');
  const [anio, setAnio] = useState('');
  const [origen, setOrigen] = useState('importado'); // Por defecto
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const limpiarCodigo = (valor) => {
    // Elimina guiones y espacios, mantiene mayúsculas
    return valor.replace(/[-\s]/g, '').toUpperCase();
  };

  const manejarConsulta = async (e) => {
    e.preventDefault();
    setError('');
    setResultado(null);

    const codigoLimpio = limpiarCodigo(codigo);

    if (!codigoLimpio || !anio) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    try {
      const res = await fetch(`/api/valorFiscal?codigo_mtm=${codigoLimpio}&anio=${anio}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error desconocido');
        return;
      }

      setResultado(data);
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className={styles.contenedor}>
      <h1 className={styles.titulo}>Consulta de Valor Fiscal</h1>

      <form onSubmit={manejarConsulta} className={styles.formulario}>
        <label className={styles.label}>
          Origen del Vehículo:
          <select
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            className={styles.select}
          >
            <option value="importado">Importado</option>
            <option value="nacional">Nacional</option>
          </select>
        </label>

        <label className={styles.label}>
          Código según el título:
          <input
            type="text"
            placeholder={
              origen === 'importado' ? 'Ej: 024-778-04' : 'Ej: 030-068-071'
            }
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className={styles.input}
          />
        </label>

        <label className={styles.label}>
          Año del vehículo:
          <input
            type="number"
            placeholder="Ej: 2023"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            className={styles.input}
          />
        </label>

        <button type="submit" className={styles.boton}>
          Consultar
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {resultado && (
        <div className={styles.resultado}>
          <p><strong>Descripción:</strong> {resultado.descripcion}</p>
          <p><strong>Valor Fiscal:</strong> ${parseInt(resultado.valorFiscal).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
