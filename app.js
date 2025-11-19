const contenedor = document.getElementById("contenedor");
const centinela = document.getElementById("centinela");

// Lista de páginas reales (sin extensión) para URL amigable
const paginas = [
  "catalogo",
  "comoFunciona",
  "creadoPorEstudiantes",
  "heroCta",
  "useCases",
  "faq"
];

let paginaActual = 0; // índice en el array
let cargando = false;

/*-- OBSERVADOR 1: scroll infinito --*/
const observerScroll = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !cargando && paginaActual < paginas.length) {
      cargarPagina();
    }
  });
}, {
  rootMargin: "400px",
});

/*-- OBSERVADOR 2: actualizar URL y sección visible --*/
const observerSecciones = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id; // Ej: page1, page2
      const index = parseInt(id.replace("page", "")) - 1;
      const nombreArchivo = paginas[index];
      history.replaceState({ pagina: index }, "", `?page=${nombreArchivo}`);
      sessionStorage.setItem("ultimaPagina", index);
    }
  });
}, {
  threshold: 0.6,
});

/*-- Cargar páginas iniciales según última guardada --*/
window.addEventListener("DOMContentLoaded", async () => {
  const ultimaGuardada = parseInt(sessionStorage.getItem("ultimaPagina")) || 0;

  for (let i = 0; i <= ultimaGuardada && i < paginas.length; i++) {
    await cargarPagina(i); // carga hasta la última guardada
  }

  observerScroll.observe(centinela);

  const seccion = document.getElementById(`page${ultimaGuardada + 1}`);
  if (seccion) seccion.scrollIntoView({ behavior: "auto" });
});

/*-- Función para cargar una página dinámica --*/
async function cargarPagina(index = paginaActual) {
  if (cargando || index >= paginas.length) return;

  cargando = true;

  try {
    const nombreArchivo = paginas[index];
    const respuesta = await fetch(`contenido/${nombreArchivo}.html`);
    if (!respuesta.ok)
      throw new Error(`Error al cargar ${nombreArchivo}.html`);

    const html = await respuesta.text();

    const section = document.createElement("section");
    section.id = `page${index + 1}`; // IDs internos numerados
    section.innerHTML = html;
    contenedor.appendChild(section);

    observerSecciones.observe(section);
    contenedor.appendChild(centinela);

    if (index === paginaActual)
      history.pushState({ pagina: index }, "", `?page=${nombreArchivo}`);

    paginaActual++;
  } catch (error) {
    console.error("Error cargando página:", error);
  } finally {
    cargando = false;
  }
}

/*-- Manejar navegación con botones atrás/adelante del navegador --*/
window.addEventListener("popstate", (event) => {
  if (event.state && event.state.pagina !== undefined) {
    const index = event.state.pagina;
    const seccion = document.getElementById(`page${index + 1}`);
    if (seccion) seccion.scrollIntoView({ behavior: "smooth" });
  }
});
