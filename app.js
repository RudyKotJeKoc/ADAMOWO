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
        hits: [
            { title: 'Midnight Radio', artist: 'Radio Adamowo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
            { title: 'Echoes of Truth', artist: 'Radio Adamowo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
            { title: 'Breaking the Cycle', artist: 'Radio Adamowo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
            { title: 'Red Flag Symphony', artist: 'Radio Adamowo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
            { title: 'Voice of Liberation', artist: 'Radio Adamowo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
            { title: 'Patterns in the Dark', artist: 'Radio Adamowo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
            { title: 'Healing Frequencies', artist: 'Radio Adamowo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
            { title: 'Beyond the Manipulation', artist: 'Radio Adamowo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
            { title: 'Rise Above', artist: 'Radio Adamowo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
            { title: 'Freedom Signal', artist: 'Radio Adamowo', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' }
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
        
        // Update display based on playlist type
        const playlistNames = {
            ambient: 'Ambient',
            disco: 'Disco Fever',
            hiphop: 'Hip-Hop Flow',
            hits: 'Lista Hitów',
            podcasts: 'Podcasty'
        };
        const displayName = playlistNames[playlistKey] || playlistKey;
        doc.getElementById('radio-current-song').textContent = `Wybrano playlistę: ${displayName}. Naciśnij play, aby rozpocząć.`;
        
        // Prepare first track for immediate playback
        if (currentRadioPlaylist.length > 0 && isAudioInitialized) {
            const track = currentRadioPlaylist[currentRadioIndex];
            radioPlayer.src = track.url;
            radioPlayer.preload = 'metadata';
        }
        
        // If currently playing, switch to new playlist immediately
        if (isPlaying) {
            playRadioTrack(0);
        }
    }

    function playRadioTrack(index) {
        if (!isAudioInitialized || !currentRadioPlaylist || currentRadioPlaylist.length === 0) {
            radioCurrentSongEl.textContent = "Wybierz najpierw styl muzyczny.";
            return;
        }
        
        currentRadioIndex = (index + currentRadioPlaylist.length) % currentRadioPlaylist.length;
        const track = currentRadioPlaylist[currentRadioIndex];
        radioCurrentSongEl.textContent = `${track.artist || 'Nieznany'} - ${track.title}`;
        
        // Crossfade logic
        if (isPlaying && !radioPlayer.paused) {
             gsap.to(gainNode.gain, { value: 0, duration: fadeDuration, onComplete: () => {
                radioPlayer.src = track.url;
                radioPlayer.play().catch(e => console.error("Playback error:", e));
                gsap.to(gainNode.gain, { value: 1, duration: fadeDuration });
            }});
        } else {
            radioPlayer.src = track.url;
            radioPlayer.play().catch(e => console.error("Playback error:", e));
        }
    }

    function togglePlayPause() {
        if (!isAudioInitialized) return;

        if (radioPlayer.paused) {
            if (currentRadioPlaylist.length === 0) {
                // Load default playlist if none selected
                loadMainPlaylist().then(() => playRadioTrack(0));
            } else {
                // Playlist is selected, start playing
                playRadioTrack(currentRadioIndex);
            }
        } else {
            radioPlayer.pause();
        }
    }
    
    // --- Visualizer ---
    const canvasCtx = visualizerCanvas.getContext('2d');
    let dataArray, bufferLength;
    function setupVisualizer() {
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        visualizerCanvas.width = window.innerWidth;
        visualizerCanvas.height = window.innerHeight;
    }
    
    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);
        if (!isAudioInitialized || !isPlaying) {
             // Clear canvas when paused
             canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
             canvasCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
             return;
        };

        analyser.getByteFrequencyData(dataArray);
        canvasCtx.fillStyle = 'rgba(0, 0, 0, 0)';
        canvasCtx.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);

        const barWidth = (visualizerCanvas.width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] * 1.2;
            const r = barHeight + (25 * (i/bufferLength));
            const g = 200 * (i/bufferLength);
            const b = 100;
            canvasCtx.fillStyle = `rgba(${r},${g},${b}, 0.5)`;
            canvasCtx.fillRect(x, visualizerCanvas.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }
    window.addEventListener('resize', () => {
        if (isAudioInitialized) {
            visualizerCanvas.width = window.innerWidth;
            visualizerCanvas.height = window.innerHeight;
        }
    });

    // --- Tab Logic ---
    const tabButtons = doc.querySelectorAll('.tab-button');
    const tabContents = doc.querySelectorAll('.tab-content');
    function switchTab(targetTabId) {
        tabContents.forEach(c => c.classList.toggle('hidden', c.id !== targetTabId));
        tabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === targetTabId));
    }
    tabButtons.forEach(b => b.addEventListener('click', () => switchTab(b.dataset.tab)));
    if (tabButtons.length > 0) switchTab(tabButtons[0].dataset.tab);

    // --- GSAP Animation (Infinity Loop) ---
    gsap.registerPlugin(Draggable, MotionPathPlugin);
    const path = doc.getElementById('infinity-path');
    const avatarD = doc.getElementById('avatar-d');
    const avatarB = doc.getElementById('avatar-b');
    const description = doc.getElementById('timeline-description');
    const stages = [
        { range: [0, 0.25], text: "Początek dewaluacji: pojawiają się pierwsze drobne uszczypliwości i krytyka." },
        { range: [0.25, 0.5], text: "Eskalacja: otwarty konflikt i gaslighting. Ofiara traci poczucie rzeczywistości." },
        { range: [0.5, 0.75], text: "Faza odrzucenia: manipulator odsuwa się, karząc ofiarę ciszą lub odejściem." },
        { range: [0.75, 1.0], text: "Powrót do idealizacji (hoovering): manipulator wraca, obiecując poprawę." }
    ];
    function updateTimelineState(progress) {
        progress = (progress + 1) % 1;
        gsap.set(avatarD, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], end: progress } });
        gsap.set(avatarB, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], end: (progress + 0.5) % 1 } });
        const currentStage = stages.find(s => progress >= s.range[0] && progress < s.range[1]) || stages[0];
        description.textContent = currentStage.text;
        const manipulatorProgress = (progress + 0.5) % 1;
        avatarB.classList.toggle('fire-active', manipulatorProgress > 0.25 && manipulatorProgress < 0.75);
    }
    Draggable.create([avatarD, avatarB], { type:"motionPath", motionPath: { path, align: path }, onDrag: function() { let p = (this.target === avatarB) ? this.progress - 0.5 : this.progress; updateTimelineState(p); } });
    updateTimelineState(0);

    // --- Calendar & Modal Logic ---
    const modal = doc.getElementById('calendar-modal');
    let currentSelectedDate = null;
    async function fetchNotesForDate(date) {
        const display = doc.getElementById('modal-notes-display');
        display.innerHTML = '<p class="text-gray-400">Wczytywanie...</p>';
        try {
            const response = await fetch(`./get_comments.php?date=${date}`);
            if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
            const result = await response.json();
            if (result.status !== 'success') throw new Error(result.message || 'Unknown error');
            display.innerHTML = '';
            if (result.data.length > 0) {
                result.data.forEach(note => {
                    const noteEl = doc.createElement('div');
                    noteEl.className = 'bg-gray-800 p-2 rounded';
                    noteEl.innerHTML = `<strong class="text-amber-400">${escapeHTML(note.name)}:</strong><p class="text-gray-300 whitespace-pre-wrap">${escapeHTML(note.text)}</p>`;
                    display.appendChild(noteEl);
                });
            } else {
                display.innerHTML = '<p class="text-gray-500 italic">Brak notatek dla tego dnia.</p>';
            }
        } catch (error) {
            console.error('Fetch notes error:', error);
            display.innerHTML = `<p class="text-red-500">Nie udało się załadować notatek: ${error.message}</p>`;
        }
    }
    flatpickr("#calendar-input", {
        locale: "pl", inline: true, dateFormat: "Y-m-d",
        onChange: (selectedDates, dateStr) => {
            currentSelectedDate = dateStr;
            doc.getElementById('modal-date').textContent = selectedDates[0].toLocaleDateString('pl-PL');
            fetchNotesForDate(dateStr);
            modal.classList.remove('hidden');
            doc.body.classList.add('modal-open');
        }
    });
    function closeModal() {
        modal.classList.add('hidden');
        doc.body.classList.remove('modal-open');
    }
    doc.getElementById('modal-note-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = doc.getElementById('modal-name-input');
        const textInput = doc.getElementById('modal-note-input');
        const feedbackEl = doc.getElementById('modal-feedback');
        const name = nameInput.value.trim();
        const text = textInput.value.trim();
        if (!name || !text || !currentSelectedDate) {
            feedbackEl.textContent = 'Imię i treść notatki nie mogą być puste.';
            feedbackEl.className = 'text-red-500 text-sm mt-2 min-h-[1.25rem]';
            return;
        }
        feedbackEl.textContent = 'Wysyłanie...';
        feedbackEl.className = 'text-gray-400 text-sm mt-2 min-h-[1.25rem]';
        try {
            const response = await fetch('./add_comment.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: currentSelectedDate, name, text })
            });
            const result = await response.json();
            if (!response.ok || result.status !== 'success') throw new Error(result.message || 'Server error');
            nameInput.value = '';
            textInput.value = '';
            feedbackEl.textContent = 'Notatka dodana!';
            feedbackEl.className = 'text-green-500 text-sm mt-2 min-h-[1.25rem]';
            fetchNotesForDate(currentSelectedDate);
        } catch (error) {
            console.error('Add note error:', error);
            feedbackEl.textContent = `Błąd: ${error.message}`;
            feedbackEl.className = 'text-red-500 text-sm mt-2 min-h-[1.25rem]';
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
        const content = sender === 'user' ? `Ty: ${escapeHTML(text)}` : `<strong>AI:</strong> ${escapeHTML(text)}`;
        msgBubble.innerHTML = content;
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
            setupVisualizer();
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
});
