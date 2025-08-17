// ===========================================
// RICK AND MORTY API INTEGRATION
// ===========================================

// Configuración de la API
const API_BASE_URL = 'https://rickandmortyapi.com/api';
const API_ENDPOINTS = {
  characters: `${API_BASE_URL}/character`,
  episodes: `${API_BASE_URL}/episode`,
  locations: `${API_BASE_URL}/location`
};

// Estado global de la aplicación
let appState = {
  characters: [],
  currentPage: 1,
  totalPages: 1,
  totalCharacters: 0,
  filters: {
    name: '',
    status: '',
    gender: ''
  },
  isLoading: false,
  error: null
};

// Referencias a elementos DOM
let domElements = {};

/**
 * Inicializa la aplicación de personajes
 */
document.addEventListener('DOMContentLoaded', () => {
  initializeDOM();
  setupEventListeners();
  loadCharacters();
});

/**
 * Inicializa referencias a elementos DOM
 */
function initializeDOM() {
  domElements = {
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    statusFilter: document.getElementById('status-filter'),
    genderFilter: document.getElementById('gender-filter'),
    loadingMessage: document.getElementById('loading-message'),
    errorMessage: document.getElementById('error-message'),
    errorDetails: document.getElementById('error-details'),
    retryBtn: document.getElementById('retry-btn'),
    personajesGrid: document.getElementById('personajes-grid'),
    resultadosCount: document.getElementById('resultados-count'),
    paginacion: document.getElementById('paginacion'),
    loadMoreBtn: document.getElementById('load-more-btn')
  };
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
  // Búsqueda
  domElements.searchBtn.addEventListener('click', handleSearch);
  domElements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  // Filtros
  domElements.statusFilter.addEventListener('change', handleFilterChange);
  domElements.genderFilter.addEventListener('change', handleFilterChange);

  // Botones de acción
  domElements.retryBtn.addEventListener('click', handleRetry);
  domElements.loadMoreBtn.addEventListener('click', handleLoadMore);

  // Accesibilidad: búsqueda con debounce
  let searchTimeout;
  domElements.searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (e.target.value.length >= 3 || e.target.value.length === 0) {
        appState.filters.name = e.target.value;
        resetPagination();
        loadCharacters();
      }
    }, 500);
  });
}

/**
 * Maneja la búsqueda de personajes
 */
function handleSearch() {
  const searchTerm = domElements.searchInput.value.trim();
  appState.filters.name = searchTerm;
  resetPagination();
  loadCharacters();
  
  // Enfocar en los resultados para lectores de pantalla
  setTimeout(() => {
    domElements.resultadosCount.focus();
  }, 100);
}

/**
 * Maneja cambios en los filtros
 */
function handleFilterChange() {
  appState.filters.status = domElements.statusFilter.value;
  appState.filters.gender = domElements.genderFilter.value;
  resetPagination();
  loadCharacters();
}

/**
 * Maneja el botón de reintentar
 */
function handleRetry() {
  appState.error = null;
  loadCharacters();
}

/**
 * Maneja el botón de cargar más
 */
function handleLoadMore() {
  appState.currentPage++;
  loadCharacters(true); // true para modo append
}

/**
 * Reinicia la paginación
 */
function resetPagination() {
  appState.currentPage = 1;
  appState.characters = [];
}

/**
 * Función principal para cargar personajes desde la API
 * @param {boolean} append - Si es true, añade a los resultados existentes
 */
async function loadCharacters(append = false) {
  try {
    setLoadingState(true);
    hideError();

    const url = buildAPIUrl();
    console.log('🚀 Fetching characters from:', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Response:', data);

    // Actualizar estado
    if (append) {
      appState.characters = [...appState.characters, ...data.results];
    } else {
      appState.characters = data.results;
    }
    
    appState.totalPages = data.info.pages;
    appState.totalCharacters = data.info.count;

    // Renderizar resultados
    renderCharacters(append);
    updateResultsCount();
    updatePagination(data.info);
    
    // Anunciar cambios a lectores de pantalla
    announceToScreenReader(`Se cargaron ${data.results.length} personajes. Total: ${data.info.count}`);

  } catch (error) {
    console.error('❌ Error loading characters:', error);
    handleAPIError(error);
  } finally {
    setLoadingState(false);
  }
}

/**
 * Construye la URL de la API con filtros y paginación
 */
function buildAPIUrl() {
  const params = new URLSearchParams();
  
  params.append('page', appState.currentPage);
  
  if (appState.filters.name) {
    params.append('name', appState.filters.name);
  }
  
  if (appState.filters.status) {
    params.append('status', appState.filters.status);
  }
  
  if (appState.filters.gender) {
    params.append('gender', appState.filters.gender);
  }

  return `${API_ENDPOINTS.characters}?${params.toString()}`;
}

/**
 * Renderiza los personajes en el DOM
 * @param {boolean} append - Si es true, añade a los resultados existentes
 */
function renderCharacters(append = false) {
  if (!append) {
    domElements.personajesGrid.innerHTML = '';
  }

  appState.characters.slice(append ? -20 : 0).forEach(character => {
    const characterCard = createCharacterCard(character);
    domElements.personajesGrid.appendChild(characterCard);
  });

  // Animar entrada de las nuevas tarjetas
  requestAnimationFrame(() => {
    const newCards = domElements.personajesGrid.querySelectorAll('.personaje-card');
    newCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  });
}

/**
 * Crea una tarjeta de personaje
 * @param {Object} character - Datos del personaje
 */
function createCharacterCard(character) {
  const card = document.createElement('article');
  card.className = 'personaje-card';
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'all 0.3s ease-out';

  const statusClass = `status-${character.status.toLowerCase()}`;
  const statusText = translateStatus(character.status);
  const genderText = translateGender(character.gender);
  const speciesText = translateSpecies(character.species);

  card.innerHTML = `
    <div class="personaje-image">
      <img 
        src="${character.image}" 
        alt="Imagen de ${character.name}"
        loading="lazy"
        onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTRweCIgZmlsbD0iIzlmYTJhNyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+'"
      >
      <span class="personaje-status ${statusClass}" aria-label="Estado: ${statusText}">
        ${statusText}
      </span>
    </div>
    <div class="personaje-content">
      <h3 class="personaje-name">${character.name}</h3>
      <ul class="personaje-details">
        <li>
          <span class="detail-label">Especie:</span>
          <span class="detail-value">${speciesText}</span>
        </li>
        <li>
          <span class="detail-label">Género:</span>
          <span class="detail-value">${genderText}</span>
        </li>
        <li>
          <span class="detail-label">Origen:</span>
          <span class="detail-value">${character.origin.name}</span>
        </li>
        <li>
          <span class="detail-label">Ubicación:</span>
          <span class="detail-value">${character.location.name}</span>
        </li>
        <li>
          <span class="detail-label">Episodios:</span>
          <span class="detail-value">${character.episode.length}</span>
        </li>
      </ul>
    </div>
  `;

  // Agregar evento de clic para mostrar más detalles
  card.addEventListener('click', () => {
    showCharacterDetails(character);
  });

  // Hacer la tarjeta navegable por teclado
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `Ver detalles de ${character.name}`);
  
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showCharacterDetails(character);
    }
  });

  return card;
}

/**
 * Muestra los detalles completos de un personaje
 * @param {Object} character - Datos del personaje
 */
function showCharacterDetails(character) {
  const statusText = translateStatus(character.status);
  const genderText = translateGender(character.gender);
  const speciesText = translateSpecies(character.species);

  const details = `
    Nombre: ${character.name}
    Estado: ${statusText}
    Especie: ${speciesText}
    Género: ${genderText}
    Origen: ${character.origin.name}
    Ubicación actual: ${character.location.name}
    Número de episodios: ${character.episode.length}
  `;

  alert(details);
}

/**
 * Actualiza el contador de resultados
 */
function updateResultsCount() {
  const currentCount = appState.characters.length;
  const totalCount = appState.totalCharacters;
  
  domElements.resultadosCount.textContent = 
    `Mostrando ${currentCount} de ${totalCount} personajes`;
}

/**
 * Actualiza los controles de paginación
 * @param {Object} info - Información de paginación de la API
 */
function updatePagination(info) {
  // Mostrar/ocultar botón de cargar más
  if (info.next) {
    domElements.loadMoreBtn.style.display = 'block';
  } else {
    domElements.loadMoreBtn.style.display = 'none';
  }

  // Generar botones de paginación
  renderPaginationButtons(info);
}

/**
 * Renderiza los botones de paginación
 * @param {Object} info - Información de paginación
 */
function renderPaginationButtons(info) {
  domElements.paginacion.innerHTML = '';

  const totalPages = appState.totalPages;
  const currentPage = appState.currentPage;

  // Botón anterior
  const prevBtn = createPageButton('◀ Anterior', currentPage - 1, currentPage === 1);
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      appState.currentPage = currentPage - 1;
      loadCharacters();
    }
  });
  domElements.paginacion.appendChild(prevBtn);

  // Páginas numeradas (mostrar máximo 5)
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = createPageButton(i.toString(), i, false, i === currentPage);
    pageBtn.addEventListener('click', () => {
      appState.currentPage = i;
      resetPagination();
      appState.currentPage = i;
      loadCharacters();
    });
    domElements.paginacion.appendChild(pageBtn);
  }

  // Botón siguiente
  const nextBtn = createPageButton('Siguiente ▶', currentPage + 1, currentPage === totalPages);
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      appState.currentPage = currentPage + 1;
      loadCharacters();
    }
  });
  domElements.paginacion.appendChild(nextBtn);
}

/**
 * Crea un botón de paginación
 * @param {string} text - Texto del botón
 * @param {number} page - Número de página
 * @param {boolean} disabled - Si está deshabilitado
 * @param {boolean} active - Si está activo
 */
function createPageButton(text, page, disabled = false, active = false) {
  const button = document.createElement('button');
  button.className = 'page-btn';
  button.textContent = text;
  button.disabled = disabled;
  
  if (active) {
    button.classList.add('active');
    button.setAttribute('aria-current', 'page');
  }
  
  button.setAttribute('aria-label', `Ir a la página ${page}`);
  
  return button;
}

/**
 * Maneja errores de la API
 * @param {Error} error - Error capturado
 */
function handleAPIError(error) {
  appState.error = error;
  
  let errorMessage = 'Error desconocido al cargar los personajes.';
  
  if (error.message.includes('404')) {
    errorMessage = 'No se encontraron personajes con los filtros aplicados.';
  } else if (error.message.includes('Failed to fetch')) {
    errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
  } else if (error.message.includes('HTTP')) {
    errorMessage = `Error del servidor: ${error.message}`;
  }
  
  showError(errorMessage);
  
  // Limpiar resultados en caso de error
  domElements.personajesGrid.innerHTML = `
    <div class="no-results">
      <h3>No se pudieron cargar los personajes</h3>
      <p>Intenta recargar la página o ajustar los filtros de búsqueda.</p>
    </div>
  `;
}

/**
 * Muestra mensaje de error
 * @param {string} message - Mensaje de error
 */
function showError(message) {
  domElements.errorDetails.textContent = message;
  domElements.errorMessage.style.display = 'block';
  
  // Enfocar en el mensaje de error para accesibilidad
  domElements.errorMessage.focus();
}

/**
 * Oculta mensaje de error
 */
function hideError() {
  domElements.errorMessage.style.display = 'none';
}

/**
 * Controla el estado de carga
 * @param {boolean} loading - Si está cargando
 */
function setLoadingState(loading) {
  appState.isLoading = loading;
  
  if (loading) {
    domElements.loadingMessage.style.display = 'flex';
    domElements.loadMoreBtn.disabled = true;
  } else {
    domElements.loadingMessage.style.display = 'none';
    domElements.loadMoreBtn.disabled = false;
  }
}

/**
 * Anuncia cambios a lectores de pantalla
 * @param {string} message - Mensaje a anunciar
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remover después de un tiempo
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ===========================================
// FUNCIONES DE UTILIDAD
// ===========================================

/**
 * Traduce el estado del personaje
 * @param {string} status - Estado en inglés
 */
function translateStatus(status) {
  const translations = {
    'Alive': 'Vivo',
    'Dead': 'Muerto',
    'unknown': 'Desconocido'
  };
  return translations[status] || status;
}

/**
 * Traduce el género del personaje
 * @param {string} gender - Género en inglés
 */
function translateGender(gender) {
  const translations = {
    'Male': 'Masculino',
    'Female': 'Femenino',
    'Genderless': 'Sin género',
    'unknown': 'Desconocido'
  };
  return translations[gender] || gender;
}

/**
 * Traduce la especie del personaje
 * @param {string} species - Especie en inglés
 */
function translateSpecies(species) {
  const translations = {
    'Human': 'Humano',
    'Alien': 'Alienígena',
    'Humanoid': 'Humanoide',
    'Robot': 'Robot',
    'Animal': 'Animal',
    'Cronenberg': 'Cronenberg',
    'Disease': 'Enfermedad',
    'unknown': 'Desconocido'
  };
  return translations[species] || species;
}

// ===========================================
// MANEJO DE ERRORES GLOBALES
// ===========================================

window.addEventListener('error', (event) => {
  console.error('❌ Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Unhandled promise rejection:', event.reason);
  event.preventDefault();
});

// ===========================================
// EXPORTAR PARA TESTING (SI ES NECESARIO)
// ===========================================

// Solo para propósitos de desarrollo/testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    loadCharacters,
    buildAPIUrl,
    translateStatus,
    translateGender,
    translateSpecies
  };
}
