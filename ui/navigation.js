import { getDecks } from '../data/decks.js';

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
  const decks = getDecks();
  const deckList = document.getElementById('deckList');
  deckList.innerHTML = '';
  
  for (const [id, deck] of Object.entries(decks)) {
    const deckItem = document.createElement('div');
    deckItem.className = 'deck-item';
    deckItem.innerHTML = `
      <h3>${deck.name}</h3>
      <p>${deck.cards.length} Karten • Sprache: ${getLanguageName(deck.language)}</p>
      <button class="btn btn-primary" data-deck="${id}">
        <i class="fas fa-play"></i> Lernsession starten
      </button>
    `;
    deckList.appendChild(deckItem);
  }
  
  // Add event listeners to deck buttons
  document.querySelectorAll('[data-deck]').forEach(button => {
    button.addEventListener('click', () => {
      const deckId = button.getAttribute('data-deck');
      document.getElementById('deckSelect').value = deckId;
      document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelector('[data-view="learn"]').classList.add('active');
      document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
      document.getElementById('view-learn').classList.add('active');
    });
  });
}

// Filter decks by language
export function filterDecksByLanguage(lang) {
  const decks = getDecks();
  const deckList = document.getElementById('deckList');
  deckList.innerHTML = '';
  
  for (const [id, deck] of Object.entries(decks)) {
    if (lang === 'all' || deck.language === lang) {
      const deckItem = document.createElement('div');
      deckItem.className = 'deck-item';
      deckItem.innerHTML = `
        <h3>${deck.name}</h3>
        <p>${deck.cards.length} Karten • Sprache: ${getLanguageName(deck.language)}</p>
        <button class="btn btn-primary" data-deck="${id}">
          <i class="fas fa-play"></i> Lernsession starten
        </button>
      `;
      deckList.appendChild(deckItem);
    }
  }
  
  // Re-add event listeners to deck buttons
  document.querySelectorAll('[data-deck]').forEach(button => {
    button.addEventListener('click', () => {
      const deckId = button.getAttribute('data-deck');
      document.getElementById('deckSelect').value = deckId;
      document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelector('[data-view="learn"]').classList.add('active');
      document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
      document.getElementById('view-learn').classList.add('active');
    });
  });
}

// Get language name from code
function getLanguageName(code) {
  const languages = {
    'en': 'Englisch',
    'es': 'Spanisch',
    'fr': 'Französisch'
  };
  return languages[code] || code;
}