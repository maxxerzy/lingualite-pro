import { getDecks } from '../data/decks.js';

// Initialize settings
export function initSettings() {
  document.getElementById('importBtn').addEventListener('click', handleImport);
  document.getElementById('exportBtn').addEventListener('click', handleExport);
}

// Handle import
export function handleImport() {
  const fileInput = document.getElementById('importFile');
  const file = fileInput.files[0];
  
  if (!file) {
    alert('Bitte wählen Sie eine JSON-Datei aus.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const deckData = JSON.parse(e.target.result);
      // In a real application, you would add this to your decks object
      alert(`Deck "${deckData.name}" erfolgreich importiert!`);
      // Reset file input
      fileInput.value = '';
    } catch (error) {
      alert('Fehler beim Importieren: Ungültiges JSON-Format.');
    }
  };
  reader.readAsText(file);
}

// Handle export
export function handleExport() {
  const decks = getDecks();
  // In a real application, you would export the actual data
  const dataStr = JSON.stringify(decks['basic-en'], null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'lingualite_export.json';
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}