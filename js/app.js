document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScrolling();
  initScrollEffects();
});

/**
 * Inicializa la funcionalidad del menú móvil
 */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-btn');
  const menu = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggle || !menu) return;

  // Toggle del menú principal
  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    updateMenuState(toggle, isOpen);
  });

  // Cerrar menú al hacer clic en un enlace (móvil)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        menu.classList.remove('open');
        updateMenuState(toggle, false);
      }
    });
  });

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      updateMenuState(toggle, false);
    }
  });

  // Cerrar menú con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      menu.classList.remove('open');
      updateMenuState(toggle, false);
      toggle.focus();
    }
  });
}

/**
 * Actualiza el estado visual y de accesibilidad del menú
 */
function updateMenuState(toggle, isOpen) {
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  toggle.innerHTML = isOpen ? '✕' : '☰';
}

/**
 * Inicializa el scroll suave para enlaces de anclaje
 */
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Actualizar URL sin saltar
        history.pushState(null, null, href);
      }
    });
  });
}

/**
 * Inicializa efectos basados en scroll
 */
function initScrollEffects() {
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Efecto de header que se oculta/muestra al hacer scroll
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
  });
  
  // Añadir transición al header
  header.style.transition = 'transform 0.3s ease-in-out';
}

/**
 * Carga un fragmento HTML y lo inserta en el elemento objetivo.
 * target: selector o elemento
 * url (opcional): si no se pasa, se toma de data-src del elemento
 */
async function renderComponent(target, url) {
  const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
  if (!targetElement) return;
  const src = url || targetElement.dataset.src;
  if (!src) return;

  try {
    const res = await fetch(src, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${src}`);
    const html = await res.text();
    targetElement.innerHTML = html;
  } catch (err) {
    console.error(err);
    targetElement.innerHTML = `<div role="alert" class="error-message">No se pudo cargar el componente: ${src}</div>`;
  }
}

/**
 * Busca todos los elementos con data-src y los renderiza.
 */
function renderComponents() {
  document.querySelectorAll('[data-src]').forEach(targetElement => renderComponent(targetElement));
}

// Auto-inicializa al cargar la página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderComponents);
} else {
  renderComponents();
}

/**
 * Funcionalidad para los botones de agendar cita
 */
document.addEventListener('DOMContentLoaded', () => {
  const agendarButtons = document.querySelectorAll('.agendar-btn');
  
  agendarButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Simulación de funcionalidad de agendar cita
      const serviceName = button.closest('.servicio-card').querySelector('h3').textContent;
      
      alert(`¡Gracias por tu interés en ${serviceName}! En breve nos pondremos en contacto contigo.`);
      
    });
  });
});