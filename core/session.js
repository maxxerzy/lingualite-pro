import { getDecks, getCurrentSession, setCurrentSession, getUserStats, setUserStats } from './state.js';
import { updateProgress } from './progress.js';
import { updateStats } from './stats.js';
import { shuffleArray, normalizeText } from '../utils/helpers.js';

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
    correctAnswers: 0
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
  renderPuzzleCard(card);
  currentSession.currentIndex++;
  setCurrentSession(currentSession);
  updateProgress();
}

// Render a puzzle card
function renderPuzzleCard(card) {
  const learnArea = document.getElementById('learnArea');
  const target = card.example || card.back;
  const tokens = target.split(/\s+/).filter(word => word.length > 0);
  const shuffledTokens = shuffleArray([...tokens]);
  
  learnArea.innerHTML = `
    <div class="q">${card.front}</div>
    <div id="bank">${shuffledTokens.map(token => 
      `<button type="button" class="token-btn">${token}</button>`
    ).join('')}</div>
    <div id="assembled"></div>
    <div class="actions">
      <button type="button" class="btn btn-primary" id="checkPuzzle">Prüfen</button>
      <button type="button" class="btn btn-secondary" id="skipCard">Überspringen</button>
    </div>
    <div id="fb"></div>
  `;
  
  // Add event listeners to token buttons
  document.querySelectorAll('.token-btn').forEach(button => {
    button.addEventListener('click', function() {
      const assembled = document.getElementById('assembled');
      const wordToken = document.createElement('span');
      wordToken.className = 'word-token';
      wordToken.textContent = this.textContent;
      wordToken.dataset.originalIndex = Array.from(this.parentNode.children).indexOf(this);
      
      // Add click event to move word back to bank
      wordToken.addEventListener('click', function() {
        const originalIndex = this.dataset.originalIndex;
        const bank = document.getElementById('bank');
        const originalButton = bank.children[originalIndex];
        
        // Re-enable the original button
        originalButton.disabled = false;
        
        // Remove the word token
        this.remove();
      });
      
      assembled.appendChild(wordToken);
      this.disabled = true;
    });
  });
  
  // Add event listener to check button
  document.getElementById('checkPuzzle').addEventListener('click', function() {
    checkPuzzleAnswer(card, target);
  });
  
  // Add event listener to skip button
  document.getElementById('skipCard').addEventListener('click', function() {
    showNextCard();
  });
}

// Check the puzzle answer
function checkPuzzleAnswer(card, target) {
  const assembled = document.getElementById('assembled');
  const feedback = document.getElementById('fb');
  const userAnswer = Array.from(assembled.children)
    .map(token => token.textContent)
    .join(' ')
    .trim();
  
  const currentSession = getCurrentSession();
  const userStats = getUserStats();
  
  if (normalizeText(userAnswer) === normalizeText(target)) {
    feedback.innerHTML = `
      <div class="correct">
        <p>✅ Richtig!</p>
        <p>Lösung: <b>${target}</b></p>
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
        <p>Deine Antwort: <b>${userAnswer}</b></p>
        <p>Richtige Lösung: <b>${target}</b></p>
      </div>
      <div class="actions" style="margin-top: 16px;">
        <button type="button" class="btn btn-primary" id="nextCard">Weiter</button>
      </div>
    `;
  }
  
  userStats.successRate = Math.round((currentSession.correctAnswers / currentSession.currentIndex) * 100);
  setUserStats(userStats);
  updateStats();
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
