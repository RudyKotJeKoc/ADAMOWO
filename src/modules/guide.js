import { guideSections } from '../data/guideSections.js';
import { escapeHTML } from '../utils/stringUtils.js';
import { readCompletedSections, saveCompletedSections } from '../utils/storage.js';

function renderGuideSection(section, index, total) {
  return `
    <article class="guide-section bg-gray-900/50 p-6 rounded-xl border-l-4 border-red-800 transition-all duration-300" data-section="${section.id}">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-red-300 special-elite">Grzech ${section.id}: ${escapeHTML(section.title)}</h3>
        <div class="flex items-center space-x-3">
          <button class="quiz-btn bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition">
            <i class="fas fa-question-circle mr-1"></i>Quiz
          </button>
          <div class="completion-indicator w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center">
            <i class="fas fa-check text-green-400 text-sm hidden"></i>
          </div>
        </div>
      </div>
      <p class="mb-4 text-gray-300"><strong>Opis:</strong> ${escapeHTML(section.description)}</p>
      <div class="bg-gray-800/50 p-4 rounded-lg border-l-2 border-amber-500 mb-4">
        <p class="italic text-amber-200"><strong>Przykład z życia:</strong> ${escapeHTML(section.example)}</p>
      </div>
      <div class="mt-4">
        <h4 class="font-bold text-amber-400 mb-3 flex items-center">
          <i class="fas fa-exclamation-triangle mr-2"></i>Jak wykryć:
        </h4>
        <ul class="space-y-2">
          ${section.redFlags
            .map(
              (flag) => `
                <li class="flex items-start text-gray-300">
                  <i class="fas fa-flag text-red-400 mr-3 mt-1 flex-shrink-0"></i>
                  <span>${escapeHTML(flag)}</span>
                </li>
              `
            )
            .join('')}
        </ul>
      </div>
      <div class="mt-6 flex justify-between items-center">
        <button class="mark-complete-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
          <i class="fas fa-check mr-2"></i>Oznacz jako przeczytane
        </button>
        <div class="text-sm text-gray-500">Sekcja ${index + 1} z ${total}</div>
      </div>
    </article>
  `;
}

export function setupGuide(doc) {
  const container = doc.getElementById('guide-sections');
  const progressBar = doc.getElementById('learning-progress');
  const progressText = doc.getElementById('progress-percentage');
  const completedText = doc.getElementById('completed-sections');

  if (!container) {
    return;
  }

  container.innerHTML = guideSections
    .map((section, index) => renderGuideSection(section, index, guideSections.length))
    .join('');

  function updateSectionUi(sectionId) {
    const sectionElement = doc.querySelector(`[data-section="${sectionId}"]`);
    if (!sectionElement) {
      return;
    }

    const indicator = sectionElement.querySelector('.completion-indicator');
    const checkIcon = indicator?.querySelector('i');

    indicator?.classList.remove('border-gray-600');
    indicator?.classList.add('border-green-400', 'bg-green-400/20');
    checkIcon?.classList.remove('hidden');
  }

  function updateLearningProgress() {
    const completedSections = readCompletedSections();
    const completedCount = completedSections.length;
    const percentage = Math.round((completedCount / guideSections.length) * 100);

    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
    }

    if (progressText) {
      progressText.textContent = `${percentage}%`;
    }

    if (completedText) {
      completedText.textContent = completedCount;
    }

    completedSections.forEach(updateSectionUi);
  }

  function markSectionComplete(sectionId) {
    const completedSections = new Set(readCompletedSections());
    completedSections.add(sectionId);
    const serialised = Array.from(completedSections);
    saveCompletedSections(serialised);
    updateSectionUi(sectionId);
    updateLearningProgress();
  }

  function startQuiz(sectionId) {
    const section = guideSections.find((item) => item.id === sectionId);
    if (!section) {
      return;
    }

    const questions = [
      `Czy potrafisz rozpoznać sytuację opisaną w "${section.title}"?`,
      'Jak byś zareagował/a w takiej sytuacji?',
      'Jakie są najważniejsze czerwone flagi w tym przypadku?'
    ];

    const answers = window.prompt(
      `Quiz - ${section.title}\n\n${questions[0]}\n\nA) Tak, potrafię\nB) Nie jestem pewien/a\nC) Nie, potrzebuję więcej informacji`
    );

    if (answers) {
      alert('Dziękujemy za udział w quizie! Pamiętaj, że rozpoznawanie manipulacji to proces, który wymaga czasu i praktyki.');
      markSectionComplete(sectionId);
    }
  }

  container.querySelectorAll('.mark-complete-btn').forEach((button, index) => {
    button.addEventListener('click', () => markSectionComplete(index + 1));
  });

  container.querySelectorAll('.quiz-btn').forEach((button, index) => {
    button.addEventListener('click', () => startQuiz(index + 1));
  });

  updateLearningProgress();
}
