// Stream URL configuration
const STREAM_URL = 'https://example.com/radio-adamowo/stream.m3u8'; // Replace with actual stream URL

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
    let animationId;
    let csrfToken = '';
    let hls = null;

    const playlists = {
        ambient: [], // Will be loaded from playlist.json
        disco: [
            { title: 'Disco Fever #1', artist: 'Various Artists', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
            { title: 'Disco Fever #2', artist: 'Various Artists', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        ],
        hiphop: [
            { title: 'Hip-Hop Flow #1', artist: 'Various Artists', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
            { title: 'Hip-Hop Flow #2', artist: 'Various Artists', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
        ],
        full: [], // Will be loaded from uploaded playlist
        podcasts: [
            { id: 'sprawaAdamskich', title: "Sprawa Adamskich: Wprowadzenie", url: 'audio/Adamskich_Sprawa.mp3' },
            { id: 'niewdziecznosc', title: "'Rażąca Niewdzięczność': Broń Narcyza", url: 'audio/Rażąca_Niewdzięczność.mp3' },
            { id: 'kalendarzAnaliza', title: "Analiza Kalendarza: Kronika Eskalacji", url: 'audio/kalendarz_analiza.mp3' },
            { id: 'sledztwo', title: "Śledztwo: Jak Dokumentować Manipulację?", url: 'audio/sledztwo.mp3' },
        ]
    };
    let currentRadioPlaylist = [];
    let currentRadioIndex = 0;

    // --- HLS.js Integration ---
    function initializeHLS() {
        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            
            hls.loadSource(STREAM_URL);
            hls.attachMedia(radioPlayer);
            
            hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
                console.log('HLS manifest loaded, found ' + hls.levels.length + ' quality level(s)');
            });
            
            hls.on(window.Hls.Events.ERROR, (event, data) => {
                console.error('HLS error:', data);
                if (data.fatal) {
                    switch(data.type) {
                        case window.Hls.ErrorTypes.NETWORK_ERROR:
                            console.log('Fatal network error encountered, try to recover');
                            hls.startLoad();
                            break;
                        case window.Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('Fatal media error encountered, try to recover');
                            hls.recoverMediaError();
                            break;
                        default:
                            console.log('Fatal error, cannot recover');
                            hls.destroy();
                            break;
                    }
                }
            });
        } else if (radioPlayer.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS support
            radioPlayer.src = STREAM_URL;
            console.log('Using native HLS support (Safari)');
        } else {
            console.warn('HLS not supported, falling back to regular audio');
        }
    }

    // --- Media Session API ---
    function updateMediaSession(title, artist = 'Radio Adamowo') {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: title,
                artist: artist,
                album: 'Radio Adamowo',
                artwork: [
                    { src: 'public/images/studio/studio-1.png', sizes: '96x96', type: 'image/png' },
                    { src: 'public/images/studio/studio-1.png', sizes: '128x128', type: 'image/png' },
                    { src: 'public/images/studio/studio-1.png', sizes: '192x192', type: 'image/png' },
                    { src: 'public/images/studio/studio-1.png', sizes: '256x256', type: 'image/png' },
                    { src: 'public/images/studio/studio-1.png', sizes: '384x384', type: 'image/png' },
                    { src: 'public/images/studio/studio-1.png', sizes: '512x512', type: 'image/png' },
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => {
                radioPlayer.play();
            });
            
            navigator.mediaSession.setActionHandler('pause', () => {
                radioPlayer.pause();
            });
            
            navigator.mediaSession.setActionHandler('previoustrack', () => {
                playRadioTrack(currentRadioIndex - 1);
            });
            
            navigator.mediaSession.setActionHandler('nexttrack', () => {
                playRadioTrack(currentRadioIndex + 1);
            });
        }
    }

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
            gainNode.gain.value = 1;

            audioSource = audioContext.createMediaElementSource(radioPlayer);
            audioSource.connect(gainNode).connect(analyser).connect(audioContext.destination);
            
            isAudioInitialized = true;
            console.log("Web Audio API initialized successfully.");
            
            // Enable controls and start visualizer
            doc.querySelectorAll('#radio-prev-btn, #radio-play-pause-btn, #radio-next-btn').forEach(btn => btn.disabled = false);
            setupVisualizer();
        } catch (e) {
            console.error("Could not initialize Web Audio API:", e);
            alert("Twoja przeglądarka nie wspiera Web Audio API lub wystąpił błąd. Aplikacja może nie działać poprawnie.");
        }
    }

    // --- Visualizer ---
    function setupVisualizer() {
        if (!visualizerCanvas) return;
        
        const ctx = visualizerCanvas.getContext('2d');
        visualizerCanvas.width = window.innerWidth;
        visualizerCanvas.height = window.innerHeight;
        
        function drawVisualizer() {
            if (!analyser || !isPlaying) {
                requestAnimationFrame(drawVisualizer);
                return;
            }
            
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
            
            const barWidth = (visualizerCanvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            for (let i = 0; i < bufferLength; i++) {
                barHeight = (dataArray[i] / 255) * visualizerCanvas.height / 2;
                
                const r = barHeight + 25 * (i / bufferLength);
                const g = 250 * (i / bufferLength);
                const b = 50;
                
                ctx.fillStyle = `rgb(${r},${g},${b})`;
                ctx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);
                
                x += barWidth + 1;
            }
            
            animationId = requestAnimationFrame(drawVisualizer);
        }
        
        drawVisualizer();
    }

    // --- Enhanced Playlist Loading ---
    async function loadMainPlaylist() {
        try {
            const response = await fetch('playlist.json');
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            playlists.ambient = await response.json();
            setRadioPlaylist('ambient');
        } catch (error) {
            console.error('Failed to load ambient playlist:', error);
            doc.getElementById('radio-current-song').textContent = 'Błąd ładowania playlisty.';
        }
    }

    // Load the full playlist from uploaded file
    async function loadFullPlaylist() {
        try {
            // Load the uploaded playlist with 300 tracks
            const fullPlaylistData = [
                { "title": "Utwór 1", "artist": "Nieznany Artysta", "url": "music/Utwor (1).mp3" },
                { "title": "Utwór 2", "artist": "Nieznany Artysta", "url": "music/Utwor (2).mp3" },
                { "title": "Utwór 3", "artist": "Nieznany Artysta", "url": "music/Utwor (3).mp3" },
                { "title": "Utwór 4", "artist": "Nieznany Artysta", "url": "music/Utwor (4).mp3" },
                { "title": "Utwór 5", "artist": "Nieznany Artysta", "url": "music/Utwor (5).mp3" },
                // Add first 50 tracks for demo
                ...Array.from({length: 45}, (_, i) => ({
                    title: `Utwór ${i + 6}`,
                    artist: "Nieznany Artysta",
                    url: `music/Utwor (${i + 6}).mp3`
                }))
            ];
            playlists.full = fullPlaylistData;
        } catch (error) {
            console.error('Failed to load full playlist:', error);
        }
    }
    
    // --- Player Logic ---
    const radioPlayPauseBtn = doc.getElementById('radio-play-pause-btn');
    const radioPlayIcon = doc.getElementById('radio-play-icon');
    const radioPauseIcon = doc.getElementById('radio-pause-icon');
    const radioNextBtn = doc.getElementById('radio-next-btn');
    const radioPrevBtn = doc.getElementById('radio-prev-btn');
    const radioCurrentSongEl = doc.getElementById('radio-current-song');

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
        
        // Update active tab
        doc.querySelectorAll('.playlist-btn').forEach(btn => btn.classList.remove('active'));
        doc.querySelector(`[data-playlist="${playlistKey}"]`)?.classList.add('active');
        
        doc.getElementById('radio-current-song').textContent = `Wybrano playlistę: ${playlistKey} (${currentRadioPlaylist.length} utworów).`;
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
        
        // Clean up existing HLS instance if switching to regular audio
        if (hls && !track.url.includes('.m3u8')) {
            hls.destroy();
            hls = null;
        }
        
        // Use HLS for streaming, regular audio for files
        if (track.url.includes('.m3u8')) {
            initializeHLS();
        } else {
            radioPlayer.src = track.url;
        }
        
        radioPlayer.play().catch(e => console.error("Playback error:", e));
        radioCurrentSongEl.textContent = `${track.title} - ${track.artist}`;
        updateMediaSession(track.title, track.artist);
    }

    async function togglePlayPause() {
        if (!isAudioInitialized) return;
        if (audioContext.state === 'suspended') await audioContext.resume();
        if (isPlaying) {
            radioPlayer.pause();
        } else {
            radioPlayer.play().catch(e => console.error("Play error:", e));
        }
    }

    // --- Note Modal ---
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
    const aiResponses = [
        "Przesadzasz, jesteś zbyt wrażliwa/y.", 
        "Nigdy czegoś takiego nie powiedziałem/am.", 
        "Robię to dla twojego dobra.", 
        "Gdybyś tylko bardziej się starał/a...", 
        "Wszyscy myślą, że zwariowałeś/aś.", 
        "Po tym wszystkim, co dla ciebie zrobiłem/am...",
        "To ty masz problem, nie ja.",
        "Zawsze wszystko przekręcasz.",
        "Jesteś niewdzięczny/a po tym wszystkim.",
        "Nikt cię nie zrozumie tak jak ja."
    ];
    
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
        msgBubble.textContent = sender === 'user' ? `Ty: ${text}` : `AI: ${text}`;
        msgBubble.className = sender === 'user' 
            ? 'inline-block bg-amber-500 text-black px-3 py-2 rounded-lg' 
            : 'inline-block bg-gray-700 text-gray-200 px-3 py-2 rounded-lg';

        msgWrapper.appendChild(msgBubble);
        chatContainer.appendChild(msgWrapper);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // --- Event Listeners ---
    startBtn.addEventListener('click', () => {
        autoplayOverlay.style.opacity = '0';
        setTimeout(() => autoplayOverlay.classList.add('hidden'), 500);
        initializeAudio().then(() => {
            initializeHLS();
            loadMainPlaylist();
            loadFullPlaylist();
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
    });

    radioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        radioPlayIcon.classList.remove('hidden');
        radioPauseIcon.classList.add('hidden');
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
                if (podcastPlayer) {
                    podcastPlayer.src = track.url;
                    doc.getElementById('podcast-title').textContent = track.title;
                    podcastPlayer.play().catch(e => console.error("Podcast playback error:", e));
                }
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
    
    // Update current year
    doc.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('Service Worker registered:', reg))
                .catch(err => console.error('Service Worker registration failed:', err));
        });
    }

    // Window resize handler for visualizer
    window.addEventListener('resize', () => {
        if (visualizerCanvas) {
            visualizerCanvas.width = window.innerWidth;
            visualizerCanvas.height = window.innerHeight;
        }
    });

    // Initial fetches
    fetchCsrfToken();
});