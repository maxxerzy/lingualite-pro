import { getDecks, getCurrentSession, setCurrentSession, getUserStats, setUserStats } from './state.js';
import { updateProgress } from './progress.js';
import { updateStats } from './stats.js';
import { shuffleArray } from '../utils/helpers.js';

// Start a learning session
export function startSession() {
  const deckId = document.getElementById('deckSelect').value;
  const decks = getDecks();
  const deck = decks[deckId];
  
  if (!deck) {
    alert('Bitte wählen Sie ein gültiges Deck aus.');
    return;
  }
  
  // Create a session with the selected deck
  const session = {
    deck: deck,
    cards: [...deck.cards], // Copy of cards
    currentIndex: 0,
    correctAnswers: 0,
    currentPrompt: null
  };
  
  // Shuffle the cards
  session.cards = shuffleArray(session.cards);
  setCurrentSession(session);
  
  // Update UI
  document.getElementById('session-title').textContent = `Lernsession: ${deck.name}`;
  updateProgress();
  
  // Show first card
  showNextCard();
}

// Show the next card in the session
export function showNextCard() {
  const currentSession = getCurrentSession();
  if (!currentSession || currentSession.currentIndex >= currentSession.cards.length) {
    endSession();
    return;
  }
  
  const card = currentSession.cards[currentSession.currentIndex];
  const prompt = createComparisonPrompt(card, currentSession.cards);
  renderComparisonCard(card, prompt);
  currentSession.currentIndex++;
  currentSession.currentPrompt = { ...prompt, card };
  setCurrentSession(currentSession);
  updateProgress();
}

function createComparisonPrompt(card, cards) {
  if (cards.length <= 1) {
    return { translation: card.back, isMatch: true };
  }

  const shouldMatch = Math.random() < 0.5;
  if (shouldMatch) {
    return { translation: card.back, isMatch: true };
  }

  const alternatives = cards.filter(candidate => candidate.back !== card.back);
  if (alternatives.length === 0) {
    return { translation: card.back, isMatch: true };
  }

  const randomIndex = Math.floor(Math.random() * alternatives.length);
  return { translation: alternatives[randomIndex].back, isMatch: false };
}

// Render a comparison card
function renderComparisonCard(card, prompt) {
  const learnArea = document.getElementById('learnArea');
  learnArea.innerHTML = `
    <div class="q">${card.front}</div>
    <p class="prompt">Stimmt diese Übersetzung?</p>
    <div class="comparison-card">
      <span class="word word-source">${card.front}</span>
      <i class="fas fa-arrow-right"></i>
      <span class="word word-target">${prompt.translation}</span>
    </div>
    <div class="actions">
      <button type="button" class="btn btn-primary" id="answerMatch">Passt</button>
      <button type="button" class="btn btn-secondary" id="answerMismatch">Passt nicht</button>
      <button type="button" class="btn" id="skipCard">Überspringen</button>
    </div>
    <div id="fb"></div>
  `;

  document.getElementById('answerMatch').addEventListener('click', () => {
    checkComparisonAnswer(true);
  });

  document.getElementById('answerMismatch').addEventListener('click', () => {
    checkComparisonAnswer(false);
  });

  document.getElementById('skipCard').addEventListener('click', () => {
    showNextCard();
  });
}

// Check the comparison answer
function checkComparisonAnswer(userSaysMatch) {
  const feedback = document.getElementById('fb');
  const currentSession = getCurrentSession();
  const userStats = getUserStats();
  const prompt = currentSession?.currentPrompt;

  if (!prompt) {
    return;
  }

  document.querySelectorAll('#learnArea .actions button').forEach(button => {
    button.disabled = true;
  });

  const isCorrect = userSaysMatch === prompt.isMatch;

  if (isCorrect) {
    feedback.innerHTML = `
      <div class="correct">
        <p>✅ Richtig!</p>
        <p>Richtige Zuordnung: <b>${prompt.card.front}</b> → <b>${prompt.card.back}</b></p>
      </div>
      <div class="actions" style="margin-top: 16px;">
        <button type="button" class="btn btn-primary" id="nextCard">Weiter</button>
      </div>
    `;
    currentSession.correctAnswers++;
    userStats.learnedWords++;
  } else {
    feedback.innerHTML = `
      <div class="incorrect">
        <p>❌ Falsch!</p>
        <p>Korrekt wäre: <b>${prompt.card.front}</b> → <b>${prompt.card.back}</b></p>
      </div>
      <div class="actions" style="margin-top: 16px;">
        <button type="button" class="btn btn-primary" id="nextCard">Weiter</button>
      </div>
    `;
  }

  userStats.successRate = Math.round((currentSession.correctAnswers / currentSession.currentIndex) * 100);
  setUserStats(userStats);
  updateStats();
  currentSession.currentPrompt = null;
  setCurrentSession(currentSession);

  document.getElementById('nextCard').addEventListener('click', showNextCard);
}

// End the current session
function endSession() {
  const currentSession = getCurrentSession();
  const learnArea = document.getElementById('learnArea');
  learnArea.innerHTML = `
    <h3>Session beendet!</h3>
    <p>Du hast ${currentSession.correctAnswers} von ${currentSession.cards.length} Karten richtig beantwortet.</p>
    <p>Erfolgsrate: ${Math.round((currentSession.correctAnswers / currentSession.cards.length) * 100)}%</p>
    <div class="actions">
      <button type="button" class="btn btn-primary" id="restartSession">Noch einmal</button>
    </div>
  `;
  
  document.getElementById('restartSession').addEventListener('click', startSession);
  setCurrentSession(null);
}
