import { getUserStats } from './state.js';

// Update statistics display
export function updateStats() {
  const userStats = getUserStats();
  document.getElementById('learned-words').textContent = userStats.learnedWords;
  document.getElementById('active-days').textContent = userStats.activeDays;
  document.getElementById('success-rate').textContent = `${userStats.successRate}%`;
}