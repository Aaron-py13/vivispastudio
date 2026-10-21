'use strict';
/*
  VIVI Spa & Studio — CONFIGURACIÓN DE ENLACES
  Los dos enlaces confirmados ya figuran en index.html.
  Para activar las demás tarjetas, pega el enlace REAL entre comillas.
  No uses enlaces genéricos para las reseñas o mapas de otra empresa.
*/
const ENLACES = {
  tiktok: 'https://www.tiktok.com/@vivispastudio',
  // Enlace para mostrar las opiniones (versión PC).
  google: 'https://www.google.com/search?q=VIVI+spa+%26+estudio#lrd=0x9110168bb5b82105:0x294eb51a29b70926,1,,,,',
  // Número de WhatsApp proporcionado por el usuario.
  whatsapp: 'https://wa.me/51993516678',
  sedes: [
    { nombre: 'Vivi Salón & Spa · Ver en Google Maps', url: "https://www.google.com/maps/place/Vivi+Sal%C3%B3n+%26+Spa/@-13.4147589,-76.1410236,97a,73.8y,-2.33h,104.83t/data=!3m7!1e1!3m5!1shP0auG3WOby6E_Y_Ld1G1A!2e0!6shttps:%2F%2Fstreetviewpixels-pa.clients6.google.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-14.829074183604277%26panoid%3DhP0auG3WOby6E_Y_Ld1G1A%26yaw%3D-2.32576029699524!7i16384!8i8192!4m9!1m2!2m1!1s+Santos+Nagaro+536,+Chincha+Alta,+Peru,+056!3m5!1s0x9110168bb5b82105:0x294eb51a29b70926!8m2!3d-13.4146973!4d-76.1410022!16s%2Fg%2F11ddwyt0dn?entry=ttu&g_ep=EgoyMDI2MTAxNC4wIKXMDSoASAFQAw%3D%3D" }
  ]
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Rendimiento: los móviles y dispositivos táctiles no mantienen efectos SVG
// continuos ni una pantalla de bienvenida que retrase la navegación.
const mobileLite = window.matchMedia('(max-width: 850px)').matches ||
  window.matchMedia('(pointer: coarse)').matches;
if (mobileLite || reducedMotion) {
  document.documentElement.classList.add('mobile-lite');
  const trails = document.querySelector('.light-trails');
  if (trails) {
    // SMIL (animateMotion) sigue ejecutándose aunque animation:none en CSS.
    // Se pausa y se retiran sus nodos; las líneas SVG permanecen visibles.
    if (typeof trails.pauseAnimations === 'function') trails.pauseAnimations();
    trails.querySelectorAll('animateMotion').forEach(motion => motion.remove());
  }
}

const welcome = document.getElementById('welcome');
const skip = document.getElementById('skipWelcome');
let welcomed = false;
let closeTimeout;
let toastTimeout;
const toast = document.getElementById('toast');
const toastText = document.getElementById('toastText');
const locationsDialog = document.getElementById('locationsDialog');
const locationsList = document.getElementById('locationButtons');

document.getElementById('year').textContent = String(new Date().getFullYear());

function enterSite(){
  if(welcomed) return;
  welcomed = true;
  clearTimeout(closeTimeout);
  document.body.classList.add('is-entered');
  if (document.activeElement === skip) skip.blur();
  welcome.setAttribute('aria-hidden','true');
  welcome.inert = true;
}

// Se muestra una bienvenida muy breve, no una pantalla de carga artificial larga.
// En la misma pestaña no vuelve a interrumpir si el visitante regresa.
let alreadySeen = false;
try{alreadySeen = sessionStorage.getItem('vivi-welcome-seen') === '1';sessionStorage.setItem('vivi-welcome-seen','1');}catch(_e){}
// En móviles la entrada dura menos de un segundo: visible pero sin carga ficticia.
// No dependemos de sessionStorage en móvil: cada recarga muestra la bienvenida.
// La página principal se renderiza inmediatamente detrás de la bienvenida.
if (reducedMotion) {
  enterSite();
} else if (mobileLite) {
  closeTimeout = window.setTimeout(enterSite, 950);
} else if (alreadySeen) {
  enterSite();
} else {
  closeTimeout = window.setTimeout(enterSite, 1450);
}
skip.addEventListener('click', enterSite);

// Reseñas: respetar EXACTAMENTE los dos enlaces aportados para VIVI.
// PC y laptop: enlace clásico de opiniones.
// Celular y tablet táctil: enlace copiado desde el teléfono con parámetro sv.
// La apariencia final del panel depende de Google, no del sitio VIVI.
const REVIEW_URL_PC = 'https://www.google.com/search?q=VIVI+spa+%26+estudio#lrd=0x9110168bb5b82105:0x294eb51a29b70926,1,,,,';
const REVIEW_URL_MOVIL = 'https://www.google.com/search?q=VIVI+spa+%26+estudio#lrd=0x9110168bb5b82105:0x294eb51a29b70926,1&sv=CAESzQEKuQEStgEKd0FKaVQ0dExNaG9XR0kxb0ZBbW9Md2NsN1dCWmJKWDZIbFdOUUp5YWhrSlZJcWJSS0RKZkppbEt0bm81NFptN1RiRnN6UmtRTVFTNmNCeWI3RzNKLTFjTnJ3bTU3NXlnSE8xdGJZNDZpdWxaZ3lLTXVZT2RYOXZrEhdHUUhaYXNLdUVJS3Exc1FQb2RTVWtBRRoiQURzcjlmVG01RXh4MFFtdHN2ZHlyMDh2QUM1SWFNS0hDZxIEODA1MRoBMyoAMAA4AUAAGAAgpMjNrA5KAhAB';
const reviewLink = document.getElementById('googleReviewLink');
if (reviewLink) {
  const mobileOrTablet = window.matchMedia('(max-width: 850px), (pointer: coarse)').matches;
  reviewLink.href = mobileOrTablet ? REVIEW_URL_MOVIL : REVIEW_URL_PC;
  reviewLink.target = mobileOrTablet ? '_self' : '_blank';
  reviewLink.rel = 'noopener noreferrer';
}
window.addEventListener('pageshow', e => { if(e.persisted) enterSite(); });

function notify(message){
  toastText.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('is-visible'), 4700);
}
document.getElementById('closeToast').addEventListener('click', () => toast.classList.remove('is-visible'));

const pendingLabels = {
  google: 'Abre la ficha de VIVI en Google Maps para dejar tu reseña o revisar opiniones.',
  tiktok: 'No se pudo abrir TikTok. Revisa tu navegador.',
  promociones: 'Consulta las promociones de VIVI y sus condiciones por WhatsApp.',
  whatsapp: 'Por favor, completa el formulario para consultar tu cita por WhatsApp.',
  sedes: 'Ubicación disponible. La segunda sede está pendiente de confirmación.'
};

function openLink(url){
  // No abrir URL vacía, javascript:, enlaces locales, ni un sitio no verificado.
  try{
    const parsed = new URL(url);
    if(parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
    window.open(parsed.toString(), '_blank', 'noopener,noreferrer');
    return true;
  }catch(_e){return false;}
}

function showLocations(){
  const valid = ENLACES.sedes.filter(item => item && item.nombre && item.url && /^https?:\/\//.test(item.url));
  if(valid.length === 0){notify(pendingLabels.sedes);return;}
  locationsList.replaceChildren();
  valid.forEach(item => {
    const a = document.createElement('a');
    a.href = item.url;
    a.textContent = item.nombre + ' ↗';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    locationsList.appendChild(a);
  });
  if(typeof locationsDialog.showModal === 'function') locationsDialog.showModal();
  else notify('Elige una de las sedes en Google Maps.');
}

document.querySelectorAll('[data-pending]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.pending;
    if(key === 'sedes'){showLocations();return;}
    if(key === 'promociones'){showPromotions();return;}
    if(key === 'whatsapp'){showBooking();return;}
    if(!ENLACES[key] || !openLink(ENLACES[key])) notify(pendingLabels[key] || 'Enlace pendiente de confirmar.');
  });
});
document.getElementById('closeLocations').addEventListener('click', () => locationsDialog.close());
locationsDialog.addEventListener('click', event => { if(event.target === locationsDialog) locationsDialog.close(); });


// La ventana de promociones de VIVI contiene las tres ofertas proporcionadas.
const promotionsDialog = document.getElementById('promotionsDialog');
function showPromotions(){
  if(typeof promotionsDialog.showModal === 'function') promotionsDialog.showModal();
  else notify('Tu navegador no permite abrir la ventana de promociones.');
}
document.getElementById('closePromotionsTop').addEventListener('click',()=>promotionsDialog.close());
promotionsDialog.addEventListener('click',event=>{if(event.target===promotionsDialog) promotionsDialog.close()});


// Contacto VIVI — número proporcionado por el cliente: Perú +51 993 516 678.
const WHATSAPP_NUMBER = '51993516678';
function whatsappMessage(message) {
  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  // Enlace real: al pulsarlo, el visitante elige enviar el mensaje en WhatsApp.
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}

// Promociones de VIVI: compartir foto + mensaje breve, sin formularios.
// WhatsApp no permite adjuntar archivos automáticamente con un enlace wa.me.
// En móviles compatibles se abre Compartir para elegir WhatsApp con la foto.
// En otros casos se abre WhatsApp con el mensaje y el enlace a la foto.
const promocionesVivi = [
  {
    clave: 'botox',
    nombre: 'Maratón de Bótox Capilar desde S/ 80',
    foto: 'assets/promo-botox.webp'
  },
  {
    clave: 'balayage',
    nombre: 'Balayage con hasta 50 % de descuento',
    foto: 'assets/promo-balayage.webp'
  },
  {
    clave: 'tratamiento',
    nombre: 'Tratamiento Capilar',
    foto: 'assets/promo-tratamiento.webp'
  }
];

function obtenerPromocionVivi(button) {
  const nombre = (button.dataset.promo || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  if (nombre.includes('balayage')) return promocionesVivi[1];
  if (nombre.includes('botox')) return promocionesVivi[0];
  return promocionesVivi[2];
}

const archivosPromosVivi = new Map();
// Se preparan antes del clic para que el menú Compartir no pierda
// la activación del usuario al esperar la descarga de la imagen.
if (navigator.share && navigator.canShare && typeof File === 'function') {
  promocionesVivi.forEach(promo => {
    const img = document.querySelector(`.vivi-offer--${promo.clave === 'tratamiento' ? 'treatment' : promo.clave === 'botox' ? 'botox' : 'balayage'} .vivi-offer__photo`);
    const urlFoto = img ? img.src : new URL(promo.foto, document.baseURI).href;
    fetch(urlFoto)
      .then(response => {
        if (!response.ok) throw new Error('Imagen no disponible');
        return response.blob();
      })
      .then(blob => {
        const archivo = new File([blob], `vivi-${promo.clave}.webp`, {
          type: 'image/webp'
        });
        if (navigator.canShare({ files: [archivo] })) {
          archivosPromosVivi.set(promo.clave, archivo);
        }
      })
      .catch(() => { /* WhatsApp con enlace será la alternativa. */ });
  });
}

document.querySelectorAll('[data-promo]').forEach(button => {
  button.addEventListener('click', () => {
    const promo = obtenerPromocionVivi(button);
    const mensaje = `¡Hola, VIVI Spa & Studio! ✨ Estoy interesada en la promoción de ${promo.nombre}. 💕 ¿Me brindan más información, por favor?`;
    const urlFoto = new URL(promo.foto, document.baseURI).href;
    const archivo = archivosPromosVivi.get(promo.clave);

    if (archivo && navigator.share) {
      // El usuario elige WhatsApp para compartir imagen y texto.
      // En algunos teléfonos WhatsApp puede no conservar el texto junto a la foto.
      try {
        const compartido = navigator.share({
          files: [archivo],
          text: mensaje
        });
        Promise.resolve(compartido).catch(error => {
          // Si cancela, no abrimos ninguna otra aplicación.
          if (error && error.name === 'AbortError') return;
          whatsappMessage(`${mensaje}\n\n📸 Imagen de la promoción: ${urlFoto}`);
        });
        return;
      } catch (_error) {
        // Se usa el enlace de WhatsApp de abajo.
      }
    }

    whatsappMessage(`${mensaje}\n\n📸 Imagen de la promoción: ${urlFoto}`);
  });
});

const bookingDialog = document.getElementById('bookingDialog');
const bookingForm = document.getElementById('bookingForm');
const bookingDate = document.getElementById('bookingDate');
function todayLocal() {
  const d = new Date();
  const p = v => String(v).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
}
function showBooking() {
  bookingDate.min = todayLocal();
  if (typeof bookingDialog.showModal === 'function') {
    bookingDialog.showModal();
    window.setTimeout(() => document.getElementById('clientName').focus(), 20);
  } else notify('Actualiza tu navegador para completar la solicitud de cita.');
}
document.getElementById('closeBooking').addEventListener('click', () => bookingDialog.close());
bookingDialog.addEventListener('click', e => {if(e.target === bookingDialog) bookingDialog.close()});
bookingForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!bookingForm.reportValidity()) return;
  const name = document.getElementById('clientName').value.trim().replace(/\s+/g, ' ');
  const date = bookingDate.value;
  const service = document.getElementById('bookingService').value;
  const time = document.getElementById('bookingTime').value;
  const notes = document.getElementById('bookingNotes').value.trim();
  if (name.length < 2 || !date || date < todayLocal() || !service) {
    notify('Completa tu nombre, una fecha válida y el servicio.'); return;
  }
  const [y,m,d] = date.split('-');
  const formattedDate = `${d}/${m}/${y}`;
  const message = [
    '¡Hola, VIVI Spa & Studio! ✨ Quisiera solicitar una cita.',
    '',
    `👤 Nombre: ${name}`,
    `📅 Fecha deseada: ${formattedDate}`,
    time ? `🕐 Hora preferida: ${time}` : '🕐 Hora: por coordinar',
    `💆 Servicio de interés: ${service}`,
    notes ? `📝 Comentarios: ${notes}` : '',
    '',
    '¿Podrían confirmarme disponibilidad, precio y horario? ¡Muchas gracias!'
  ].filter((line, i, list) => line !== '' || (i > 0 && list[i-1] !== '')).join('\n');
  whatsappMessage(message);
});
