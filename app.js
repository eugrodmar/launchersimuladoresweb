const contenedor = document.getElementById("contenedor");
const centinela = document.getElementById("centinela");

let paginaActual = 1;
const totalPaginas = 6;
let cargando = false;


/*-- OBSERVADOR 1: scroll infinito (carga nuevas páginas al llegar al final) --*/

const observerScroll = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !cargando && paginaActual <= totalPaginas) {
      cargarPagina(paginaActual);
    }
  });
}, {
  rootMargin: "400px",
});


/*-- OBSERVADOR 2: detectar la sección visible y actualizar la URL dinámicamente --*/

const observerSecciones = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      const numero = id.replace("page", "");
      history.replaceState({ pagina: numero }, "", `?page=${numero}`);
      sessionStorage.setItem("ultimaPagina", numero); 
    }
  });
}, {
  threshold: 0.6,
});


/*-- Cargar la primera página al inicio --*/

window.addEventListener("DOMContentLoaded", async () => {
  // Si había una última página guardada, la usamos
  const ultimaGuardada = parseInt(sessionStorage.getItem("ultimaPagina")) || 1;
  console.log("Última página guardada:", ultimaGuardada);

  // Cargar todas las páginas hasta esa
  for (let i = 1; i <= ultimaGuardada; i++) {
    await cargarPagina(i);
  }

  observerScroll.observe(centinela);

  // Hacer scroll hasta la sección guardada
  const seccion = document.getElementById(`page${ultimaGuardada}`);
  if (seccion) {
    seccion.scrollIntoView({ behavior: "instant" });
  }
});


/*-- Función para cargar una página dinámica --*/

async function cargarPagina(numPagina) {
  if (cargando) return;
  cargando = true;

  if (numPagina > totalPaginas) {
    console.log("Fin del contenido");
    return;
  }

  try {
    const respuesta = await fetch(`contenido/page${numPagina}.html`);
    if (!respuesta.ok)
      throw new Error(`Error al cargar la page${numPagina}.html`);

    const html = await respuesta.text();

    const section = document.createElement("section");
    section.id = `page${numPagina}`;
    section.innerHTML = html;
    contenedor.appendChild(section);

    observerSecciones.observe(section);
    contenedor.appendChild(centinela);

    // Solo añadimos al historial si no es una carga inicial
    if (paginaActual === numPagina)
      history.pushState({ pagina: numPagina }, "", `?page=${numPagina}`);

    paginaActual++;
    cargando = false;
  } catch (error) {
    console.error("Error cargando página:", error);
    cargando = false;
  }
}

/*-- Volver a la sección correcta al usar los botones del navegador --*/

window.addEventListener("popstate", (event) => {
  if (event.state && event.state.pagina) {
    const pagina = event.state.pagina;
    const seccion = document.getElementById(`page${pagina}`);
    if (seccion) {
      seccion.scrollIntoView({ behavior: "smooth" });
    }
  }
});
