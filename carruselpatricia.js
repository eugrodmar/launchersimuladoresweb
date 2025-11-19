/* ===== CARRUSEL INFINITO — AUTOPLAY FUNCIONANDO ===== */

const track = document.querySelector(".carousel-track");
let slides = Array.from(track.children);
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

let index = 1;
let autoplaySpeed = 2500;

/* Clonar para bucle infinito */
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.classList.add("clone");
lastClone.classList.add("clone");

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

/* Actualizar lista */
slides = Array.from(track.children);

/* Función segura para obtener ancho */
function getSlideWidth() {
  return slides[0].getBoundingClientRect().width || track.offsetWidth;
}

/* Colocar posición */
function setPosition(noTransition = false) {
  const slideWidth = getSlideWidth();
  if (noTransition) track.style.transition = "none";
  track.style.transform = `translateX(${-index * slideWidth}px)`;
}

/* Siguiente */
function nextSlide() {
  if (index >= slides.length - 1) return;
  track.style.transition = "transform 0.45s ease";
  index++;
  setPosition();
}

/* Anterior */
function prevSlide() {
  if (index <= 0) return;
  track.style.transition = "transform 0.45s ease";
  index--;
  setPosition();
}

next.addEventListener("click", nextSlide);
prev.addEventListener("click", prevSlide);

/* Bucle infinito real */
track.addEventListener("transitionend", () => {
  if (slides[index].classList.contains("clone")) {
    track.style.transition = "none";

    if (index === slides.length - 1) {
      index = 1;
    } else if (index === 0) {
      index = slides.length - 2;
    }

    setPosition(true);
  }
});

/* ===== AUTOPLAY SEGURO ===== */
let play;

function startAutoplay() {
  stopAutoplay(); // evitar duplicado
  play = setInterval(() => {
    nextSlide();
  }, autoplaySpeed);
}

function stopAutoplay() {
  clearInterval(play);
}

document.querySelector(".carousel").addEventListener("mouseenter", stopAutoplay);
document.querySelector(".carousel").addEventListener("mouseleave", startAutoplay);

/* ===== INICIALIZACIÓN SEGURA ===== */
window.addEventListener("load", () => {
  setTimeout(() => {
    setPosition(true);
    startAutoplay();
  }, 50); // tiempo para que carguen imágenes
});

window.addEventListener("resize", () => {
  setPosition(true);
});