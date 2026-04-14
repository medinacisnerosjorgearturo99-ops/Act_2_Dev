// === 1. LÓGICA DE LA TARJETA Y BOTONES ===
const btnRevelar = document.getElementById('btn-revelar');
const infoExtra = document.getElementById('info-extra');
const btnTema = document.getElementById('btn-tema');
const btnAnimacion = document.getElementById('btn-animacion');

let animacionActiva = true;

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

btnTema.addEventListener('click', () => {
    const temaActual = document.body.getAttribute('data-tema');
    if (temaActual === 'oscuro') {
        document.body.removeAttribute('data-tema');
        btnTema.textContent = "🌙 Modo Oscuro";
    } else {
        document.body.setAttribute('data-tema', 'oscuro');
        btnTema.textContent = "☀️ Modo Claro";
    }
    iniciarParticulas(); // Reiniciamos para que las líneas cambien de color
});

btnAnimacion.addEventListener('click', () => {
    animacionActiva = !animacionActiva;
    if (animacionActiva) {
        btnAnimacion.textContent = "⏸️ Pausar Fondo";
    } else {
        btnAnimacion.textContent = "▶️ Reanudar Fondo";
    }
});

// === 2. LÓGICA DEL SISTEMA DE PARTÍCULAS (CANVAS) ===
const canvas = document.getElementById('lienzo-interactivo');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particulasArray = [];
// El "radio" es qué tan cerca tiene que estar el mouse para asustar a las partículas
let mouse = { x: null, y: null, radio: 150 };

// Detectar el mouse
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particula {
    constructor(x, y, direccionX, direccionY, tamaño, color) {
        this.x = x;
        this.y = y;
        this.direccionX = direccionX;
        this.direccionY = direccionY;
        this.tamaño = tamaño;
        this.color = color;
    }

    dibujar() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.tamaño, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    actualizar() {
        if (animacionActiva) {
            // Lógica para que las partículas huyan del mouse
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distancia = Math.sqrt(dx * dx + dy * dy);
            
            if (distancia < mouse.radio) {
                const fuerza = (mouse.radio - distancia) / mouse.radio;
                const dirX = dx / distancia;
                const dirY = dy / distancia;
                this.x -= dirX * fuerza * 5; // El 5 es la velocidad de escape
                this.y -= dirY * fuerza * 5;
            } else {
                // Si están lejos del mouse, flotan normal
                this.x += this.direccionX;
                this.y += this.direccionY;
            }

            // Que reboten si tocan el borde de la pantalla
            if (this.x < 0 || this.x > canvas.width) this.direccionX = -this.direccionX;
            if (this.y < 0 || this.y > canvas.height) this.direccionY = -this.direccionY;
        }
        this.dibujar();
    }
}

// Crear la red de partículas
function iniciarParticulas() {
    particulasArray = [];
    // Calcula cuántas partículas poner según el tamaño de la pantalla
    let numParticulas = (canvas.width * canvas.height) / 9000; 
    let colorTema = document.body.getAttribute('data-tema') === 'oscuro' ? '#10b981' : '#00853f';

    for (let i = 0; i < numParticulas; i++) {
        let tamaño = (Math.random() * 2.5) + 1;
        let x = Math.random() * (innerWidth - tamaño * 2) + tamaño;
        let y = Math.random() * (innerHeight - tamaño * 2) + tamaño;
        let direccionX = (Math.random() * 1.5) - 0.75;
        let direccionY = (Math.random() * 1.5) - 0.75;
        particulasArray.push(new Particula(x, y, direccionX, direccionY, tamaño, colorTema));
    }
}

// Conectar las partículas con líneas si están cerca
function conectar() {
    let esOscuro = document.body.getAttribute('data-tema') === 'oscuro';
    // Colores RGB para la línea dependiendo del tema
    let r = esOscuro ? 16 : 0;
    let g = esOscuro ? 185 : 133;
    let b = esOscuro ? 129 : 63;

    for (let a = 0; a < particulasArray.length; a++) {
        for (let b_idx = a; b_idx < particulasArray.length; b_idx++) {
            let distancia = ((particulasArray[a].x - particulasArray[b_idx].x) * (particulasArray[a].x - particulasArray[b_idx].x)) 
                          + ((particulasArray[a].y - particulasArray[b_idx].y) * (particulasArray[a].y - particulasArray[b_idx].y));
            
            // Si la distancia entre dos puntos es corta, dibujamos una línea
            if (distancia < (canvas.width / 7) * (canvas.height / 7)) {
                let opacidad = 1 - (distancia / 20000);
                ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacidad})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particulasArray[a].x, particulasArray[a].y);
                ctx.lineTo(particulasArray[b_idx].x, particulasArray[b_idx].y);
                ctx.stroke();
            }
        }
    }
}

// Bucle de animación infinito
function animar() {
    requestAnimationFrame(animar);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particulasArray.length; i++) {
        particulasArray[i].actualizar();
    }
    conectar();
}

// Que el lienzo se ajuste si cambias el tamaño de la ventana
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    iniciarParticulas();
});

// Arrancar el sistema
iniciarParticulas();
animar();