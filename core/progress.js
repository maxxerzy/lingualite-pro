import { getCurrentSession } from './state.js';

// Update progress indicator
export function updateProgress() {
  const currentSession = getCurrentSession();
  if (!currentSession) {
    document.getElementById('progress-text').textContent = '0/0 Karten';
    document.getElementById('progress-bar').style.width = '0%';
    return;
  }
  
  const progressText = `${currentSession.currentIndex}/${currentSession.cards.length} Karten`;
  const progressPercent = (currentSession.currentIndex / currentSession.cards.length) * 100;
  
  document.getElementById('progress-text').textContent = progressText;
  document.getElementById('progress-bar').style.width = `${progressPercent}%`;
}