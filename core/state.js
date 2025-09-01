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
}