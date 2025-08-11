import { useRef, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function FileUpload() {
  const inputRef = useRef(null);
  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const MAX_MB = 15;
  const MIMES = ["application/pdf", "image/jpeg", "image/png"];

  const handleArchivo = (e) => {
    const file = e.target.files?.[0];
    setResultado(null);
    setError(null);
    setProgreso(0);
    if (!file) return;
    if (!MIMES.includes(file.type))
      return setError("Formato no soportado. Usa PDF, JPG o PNG.");
    if (file.size > MAX_MB * 1024 * 1024)
      return setError(`El archivo supera ${MAX_MB} MB.`);
    setArchivo(file);
  };

  const verificar = async () => {
    if (!archivo) return setError("Selecciona un archivo primero.");
    setCargando(true);
    setResultado(null);
    setError(null);
    setProgreso(0);

    try {
      const form = new FormData();
      form.append("archivo", archivo);
      const res = await axios.post(`${API_URL}/api/verificar`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
        onUploadProgress: (e) => {
          if (!e.total) return;
          setProgreso(Math.round((e.loaded * 100) / e.total));
        },
      });
      setResultado(res.data);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        `${err.response?.status || ""} ${
          err.response?.statusText || ""
        }`.trim() ||
        err.message ||
        "No pudimos verificar el documento.";
      setError(msg);
    } finally {
      setCargando(false);
    }
  };

  const reset = () => {
    setArchivo(null);
    setResultado(null);
    setError(null);
    setProgreso(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="card">
      <h3>Subir revisión técnica</h3>

      <label className="file">
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleArchivo}
          disabled={cargando}
        />
        <span>
          {archivo ? archivo.name : "Selecciona un archivo (PDF/JPG/PNG)"}
        </span>
      </label>

      <div className="actions">
        <button
          className="btn"
          onClick={verificar}
          disabled={cargando || !archivo}
        >
          {cargando ? "Analizando..." : "Verificar Documento"}
        </button>
        <button
          className="btn"
          onClick={reset}
          disabled={cargando && !resultado}
        >
          Limpiar
        </button>
      </div>

      {cargando && (
        <div className="loading">
          <div className="spinner" />
          <p>Procesando documento… {progreso}%</p>
          <div className="progress">
            <div className="bar" style={{ width: `${progreso}%` }} />
          </div>
        </div>
      )}

      {resultado && (
        <div
          className={`alert ${
            resultado.mensaje?.toLowerCase().includes("válido") ? "ok" : "warn"
          }`}
        >
          <strong>{resultado.mensaje}</strong>
          {resultado.detalles && (
            <details>
              <summary>Ver detalles técnicos</summary>
              <pre>{JSON.stringify(resultado.detalles, null, 2)}</pre>
              {resultado.textoExtraido && (
                <>
                  <div className="divider" />
                  <small>Preview OCR:</small>
                  <pre className="preview">{resultado.textoExtraido}</pre>
                </>
              )}
            </details>
          )}
        </div>
      )}

      {error && <div className="alert err">{error}</div>}
    </div>
  );
}
