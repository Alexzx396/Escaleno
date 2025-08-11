import "./App.css";
import logo from "./assets/logo.png";
import FileUpload from "./components/FileUpload.jsx";

export default function App() {
  return (
    <div className="page">
      <header className="nav">
        <div className="nav__content">
          <img src={logo} className="brand" alt="Escaleno" />
          <nav className="nav__links">
            <a
              href="https://alexzx396.github.io/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portafolio Alex Arce
            </a>
          </nav>
        </div>
      </header>

      <main className="hero">
        <section className="hero__content">
          <h1>
            Cargar un archivo PDF o JPG con la revisión técnica de un vehículo
          </h1>
          <p><br />
            Verifica automáticamente certificados de revisión técnica. Sube un
            PDF o una imagen clara y a plena luz. Si la foto está borrosa u
            oscura, deberás subir una nueva para un análisis correcto.
          </p>
          <br />
          <FileUpload />
        </section>
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Prueba Tecnica Desarrollador Alex Arce —
        Todos los derechos reservados.
      </footer>
    </div>
  );
}
