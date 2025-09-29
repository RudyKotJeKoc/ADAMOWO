import { createTitleFromFilename, escapeHTML } from '../utils/stringUtils.js';
import { shuffleInPlace } from '../utils/arrayUtils.js';

const PLAYLIST_SOURCE = '/data/playlist.json';
const PODCAST_CATEGORY_TITLES = {
  barbara: [
    'Analiza Głosów Barbary: Studium Przypadku',
    'Sekretne Nagrania: Co Ukrywa Barbara?',
    'Psychologia Manipulacji: Przypadek Barbary',
    'Kluczowe Dowody w Sprawie Barbary'
  ],
  kids: [
    'Dziecięce Piosenki jako Narzędzie Kontroli',
    'Infantylizacja w Toksycznych Relacjach',
    'Analiza: Kiedy Niewinność Staje Się Bronią'
  ],
  ambient: [
    'Atmosfera Strachu: Soundscape Manipulacji',
    'Dźwięki Ciszy: Co Słychać w Domu Przemocy',
    'Ambient Terror: Muzyka Jako Narzędzie Kontroli'
  ]
};

const PODCAST_CATEGORIES = ['barbara', 'kids'];

function getElements(doc) {
  return {
    radioPlayer: doc.getElementById('radio-player'),
    radioCurrentSong: doc.getElementById('radio-current-song'),
    radioPlayPauseButton: doc.getElementById('radio-play-pause-btn'),
    radioPlayIcon: doc.getElementById('radio-play-icon'),
    radioPauseIcon: doc.getElementById('radio-pause-icon'),
    radioNextButton: doc.getElementById('radio-next-btn'),
    radioPreviousButton: doc.getElementById('radio-prev-btn'),
    radioVisualizer: doc.getElementById('radio-visualizer'),
    radioProgress: doc.getElementById('radio-progress'),
    volumeSlider: doc.getElementById('volume-slider'),
    qualitySelector: doc.getElementById('quality-selector'),
    podcastPlayer: doc.getElementById('podcast-player'),
    podcastTitle: doc.getElementById('podcast-title'),
    podcastPlayerContainer: doc.getElementById('podcast-player-container'),
    podcastGrid: doc.getElementById('podcast-grid')
  };
}

function mapPlaylistToRadioTracks(fullPlaylist) {
  return fullPlaylist
    .filter((track) => ['ambient', 'hiphop', 'disco'].includes(track.category))
    .map((track) => ({
      ...track,
      title: createTitleFromFilename(track.file),
      url: track.file
    }));
}

function buildPodcastEntries(fullPlaylist) {
  const podcasts = [];

  PODCAST_CATEGORIES.forEach((category, categoryIndex) => {
    const categoryTracks = fullPlaylist.filter((track) => track.category === category);
    const titles = PODCAST_CATEGORY_TITLES[category] || [`Analiza ${category.toUpperCase()}`];

    categoryTracks.slice(0, Math.min(categoryTracks.length, 4)).forEach((track, index) => {
      const titleIndex = index % titles.length;

      podcasts.push({
        id: `${category}_${index}`,
        title: titles[titleIndex] || `${category} - Część ${index + 1}`,
        file: track.file,
        category: categoryIndex === 0 ? 'cases' : 'analysis',
        duration: `${15 + Math.floor(Math.random() * 20)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        description: `Głęboka analiza nagrań z kategorii ${category}. Odkrywamy ukryte wzorce manipulacji i przemocy psychicznej.`
      });
    });
  });

  return podcasts;
}

function renderPodcastGrid(doc, podcastGrid, podcasts, playPodcast) {
  if (!podcastGrid) {
    return;
  }

  const renderCategory = (category) => {
    const filteredPodcasts = category === 'all' ? podcasts : podcasts.filter((podcast) => podcast.category === category);

    podcastGrid.innerHTML = filteredPodcasts
      .map(
        (podcast) => `
        <div
          class="bg-gray-900/70 p-6 rounded-xl border border-gray-700 hover:border-amber-400 transition group cursor-pointer podcast-card"
          data-track-id="${escapeHTML(podcast.id)}"
        >
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
              <i class="fas fa-play text-white"></i>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-amber-400 group-hover:text-amber-300 mb-1">${escapeHTML(podcast.title)}</h3>
              <p class="text-sm text-gray-500">${escapeHTML(podcast.duration)}</p>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-4">${escapeHTML(podcast.description)}</p>
          <div class="flex justify-between items-center">
            <span class="text-xs text-gray-500 uppercase">${escapeHTML(getCategoryName(podcast.category))}</span>
            <button class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition">
              <i class="fas fa-headphones mr-2"></i>Słuchaj
            </button>
          </div>
        </div>
      `
      )
      .join('');

    podcastGrid.querySelectorAll('.podcast-card').forEach((card) => {
      card.addEventListener('click', () => {
        playPodcast(card.dataset.trackId);
      });
    });
  };

  renderCategory('all');

  return renderCategory;
}

function getCategoryName(category) {
  const names = { analysis: 'Analiza', cases: 'Przypadki', techniques: 'Techniki' };
  return names[category] || 'Inne';
}

function createFallbackData() {
  return {
    radio: [
      {
        title: 'Ambient Soundscape #1',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        category: 'ambient'
      },
      {
        title: 'Dark Atmosphere #2',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        category: 'ambient'
      },
      {
        title: 'Ethereal Voices #3',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        category: 'ambient'
      },
      {
        title: 'Mysterious Echoes #4',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        category: 'ambient'
      }
    ],
    podcasts: [
      {
        id: 'fallback1',
        title: 'Wprowadzenie do Analizy',
        file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        category: 'analysis',
        duration: '15:42',
        description: 'Podstawy rozpoznawania manipulacji w relacjach.'
      }
    ]
  };
}

export function setupAudioExperience(doc) {
  const elements = getElements(doc);

  const state = {
    mainRadioPlaylist: [],
    podcastPlaylist: [],
    radioQueue: [],
    currentRadioQueueIndex: 0,
    renderPodcastCategory: null
  };

  function generateRadioQueue() {
    if (state.mainRadioPlaylist.length === 0) {
      return;
    }

    state.radioQueue = [...state.mainRadioPlaylist];
    shuffleInPlace(state.radioQueue);
    state.currentRadioQueueIndex = 0;
  }

  function playNextRadioTrack() {
    if (state.radioQueue.length === 0 || state.currentRadioQueueIndex >= state.radioQueue.length) {
      generateRadioQueue();
    }

    if (state.radioQueue.length === 0) {
      return;
    }

    const track = state.radioQueue[state.currentRadioQueueIndex];

    if (elements.podcastPlayer) {
      elements.podcastPlayer.pause();
    }

    if (elements.radioPlayer) {
      elements.radioPlayer.src = track.url;
      elements.radioPlayer.play().catch((error) => {
        console.error('Błąd odtwarzania radia:', error);
        if (elements.radioCurrentSong) {
          elements.radioCurrentSong.textContent = 'Błąd ładowania utworu.';
        }
      });
    }

    if (elements.radioCurrentSong) {
      elements.radioCurrentSong.textContent = track.title;
    }

    state.currentRadioQueueIndex += 1;
  }

  function playPreviousRadioTrack() {
    if (state.radioQueue.length === 0 || state.currentRadioQueueIndex <= 1) {
      playNextRadioTrack();
      return;
    }

    state.currentRadioQueueIndex = (state.currentRadioQueueIndex - 2 + state.radioQueue.length) % state.radioQueue.length;
    playNextRadioTrack();
  }

  function toggleRadioPlayback() {
    if (!elements.radioPlayer) {
      return;
    }

    if (elements.radioPlayer.paused) {
      if (elements.radioPlayer.src && elements.radioPlayer.currentTime > 0) {
        elements.radioPlayer.play().catch((error) => console.error('Błąd odtwarzania radia:', error));
      } else {
        playNextRadioTrack();
      }
    } else {
      elements.radioPlayer.pause();
    }
  }

  function updateRadioUi() {
    if (!elements.radioPlayer || !elements.radioPlayPauseButton) {
      return;
    }

    const isPlaying = !elements.radioPlayer.paused;

    if (elements.radioPlayIcon) {
      elements.radioPlayIcon.classList.toggle('hidden', isPlaying);
    }

    if (elements.radioPauseIcon) {
      elements.radioPauseIcon.classList.toggle('hidden', !isPlaying);
    }

    elements.radioPlayPauseButton.setAttribute('aria-label', isPlaying ? 'Pauza' : 'Odtwarzaj');

    if (elements.radioVisualizer) {
      elements.radioVisualizer.querySelectorAll('div').forEach((bar) => {
        bar.classList.toggle('playing-bar', isPlaying);
      });
    }
  }

  function updateProgressBar() {
    if (!elements.radioPlayer || !elements.radioProgress || !elements.radioPlayer.duration) {
      return;
    }

    const progress = (elements.radioPlayer.currentTime / elements.radioPlayer.duration) * 100;
    elements.radioProgress.style.width = `${progress}%`;
  }

  function playPodcast(trackId) {
    if (!elements.podcastPlayer) {
      return;
    }

    const track = state.podcastPlaylist.find((item) => item.id === trackId);
    if (!track) {
      console.warn(`Nie znaleziono ścieżki o ID: ${trackId}`);
      return;
    }

    if (elements.radioPlayer) {
      elements.radioPlayer.pause();
    }

    elements.podcastPlayer.src = track.file;
    elements.podcastPlayer.load();
    elements.podcastPlayer.play().catch((error) => console.error('Błąd odtwarzania podcastu:', error));

    if (elements.podcastTitle) {
      elements.podcastTitle.textContent = track.title;
    }

    elements.podcastPlayerContainer?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  async function loadPlaylist() {
    try {
      const response = await fetch(PLAYLIST_SOURCE);
      if (!response.ok) {
        throw new Error(`Nie udało się pobrać playlisty: ${response.status}`);
      }

      const fullPlaylist = await response.json();
      state.mainRadioPlaylist = mapPlaylistToRadioTracks(fullPlaylist);
      state.podcastPlaylist = buildPodcastEntries(fullPlaylist);

      generateRadioQueue();

      if (elements.podcastGrid) {
        state.renderPodcastCategory = renderPodcastGrid(doc, elements.podcastGrid, state.podcastPlaylist, playPodcast);
      }

      console.log(`Załadowano ${state.mainRadioPlaylist.length} utworów do radia`);
      console.log(`Utworzono ${state.podcastPlaylist.length} podcastów`);
    } catch (error) {
      console.error('Błąd ładowania playlisty:', error);
      const fallback = createFallbackData();
      state.mainRadioPlaylist = fallback.radio;
      state.podcastPlaylist = fallback.podcasts;
      generateRadioQueue();

      if (elements.podcastGrid) {
        state.renderPodcastCategory = renderPodcastGrid(doc, elements.podcastGrid, state.podcastPlaylist, playPodcast);
      }
    }
  }

  function configureControls() {
    elements.radioPlayPauseButton?.addEventListener('click', toggleRadioPlayback);
    elements.radioNextButton?.addEventListener('click', playNextRadioTrack);
    elements.radioPreviousButton?.addEventListener('click', playPreviousRadioTrack);

    if (elements.radioPlayer) {
      elements.radioPlayer.addEventListener('play', updateRadioUi);
      elements.radioPlayer.addEventListener('pause', updateRadioUi);
      elements.radioPlayer.addEventListener('ended', playNextRadioTrack);
      elements.radioPlayer.addEventListener('timeupdate', updateProgressBar);
    }

    if (elements.volumeSlider) {
      elements.volumeSlider.addEventListener('input', (event) => {
        const volume = Number(event.target.value) / 100;
        if (elements.radioPlayer) {
          elements.radioPlayer.volume = volume;
        }
        if (elements.podcastPlayer) {
          elements.podcastPlayer.volume = volume;
        }
      });
    }

    if (elements.qualitySelector) {
      elements.qualitySelector.addEventListener('change', (event) => {
        console.log('Quality changed to:', event.target.value);
      });
    }
  }

  function prepareAutoplayUnlock() {
    if (elements.radioPlayer) {
      elements.radioPlayer.play().then(() => elements.radioPlayer.pause()).catch(() => {});
    }

    if (elements.podcastPlayer) {
      elements.podcastPlayer.play().then(() => elements.podcastPlayer.pause()).catch(() => {});
    }

    generateRadioQueue();
  }

  configureControls();

  return {
    loadPlaylist,
    playNextRadioTrack,
    prepareAutoplayUnlock,
    generateRadioQueue,
    get radioPlayer() {
      return elements.radioPlayer;
    },
    get podcastPlayer() {
      return elements.podcastPlayer;
    }
  };
}
