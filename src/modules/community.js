import { communityVoices } from '../data/communityVoices.js';
import { escapeHTML } from '../utils/stringUtils.js';

export function renderCommunityVoices(doc) {
  const container = doc.getElementById('community-voices');
  if (!container) {
    return;
  }

  container.innerHTML = communityVoices
    .map(
      (voice) => `
        <div class="border-b border-gray-700 pb-4">
          <div class="flex justify-between items-start mb-2">
            <strong class="text-amber-400">${escapeHTML(voice.name)}</strong>
            <span class="text-xs text-gray-500">${escapeHTML(voice.timestamp)}</span>
          </div>
          <p class="text-gray-300 italic">&quot;${escapeHTML(voice.message)}&quot;</p>
        </div>
      `
    )
    .join('');
}
