document.addEventListener('DOMContentLoaded', () => {
    const doc = document;

    // --- DOM Elements ---
    const radioPlayer = doc.getElementById('radio-player');
    const podcastPlayer = doc.getElementById('podcast-player');
    const startBtn = doc.getElementById('start-btn');
    const autoplayOverlay = doc.getElementById('autoplay-overlay');
    const visualizerCanvas = doc.getElementById('visualizer-canvas');
    const mobileMenu = doc.getElementById('mobile-menu');
    
    // --- Application State ---
    let audioContext, audioSource, analyser, gainNode;
    let isAudioInitialized = false;
    let isPlaying = false;
    const fadeDuration = 1; // 1 second for crossfade
    let animationId; // For canceling visualizer animation
    let csrfToken = ''; // Store CSRF token

    const playlists = {
        ambient: [], // Will be loaded from playlist.json
        disco: [ // Example placeholder playlists
            { title: 'Disco Fever #1', artist: 'Various Artists', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
            { title: 'Disco Fever #2', artist: 'Various Artists', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        ],
        hiphop: [
            { title: 'Hip-Hop Flow #1', artist: 'Various Artists', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
            { title: 'Hip-Hop Flow #2', artist: 'Various Artists', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
        ],
        podcasts: [
            { id: 'sprawaAdamskich', title: "Sprawa Adamskich: Wprowadzenie", url: 'audio/Adamskich_Sprawa.mp3' },
            { id: 'niewdziecznosc', title: "'Rażąca Niewdzięczność': Broń Narcyza", url: 'audio/Rażąca_Niewdzięczność.mp3' },
            { id: 'kalendarzAnaliza', title: "Analiza Kalendarza: Kronika Eskalacji", url: 'audio/kalendarz_analiza.mp3' },
            { id: 'sledztwo', title: "Śledztwo: Jak Dokumentować Manipulację?", url: 'audio/sledztwo.mp3' },
        ]
    };
    let currentRadioPlaylist = [];
    let currentRadioIndex = 0;

    // Fetch CSRF token on load
    async function fetchCsrfToken() {
        try {
            const response = await fetch('/get_csrf_token.php');
            if (!response.ok) throw new Error('Failed to fetch CSRF token');
            const data = await response.json();
            csrfToken = data.token;
        } catch (error) {
            console.error('CSRF token fetch error:', error);
            alert('Błąd ładowania tokena bezpieczeństwa. Spróbuj odświeżyć stronę.');
        }
    }

    // --- Audio Initialization ---
    async function initializeAudio() {
        if (isAudioInitialized) return;
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            gainNode = audioContext.createGain();
            gainNode.gain.value = 1; // Start with full volume

            audioSource = audioContext.createMediaElementSource(radioPlayer);
            audioSource.connect(gainNode).connect(analyser).connect(audioContext.destination);
            
            isAudioInitialized = true;
            console.log("Web Audio API initialized successfully.");
            
            // Enable controls and start visualizer
            doc.querySelectorAll('#radio-prev-btn, #radio-play-pause-btn, #radio-next-btn').forEach(btn => btn.disabled = false);
            drawVisualizer();
        } catch (e) {
            console.error("Could not initialize Web Audio API:", e);
            alert("Twoja przeglądarka nie wspiera Web Audio API lub wystąpił błąd. Aplikacja może nie działać poprawnie.");
        }
    }

    // --- Visualizer ---
    function drawVisualizer() {
        if (!analyser || !isPlaying) return;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        // ... (kod rysowania canvas - zakładam, że jest w truncated, dodaj jeśli potrzeba)
        animationId = requestAnimationFrame(drawVisualizer);
    }

    // --- Main Playlist Loading ---
    async function loadMainPlaylist() {
        try {
            const response = await fetch('playlist.json');
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            playlists.ambient = await response.json();
            setRadioPlaylist('ambient'); // Set default playlist
        } catch (error) {
            console.error('Failed to load ambient playlist:', error);
            doc.getElementById('radio-current-song').textContent = 'Błąd ładowania playlisty.';
        }
    }
    
    // --- Player Logic ---
    const radioPlayPauseBtn = doc.getElementById('radio-play-pause-btn');
    const radioPlayIcon = doc.getElementById('radio-play-icon');
    const radioPauseIcon = doc.getElementById('radio-pause-icon');
    const radioNextBtn = doc.getElementById('radio-next-btn');
    const radioPrevBtn = doc.getElementById('radio-prev-btn');
    const radioCurrentSongEl = doc.getElementById('radio-current-song');

    // Dodaj aria-labels dla dostępności
    radioPlayPauseBtn.setAttribute('aria-label', 'Odtwarzaj/Pauza');
    radioNextBtn.setAttribute('aria-label', 'Następny utwór');
    radioPrevBtn.setAttribute('aria-label', 'Poprzedni utwór');

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function setRadioPlaylist(playlistKey) {
        currentRadioPlaylist = [...(playlists[playlistKey] || [])];
        shuffleArray(currentRadioPlaylist);
        currentRadioIndex = 0;
        doc.getElementById('radio-current-song').textContent = `Wybrano playlistę: ${playlistKey}.`;
        if (isPlaying) {
            playRadioTrack(0);
        }
    }

    function playRadioTrack(index) {
        if (!isAudioInitialized || !currentRadioPlaylist || currentRadioPlaylist.length === 0) {
            radioCurrentSongEl.textContent = "Wybierz najpierw playlistę.";
            return;
        }
        currentRadioIndex = (index + currentRadioPlaylist.length) % currentRadioPlaylist.length;
        const track = currentRadioPlaylist[currentRadioIndex];
        radioPlayer.src = track.url;
        radioPlayer.play().catch(e => console.error("Playback error:", e));
        radioCurrentSongEl.textContent = `${track.title} - ${track.artist}`;
    }

    async function togglePlayPause() {
        if (!isAudioInitialized) return;
        if (audioContext.state === 'suspended') await audioContext.resume();
        if (isPlaying) {
            radioPlayer.pause();
            cancelAnimationFrame(animationId); // Stop visualizer to prevent leaks
        } else {
            radioPlayer.play().catch(e => console.error("Play error:", e));
            drawVisualizer();
        }
    }

    // --- Note Modal (truncated part fixed) ---
    const noteModal = doc.getElementById('note-modal');
    const noteDateInput = doc.getElementById('note-date');
    const noteNameInput = doc.getElementById('note-name');
    const noteTextInput = doc.getElementById('note-text');
    const noteFeedback = doc.getElementById('note-feedback');
    const noteForm = doc.getElementById('note-form');

    function openModal(date) {
        noteDateInput.value = date;
        noteModal.classList.remove('hidden');
        noteNameInput.focus();
    }

    function closeModal() {
        noteModal.classList.add('hidden');
        noteForm.reset();
        noteFeedback.textContent = '';
    }

    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const date = noteDateInput.value;
        const name = noteNameInput.value.trim();
        const text = noteTextInput.value.trim();

        // Walidacja client-side
        if (!date || name.length < 2 || name.length > 50 || text.length < 5 || text.length > 1000) {
            noteFeedback.textContent = 'Nieprawidłowe dane. Sprawdź pola.';
            noteFeedback.className = 'text-red-500 text-sm mt-2';
            return;
        }

        try {
            const response = await fetch('/add_comment.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
                body: JSON.stringify({ date, name, text })
            });
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            if (data.status === 'success') {
                noteFeedback.textContent = 'Notatka zapisana!';
                noteFeedback.className = 'text-green-500 text-sm mt-2';
                setTimeout(closeModal, 2000);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Add note error:', error);
            noteFeedback.textContent = `Błąd: ${error.message}`;
            noteFeedback.className = 'text-red-500 text-sm mt-2';
        }
    });
    doc.getElementById('modal-close-btn').addEventListener('click', closeModal);

    // --- AI Simulator ---
    const chatForm = doc.getElementById('chat-form');
    const chatInput = doc.getElementById('chat-input');
    const chatContainer = doc.getElementById('chat-container');
    const aiResponses = ["Przesadzasz, jesteś zbyt wrażliwa/y.", "Nigdy czegoś takiego nie powiedziałem/am.", "Robię to dla twojego dobra.", "Gdybyś tylko bardziej się starał/a...", "Wszyscy myślą, że zwariowałeś/aś.", "Po tym wszystkim, co dla ciebie zrobiłem/am..."];
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;
        appendChatMessage(msg, 'user');
        chatInput.value = '';
        setTimeout(() => {
            const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            appendChatMessage(response, 'ai');
        }, 1000 + Math.random() * 500);
    });

    function appendChatMessage(text, sender) {
        const msgWrapper = document.createElement('div');
        msgWrapper.className = sender === 'user' ? 'text-right' : 'text-left';
        
        const msgBubble = document.createElement('span');
        msgBubble.textContent = sender === 'user' ? `Ty: ${text}` : `AI: ${text}`; // Użyj textContent dla bezpieczeństwa (anti-XSS)
        msgBubble.className = sender === 'user' 
            ? 'inline-block bg-amber-500 text-black px-3 py-2 rounded-lg' 
            : 'inline-block bg-gray-700 text-gray-200 px-3 py-2 rounded-lg';

        msgWrapper.appendChild(msgBubble);
        chatContainer.appendChild(msgWrapper);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // --- Event Listeners ---
    startBtn.addEventListener('click', () => {
        gsap.to(autoplayOverlay, {
            opacity: 0, 
            duration: 0.5, 
            onComplete: () => autoplayOverlay.classList.add('hidden')
        });
        initializeAudio().then(() => {
            // setupVisualizer(); // Zakładam, że to w truncated, dodaj jeśli potrzeba
            loadMainPlaylist();
        });
    });

    // Player controls
    radioPlayPauseBtn.addEventListener('click', togglePlayPause);
    radioNextBtn.addEventListener('click', () => playRadioTrack(currentRadioIndex + 1));
    radioPrevBtn.addEventListener('click', () => playRadioTrack(currentRadioIndex - 1));
    radioPlayer.addEventListener('ended', () => playRadioTrack(currentRadioIndex + 1));

    radioPlayer.addEventListener('play', () => {
        isPlaying = true;
        radioPlayIcon.classList.add('hidden');
        radioPauseIcon.classList.remove('hidden');
        drawVisualizer();
    });

    radioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        radioPlayIcon.classList.remove('hidden');
        radioPauseIcon.classList.add('hidden');
        cancelAnimationFrame(animationId);
    });

    doc.querySelectorAll('.playlist-btn').forEach(button => {
        button.addEventListener('click', () => {
            setRadioPlaylist(button.dataset.playlist);
        });
    });

    doc.querySelectorAll('.podcast-play-button').forEach(button => {
        button.addEventListener('click', () => {
            if (!isAudioInitialized) return;
            const track = playlists.podcasts.find(t => t.id === button.dataset.trackId);
            if (track) {
                radioPlayer.pause();
                podcastPlayer.src = track.url;
                doc.getElementById('podcast-title').textContent = track.title;
                podcastPlayer.play().catch(e => console.error("Podcast playback error:", e));
            }
        });
    });
    
    // Mobile menu toggle
    doc.getElementById('menu-toggle').addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    
    // Close mobile menu on link click
    doc.querySelectorAll('.nav-link-mobile').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    // To Top Button
    const toTopButton = doc.getElementById('to-top-button');
    window.addEventListener('scroll', () => toTopButton.classList.toggle('hidden', window.scrollY <= 300));
    toTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    // --- General Helpers ---
    doc.getElementById('current-year').textContent = new Date().getFullYear();
    function escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    }
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('Service Worker registered:', reg))
                .catch(err => console.error('Service Worker registration failed:', err));
        });
    }

    // Initial fetches
    fetchCsrfToken();
});