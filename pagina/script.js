// Referencias a los elementos del DOM
const btnRevelar = document.getElementById('btn-revelar');
const infoExtra = document.getElementById('info-extra');
const btnTema = document.getElementById('btn-tema');
const btnAnimacion = document.getElementById('btn-animacion');
const fondo = document.getElementById('fondo-interactivo');

let animacionActiva = true;

// 1. Mostrar/Ocultar Info y Personaje
btnRevelar.addEventListener('click', () => {
    if (infoExtra.classList.contains('oculto')) {
        infoExtra.classList.remove('oculto');
        infoExtra.classList.add('visible');
        btnRevelar.textContent = "Ocultar Identidad";
    } else {
        infoExtra.classList.add('oculto');
        infoExtra.classList.remove('visible');
        btnRevelar.textContent = "Mostrar Identidad";
    }
});

// 2. Modo Claro / Oscuro
btnTema.addEventListener('click', () => {
    const temaActual = document.body.getAttribute('data-tema');
    if (temaActual === 'oscuro') {
        document.body.removeAttribute('data-tema');
        btnTema.textContent = "🌙 Modo Oscuro";
    } else {
        document.body.setAttribute('data-tema', 'oscuro');
        btnTema.textContent = "☀️ Modo Claro";
    }
});

// 3. Pausar / Reanudar la animación del fondo
btnAnimacion.addEventListener('click', () => {
    animacionActiva = !animacionActiva;
    if (animacionActiva) {
        btnAnimacion.textContent = "⏸️ Pausar Fondo";
    } else {
        btnAnimacion.textContent = "▶️ Reanudar Fondo";
        fondo.style.transform = `translate(0px, 0px)`; // Regresa al centro
    }
});

// 4. Efecto Parallax (movimiento con el mouse)
document.addEventListener('mousemove', (e) => {
    if (!animacionActiva) return;

    // Calculamos el centro de la pantalla
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    // Multiplicamos por la cantidad de pixeles que queremos que se mueva
    const movimientoX = x * 40; 
    const movimientoY = y * 40;

    fondo.style.transform = `translate(${movimientoX}px, ${movimientoY}px)`;
});