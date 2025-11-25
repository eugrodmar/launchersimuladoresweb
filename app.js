<<<<<<< Updated upstream
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
=======
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


/* -- SCRIPT DEL CARROUSEL -- */

let images = [
    {
        "url": "/images/davante-alumnos.png"
    },
    {
        "url": "/images/LauncherDesignV1.png"
    },
    {
        "url": "/images/davante-alumnos.png"
    },
    {
        "url": "/images/LauncherDesignV1.png"
    }
];

// Elementos necesarios 
let previous = document.getElementById('previous');
let next = document.getElementById('next');
let imagen = document.getElementById('img');
let dots = document.getElementById('dots');

let actual = 0;
posicionCarrusel();

// Botón anterior
previous.addEventListener('click', function () {
    actual -= 1;

    if (actual === -1) {
        actual = images.length - 1;
    }

    imagen.innerHTML = `<img class="img" src="${images[actual].url}" alt="imagen carrusel" loading="lazy">`;
    posicionCarrusel();
});

// Botón siguiente
next.addEventListener('click', function () {
    actual += 1;

    if (actual === images.length) {
        actual = 0;
    }

    imagen.innerHTML = `<img class="img" src="${images[actual].url}" alt="imagen carrusel" loading="lazy">`;
    posicionCarrusel();
});

// Puntos
function posicionCarrusel() {
    dots.innerHTML = "";
    for (let i = 0; i < images.length; i++) {
        if (i === actual) {
            dots.innerHTML += '<p class="bold">.</p>';
        } else {
            dots.innerHTML += '<p>.</p>';
        }
    }
}
>>>>>>> Stashed changes
