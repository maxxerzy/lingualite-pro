import { decks } from './data/decks.js';
import { initNavigation, initDecksView, filterDecksByLanguage } from './ui/navigation.js';
import { initSettings, handleImport, handleExport } from './ui/settings.js';
import { startSession, showNextCard } from './core/session.js';
import { updateStats } from './core/stats.js';

// Application state
let currentSession = null;
let userStats = {
  learnedWords: 0,
  activeDays: 1,
  successRate: 0
};

// Export state for other modules
export function getCurrentSession() {
  return currentSession;
}

export function setCurrentSession(session) {
  currentSession = session;
}

export function getUserStats() {
  return userStats;
}

export function setUserStats(stats) {
  userStats = stats;
  updateStats();
}

export function getDecks() {
  return decks;
}

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the application
  initNavigation();
  initDecksView();
  updateStats();
  initSettings();

  // Set up event listeners
  document.getElementById('startBtn').addEventListener('click', startSession);
  
  // Language tabs
  document.querySelectorAll('.lang-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.lang-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterDecksByLanguage(tab.dataset.lang);
    });
  });
  
  // Make functions available globally for HTML onclick attributes
  window.handleImport = handleImport;
  window.handleExport = handleExport;
});