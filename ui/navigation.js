import { getDecks } from '../core/state.js';

// Initialize navigation
export function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const views = document.querySelectorAll('.view');
  
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const viewId = button.getAttribute('data-view');
      
      // Update active button
      navButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Show selected view
      views.forEach(view => view.classList.remove('active'));
      document.getElementById(`view-${viewId}`).classList.add('active');
    });
  });
}

// Initialize decks view
export function initDecksView() {
  renderDecks('all');
}

// Filter decks by language
export function filterDecksByLanguage(lang) {
  renderDecks(lang);
}

function renderDecks(languageFilter) {
  const deckList = document.getElementById('deckList');
  const fragment = document.createDocumentFragment();
  const entries = Object.entries(getDecks()).sort(([, a], [, b]) =>
    a.name.localeCompare(b.name, 'de')
  );
  let hasDecks = false;

  entries.forEach(([id, deck]) => {
    if (languageFilter !== 'all' && deck.language !== languageFilter) {
      return;
    }

    const deckItem = document.createElement('div');
    deckItem.className = 'deck-item';
    deckItem.innerHTML = `
      <h3>${deck.name}</h3>
      <p>${deck.cards.length} Karten • Sprache: ${getLanguageName(deck.language)}</p>
      <button class="btn btn-primary">
        <i class="fas fa-play"></i> Lernsession starten
      </button>
    `;

    const startButton = deckItem.querySelector('button');
    startButton.addEventListener('click', () => {
      selectDeck(id);
    });

    fragment.appendChild(deckItem);
    hasDecks = true;
  });

  if (hasDecks) {
    deckList.replaceChildren(fragment);
  } else {
    deckList.innerHTML = `
      <div class="empty-state">
        <p>Für diese Sprache sind aktuell keine Decks verfügbar.</p>
      </div>
    `;
  }
}

function selectDeck(deckId) {
  const deckSelect = document.getElementById('deckSelect');
  if (deckSelect) {
    deckSelect.value = deckId;
  }

  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('[data-view="learn"]').classList.add('active');
  document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
  document.getElementById('view-learn').classList.add('active');
}

// Get language name from code
function getLanguageName(code) {
  const languages = {
    da: 'Dänisch'
  };
  return languages[code] || code;
}
