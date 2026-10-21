'use strict';
/*
  VIVI Spa & Studio — CONFIGURACIÓN DE ENLACES
  Los dos enlaces confirmados ya figuran en index.html.
  Para activar las demás tarjetas, pega el enlace REAL entre comillas.
  No uses enlaces genéricos para las reseñas o mapas de otra empresa.
*/
const ENLACES = {
  tiktok: 'https://www.tiktok.com/@vivispastudio',
  // Enlace directo para escribir una reseña, proporcionado por el cliente.
  google: "https://www.google.com/search?q=VIVI+spa+%26+estudio#lrd=0x9110168bb5b82105:0x294eb51a29b70926,1,,,,",
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

// En teléfonos se navega en la MISMA pestaña: evita que las pestañas
// emergentes bloqueadas impidan abrir la página de reseñas.
const reviewLink = document.getElementById('googleReviewLink');
if (reviewLink && mobileLite) {
  reviewLink.setAttribute('target', '_self');
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
  promociones: 'Las promociones son propuestas de muestra hasta confirmar las ofertas vigentes.',
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


// Promociones DEMO: textos orientativos, no ventas u ofertas confirmadas.
const promotionsDialog = document.getElementById('promotionsDialog');
function showPromotions(){
  if(typeof promotionsDialog.showModal === 'function') promotionsDialog.showModal();
  else notify('Estas son propuestas de muestra. Consulta las ofertas vigentes en Instagram.');
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

// Promociones: son propuestas visuales, nunca se anuncian descuentos no confirmados.
document.querySelectorAll('[data-promo]').forEach(button => {
  button.addEventListener('click', () => {
    const name = button.dataset.promo;
    const message = `¡Hola, equipo de VIVI Spa & Studio! ✨ Vi en su página la propuesta de “${name}” y me interesa conocer más. ¿Podrían confirmarme si está disponible actualmente, qué incluye, el precio y qué horarios tienen? ¡Muchas gracias!`;
    whatsappMessage(message);
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
