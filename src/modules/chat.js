import { aiResponses } from '../data/aiResponses.js';
import { escapeHTML } from '../utils/stringUtils.js';

export function setupChat(doc) {
  const chatForm = doc.getElementById('chat-form');
  const chatInput = doc.getElementById('chat-input');
  const chatContainer = doc.getElementById('chat-container');
  const chatReset = doc.getElementById('chat-reset');
  const chatAnalyze = doc.getElementById('chat-analyze');
  const chatAnalysis = doc.getElementById('chat-analysis');
  const analysisContent = doc.getElementById('analysis-content');

  const chatHistory = [];

  function addChatMessage(sender, message, isUser = false) {
    if (!chatContainer) {
      return;
    }

    const messageWrapper = doc.createElement('div');
    messageWrapper.className = isUser ? 'text-right' : 'text-left';

    const content = doc.createElement('div');
    content.className = 'flex items-start space-x-3';

    if (!isUser) {
      content.innerHTML = `
        <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
          <i class="fas fa-user text-white text-sm"></i>
        </div>
        <div class="bg-gray-700 text-gray-200 px-4 py-3 rounded-lg max-w-xs">
          <strong>Manipulator (AI):</strong> ${escapeHTML(message)}
        </div>
      `;
    } else {
      content.innerHTML = `
        <div class="bg-amber-500 text-black px-4 py-3 rounded-lg max-w-xs ml-auto">
          <strong>Ty:</strong> ${escapeHTML(message)}
        </div>
      `;
    }

    messageWrapper.appendChild(content);
    chatContainer.appendChild(messageWrapper);

    if (chatContainer.children.length > 20) {
      chatContainer.removeChild(chatContainer.firstChild);
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  chatForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = chatInput?.value.trim();

    if (!message) {
      return;
    }

    addChatMessage('Użytkownik', message, true);
    chatHistory.push({ sender: 'user', message });

    setTimeout(() => {
      const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      addChatMessage('AI', response.text, false);
      chatHistory.push({ sender: 'ai', message: response.text, technique: response.technique });
    }, 1200);

    if (chatInput) {
      chatInput.value = '';
    }
  });

  chatReset?.addEventListener('click', () => {
    chatHistory.length = 0;

    if (chatContainer) {
      chatContainer.innerHTML = `
        <div class="text-left">
          <div class="flex items-start space-x-3">
            <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fas fa-user text-white text-sm"></i>
            </div>
            <div class="bg-gray-700 text-gray-200 px-4 py-3 rounded-lg max-w-xs">
              <strong>Manipulator (AI):</strong> Czekam... Przecież wiem, że chcesz porozmawiać.
            </div>
          </div>
        </div>
      `;
    }

    chatAnalysis?.classList.add('hidden');
  });

  chatAnalyze?.addEventListener('click', () => {
    if (chatHistory.length === 0) {
      alert('Najpierw przeprowadź rozmowę z AI, aby móc ją przeanalizować.');
      return;
    }

    const techniques = [...new Set(chatHistory.filter((entry) => entry.technique).map((entry) => entry.technique))];

    if (analysisContent) {
      analysisContent.innerHTML = `
        <p class="mb-4">W tej rozmowie AI użyło następujących technik manipulacji:</p>
        <ul class="space-y-2">
          ${techniques
            .map(
              (technique) => `
                <li class="flex items-center">
                  <i class="fas fa-exclamation-triangle text-red-400 mr-2"></i>
                  <span class="font-semibold text-red-300">${escapeHTML(technique)}</span>
                </li>
              `
            )
            .join('')}
        </ul>
        <div class="mt-6 p-4 bg-blue-900/30 rounded-lg">
          <h5 class="font-bold text-blue-300 mb-2">Wskazówki:</h5>
          <p class="text-sm">
            Rozpoznanie tych technik to pierwszy krok do obrony przed manipulacją. W prawdziwej sytuacji pamiętaj o dokumentowaniu takich zachowań i szukaniu wsparcia.
          </p>
        </div>
      `;
    }

    chatAnalysis?.classList.remove('hidden');
  });
}
