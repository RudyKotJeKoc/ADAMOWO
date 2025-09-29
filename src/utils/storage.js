const NOTES_KEY_PREFIX = 'notes_';
const COMPLETED_SECTIONS_KEY = 'completedSections';

export function readNotes(dateKey) {
  if (!dateKey) {
    return [];
  }

  try {
    const raw = localStorage.getItem(`${NOTES_KEY_PREFIX}${dateKey}`);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Nie udało się odczytać notatek z localStorage:', error);
    return [];
  }
}

export function appendNote(dateKey, note) {
  const notes = readNotes(dateKey);
  notes.push(note);
  localStorage.setItem(`${NOTES_KEY_PREFIX}${dateKey}`, JSON.stringify(notes));
}

export function readCompletedSections() {
  try {
    const raw = localStorage.getItem(COMPLETED_SECTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Nie udało się odczytać postępów użytkownika:', error);
    return [];
  }
}

export function saveCompletedSections(sectionIds) {
  localStorage.setItem(COMPLETED_SECTIONS_KEY, JSON.stringify(sectionIds));
}
