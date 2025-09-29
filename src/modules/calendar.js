import { escapeHTML } from '../utils/stringUtils.js';
import { appendNote, readNotes } from '../utils/storage.js';

export function setupCalendar(doc, flatpickrInstance, locale) {
  const calendarInput = doc.getElementById('calendar-input');
  const modal = doc.getElementById('calendar-modal');
  const modalDate = doc.getElementById('modal-date');
  const modalNotesDisplay = doc.getElementById('modal-notes-display');
  const modalNoteForm = doc.getElementById('modal-note-form');
  const modalNameInput = doc.getElementById('modal-name-input');
  const modalNoteInput = doc.getElementById('modal-note-input');
  const modalCloseButton = doc.getElementById('modal-close-btn');
  const modalFeedback = doc.getElementById('modal-feedback');

  let currentSelectedDate = null;

  function displayNotesForDate(date) {
    const notes = readNotes(date);

    if (!modalNotesDisplay) {
      return;
    }

    modalNotesDisplay.innerHTML = '';

    if (notes.length === 0) {
      modalNotesDisplay.innerHTML =
        '<p class="text-gray-500 italic text-center py-4">Brak notatek dla tego dnia. Dodaj pierwszą czerwoną flagę!</p>';
      return;
    }

    notes.forEach((note) => {
      const container = doc.createElement('div');
      container.className = 'bg-gray-800 p-3 rounded-lg border border-gray-600';
      container.innerHTML = `
        <div class="flex justify-between items-start mb-2">
          <strong class="text-amber-400">${escapeHTML(note.name)}</strong>
          <span class="text-xs text-gray-500">${escapeHTML(new Date(note.timestamp).toLocaleString('pl-PL'))}</span>
        </div>
        <p class="text-gray-300 whitespace-pre-wrap">${escapeHTML(note.text)}</p>
      `;
      modalNotesDisplay.appendChild(container);
    });
  }

  function closeModal() {
    modal?.classList.add('hidden');
    doc.documentElement.classList.remove('modal-open');
    modalFeedback?.classList.remove('text-green-500', 'text-red-500');
    if (modalFeedback) {
      modalFeedback.textContent = '';
    }
    modalNoteForm?.reset();
    calendarInput?.focus();
  }

  function showModal(date) {
    if (modal && modalDate) {
      modal.classList.remove('hidden');
      modalDate.textContent = date.toLocaleDateString('pl-PL');
      doc.documentElement.classList.add('modal-open');
    }
  }

  if (calendarInput) {
    flatpickrInstance(calendarInput, {
      locale,
      inline: false,
      dateFormat: 'Y-m-d',
      onChange: (selectedDates, dateString) => {
        if (selectedDates.length === 0) {
          return;
        }

        currentSelectedDate = dateString;
        displayNotesForDate(dateString);
        showModal(selectedDates[0]);
        modalNameInput?.focus();
      }
    });
  }

  modalNoteForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!currentSelectedDate) {
      return;
    }

    const name = modalNameInput?.value.trim();
    const text = modalNoteInput?.value.trim();

    if (!name || !text) {
      if (modalFeedback) {
        modalFeedback.textContent = 'Imię i treść notatki są wymagane.';
        modalFeedback.className = 'text-red-500 text-sm mt-2 min-h-[1.25rem]';
      }
      return;
    }

    try {
      appendNote(currentSelectedDate, {
        name,
        text,
        timestamp: new Date().toISOString()
      });

      if (modalFeedback) {
        modalFeedback.textContent = 'Notatka dodana pomyślnie!';
        modalFeedback.className = 'text-green-500 text-sm mt-2 min-h-[1.25rem]';
      }

      modalNoteForm.reset();
      displayNotesForDate(currentSelectedDate);
    } catch (error) {
      console.error('Błąd dodawania notatki:', error);
      if (modalFeedback) {
        modalFeedback.textContent = `Błąd: ${error.message}`;
        modalFeedback.className = 'text-red-500 text-sm mt-2 min-h-[1.25rem]';
      }
    }
  });

  modalCloseButton?.addEventListener('click', closeModal);

  doc.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  return {
    closeModal,
    displayNotesForDate
  };
}
