document.addEventListener('DOMContentLoaded', () => {
    const doc = document;
    let mainRadioPlaylist = [];
    let podcastPlaylist = [];

    // Loading screen
    setTimeout(() => {
        const loadingScreen = doc.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.remove(), 500);
        }
    }, 3000);

    // Load playlist from JSON file
    async function loadPlaylist() {
        try {
            const response = await fetch('./playlist.json');
            const fullPlaylist = await response.json();
            
            // Filter tracks for radio (ambient, hiphop, disco categories)
            mainRadioPlaylist = fullPlaylist.filter(track => 
                ['ambient', 'hiphop', 'disco'].includes(track.category)
            );
            
            // Add titles to radio tracks based on filenames
            mainRadioPlaylist = mainRadioPlaylist.map(track => ({
                ...track,
                title: generateTitleFromFilename(track.file),
                url: track.file // Map file to url for compatibility
            }));
            
            // Create podcast playlist with thematic titles based on categories
            const categoryTitles = {
                'barbara': [
                    'Analiza Głosów Barbary: Studium Przypadku',
                    'Sekretne Nagrania: Co Ukrywa Barbara?',
                    'Psychologia Manipulacji: Przypadek Barbary',
                    'Kluczowe Dowody w Sprawie Barbary'
                ],
                'kids': [
                    'Dziecięce Piosenki jako Narzędzie Kontroli',
                    'Infantylizacja w Toksycznych Relacjach',
                    'Analiza: Kiedy Niewinność Staje Się Bronią'
                ],
                'ambient': [
                    'Atmosfera Strachu: Soundscape Manipulacji',
                    'Dźwięki Ciszy: Co Słychać w Domu Przemocy',
                    'Ambient Terror: Muzyka Jako Narzędzie Kontroli'
                ]
            };

            // Create podcast entries from specific categories
            const podcastCategories = ['barbara', 'kids'];
            podcastCategories.forEach((category, categoryIndex) => {
                const categoryTracks = fullPlaylist.filter(track => track.category === category);
                const titles = categoryTitles[category] || [`Analiza ${category.toUpperCase()}`];
                
                categoryTracks.slice(0, Math.min(categoryTracks.length, 4)).forEach((track, index) => {
                    const titleIndex = index % titles.length;
                    podcastPlaylist.push({
                        id: `${category}_${index}`,
                        title: titles[titleIndex] || `${category} - Część ${index + 1}`,
                        file: track.file,
                        category: categoryIndex === 0 ? 'cases' : 'analysis',
                        duration: `${15 + Math.floor(Math.random() * 20)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
                        description: `Głęboka analiza nagrań z kategorii ${category}. Odkrywamy ukryte wzorce manipulacji i przemocy psychicznej.`
                    });
                });
            });

            console.log(`Załadowano ${mainRadioPlaylist.length} utworów do radia`);
            console.log(`Utworzono ${podcastPlaylist.length} podcastów`);
            
            // Initialize radio after loading playlist
            generateRadioQueue();
            generatePodcastGrid();
            
        } catch (error) {
            console.error('Błąd ładowania playlisty:', error);
            // Fallback to default playlist if loading fails
            initializeFallbackPlaylist();
        }
    }

    // Helper function to generate titles from filenames
    function generateTitleFromFilename(filepath) {
        if (filepath === null || filepath === undefined || typeof filepath !== 'string') return 'Utwór bez tytułu';
        
        // Extract filename from path
        const filename = filepath.split('/').pop();
        if (!filename) return 'Utwór bez tytułu';
        
        // Remove extension and clean up
        let title = filename.replace(/\.mp3$/i, '');
        
        // Handle specific patterns like "Utwor (1)" -> "Utwór 1"
        title = title.replace(/Utwor\s*\((\d+)\)/i, 'Utwór $1');
        
        // Clean up underscores and special characters
        title = title.replace(/_/g, ' ');
        
        // Capitalize first letter of each word
        title = title.replace(/\b\w/g, l => l.toUpperCase());
        
        return title || 'Utwór bez tytułu';
    }

    function initializeFallbackPlaylist() {
        mainRadioPlaylist = [
            { title: "Ambient Soundscape #1", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", category: "ambient" },
            { title: "Dark Atmosphere #2", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", category: "ambient" },
            { title: "Ethereal Voices #3", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", category: "ambient" },
            { title: "Mysterious Echoes #4", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", category: "ambient" }
        ];
        
        podcastPlaylist = [
            { 
                id: 'fallback1', 
                title: "Wprowadzenie do Analizy", 
                file: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                category: 'analysis',
                duration: '15:42',
                description: 'Podstawy rozpoznawania manipulacji w relacjach.'
            }
        ];
        
        generateRadioQueue();
        generatePodcastGrid();
    }

    // --- Player Elements ---
    const radioPlayer = doc.getElementById('radio-player');
    const radioCurrentSongEl = doc.getElementById('radio-current-song');
    const radioPlayPauseBtn = doc.getElementById('radio-play-pause-btn');
    const radioPlayIcon = doc.getElementById('radio-play-icon');
    const radioPauseIcon = doc.getElementById('radio-pause-icon');
    const radioNextBtn = doc.getElementById('radio-next-btn');
    const radioPrevBtn = doc.getElementById('radio-prev-btn');
    const radioVisualizer = doc.getElementById('radio-visualizer');
    const volumeSlider = doc.getElementById('volume-slider');
    const qualitySelector = doc.getElementById('quality-selector');
    const radioProgress = doc.getElementById('radio-progress');

    const podcastPlayer = doc.getElementById('podcast-player');
    const podcastTitleEl = doc.getElementById('podcast-title');
    const podcastPlayerContainer = doc.getElementById('podcast-player-container');

    let radioQueue = [];
    let currentRadioQueueIndex = -1;
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function generateRadioQueue() {
        if (mainRadioPlaylist.length === 0) return;
        radioQueue = [...mainRadioPlaylist];
        shuffleArray(radioQueue);
        currentRadioQueueIndex = 0;
    }

    function playNextRadioTrack() {
        if (radioQueue.length === 0 || currentRadioQueueIndex >= radioQueue.length) {
            generateRadioQueue();
        }
        
        if (radioQueue.length === 0) return;
        
        podcastPlayer.pause();
        const track = radioQueue[currentRadioQueueIndex];
        radioPlayer.src = track.url;
        radioCurrentSongEl.textContent = track.title;
        radioPlayer.play().catch(e => {
            console.error("Błąd odtwarzania radia:", e);
            radioCurrentSongEl.textContent = "Błąd ładowania utworu.";
        });
        
        currentRadioQueueIndex++;
    }

    function playPrevRadioTrack() {
         if (radioQueue.length === 0 || currentRadioQueueIndex <= 1) {
            playNextRadioTrack();
            return;
        }
        currentRadioQueueIndex = (currentRadioQueueIndex - 2 + radioQueue.length) % radioQueue.length;
        playNextRadioTrack();
    }

    function toggleRadioPlayPause() {
        if (radioPlayer.paused) {
            if (radioPlayer.src && radioPlayer.currentTime > 0) {
                radioPlayer.play().catch(e => console.error("Błąd odtwarzania radia:", e));
            } else {
                playNextRadioTrack();
            }
        } else {
            radioPlayer.pause();
        }
    }

    function updateRadioUI() {
        const isPlaying = !radioPlayer.paused;
        radioPlayIcon.classList.toggle('hidden', isPlaying);
        radioPauseIcon.classList.toggle('hidden', !isPlaying);
        radioPlayPauseBtn.setAttribute('aria-label', isPlaying ? 'Pauza' : 'Odtwarzaj');
        radioVisualizer.querySelectorAll('div').forEach(bar => bar.classList.toggle('playing-bar', isPlaying));
    }

    function updateProgress() {
        if (radioPlayer.duration) {
            const progress = (radioPlayer.currentTime / radioPlayer.duration) * 100;
            radioProgress.style.width = progress + '%';
        }
    }

    // Radio player event listeners
    if (radioPlayPauseBtn) radioPlayPauseBtn.addEventListener('click', toggleRadioPlayPause);
    if (radioNextBtn) radioNextBtn.addEventListener('click', playNextRadioTrack);
    if (radioPrevBtn) radioPrevBtn.addEventListener('click', playPrevRadioTrack);
    if (radioPlayer) {
        radioPlayer.addEventListener('play', updateRadioUI);
        radioPlayer.addEventListener('pause', updateRadioUI);
        radioPlayer.addEventListener('ended', playNextRadioTrack);
        radioPlayer.addEventListener('timeupdate', updateProgress);
    }

    // Volume control
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            if (radioPlayer) radioPlayer.volume = e.target.value / 100;
            if (podcastPlayer) podcastPlayer.volume = e.target.value / 100;
        });
    }

    // Quality selector (placeholder functionality)
    if (qualitySelector) {
        qualitySelector.addEventListener('change', (e) => {
            console.log('Quality changed to:', e.target.value);
            // In a real application, this would switch to different quality streams
        });
    }

    // Podcast functionality
    function playPodcast(trackId) {
        const track = podcastPlaylist.find(t => t.id === trackId);
        if (!track) {
            console.warn(`Nie znaleziono ścieżki o ID: ${trackId}`);
            return;
        }
        
        radioPlayer.pause();
        
        podcastPlayer.src = track.file;
        podcastTitleEl.textContent = track.title;
        podcastPlayer.load();
        podcastPlayer.play().catch(e => console.error("Błąd odtwarzania podcastu:", e));
        podcastPlayerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Generate podcast grid
    function generatePodcastGrid(category = 'all') {
        const grid = doc.getElementById('podcast-grid');
        if (!grid || podcastPlaylist.length === 0) return;

        const filteredPodcasts = category === 'all' ? podcastPlaylist : podcastPlaylist.filter(p => p.category === category);
        
        grid.innerHTML = filteredPodcasts.map(podcast => `
            <div class="bg-gray-900/70 p-6 rounded-xl border border-gray-700 hover:border-amber-400 transition group cursor-pointer podcast-card" data-track-id="${podcast.id}">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
                        <i class="fas fa-play text-white"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-amber-400 group-hover:text-amber-300 mb-1">${podcast.title}</h3>
                        <p class="text-sm text-gray-500">${podcast.duration}</p>
                    </div>
                </div>
                <p class="text-gray-400 text-sm mb-4">${podcast.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-500 uppercase">${getCategoryName(podcast.category)}</span>
                    <button class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition">
                        <i class="fas fa-headphones mr-2"></i>Słuchaj
                    </button>
                </div>
            </div>
        `).join('');

        // Add event listeners to podcast cards
        grid.querySelectorAll('.podcast-card').forEach(card => {
            card.addEventListener('click', () => {
                playPodcast(card.dataset.trackId);
            });
        });
    }

    function getCategoryName(category) {
        const names = {
            'analysis': 'Analiza',
            'cases': 'Przypadki',
            'techniques': 'Techniki'
        };
        return names[category] || 'Inne';
    }

    // Podcast category filtering
    doc.querySelectorAll('.podcast-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            doc.querySelectorAll('.podcast-category-btn').forEach(b => {
                b.classList.remove('active', 'bg-amber-600');
                b.classList.add('bg-gray-700');
            });
            btn.classList.add('active', 'bg-amber-600');
            btn.classList.remove('bg-gray-700');
            
            // Filter podcasts
            generatePodcastGrid(btn.dataset.category);
        });
    });

    // --- Mobile Menu Logic ---
    const menuToggle = doc.getElementById('menu-toggle');
    const mobileMenu = doc.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    // --- GSAP Animation (Infinity Loop) ---
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(Draggable, MotionPathPlugin);
        const path = doc.getElementById('infinity-path');
        const avatarD = doc.getElementById('avatar-d');
        const avatarB = doc.getElementById('avatar-b');
        const description = doc.getElementById('timeline-description');
        
        const stages = [
            { range: [0, 0.2], text: "Faza 'love bombing': manipulator buduje iluzję idealnej relacji, obsypuje ofiarę uwagą i prezentami." },
            { range: [0.2, 0.4], text: "Początek dewaluacji: pojawiają się pierwsze drobne uszczypliwości, krytyka i podważanie pewności siebie ofiary." },
            { range: [0.4, 0.6], text: "Eskalacja przemocy: otwarty konflikt, gaslighting i manipulacja. Ofiara traci poczucie rzeczywistości." },
            { range: [0.6, 0.8], text: "Faza odrzucenia: manipulator odsuwa się emocjonalnie, karząc ofiarę ciszą, ignorowaniem lub groźbą odejścia." },
            { range: [0.8, 1.0], text: "Powrót do 'love bombing' (hoovering): manipulator wraca z obietnicami zmiany, by zacząć cykl od nowa." }
        ];
        
        function updateTimelineState(progress) {
            progress = (progress + 1) % 1;
            if (path && avatarD && avatarB) {
                gsap.set(avatarD, { motionPath: { path: path, align: path, alignOrigin: [0.5, 0.5], end: progress } });
                gsap.set(avatarB, { motionPath: { path: path, align: path, alignOrigin: [0.5, 0.5], end: (progress + 0.5) % 1 } });
            }
            
            const currentStage = stages.find(s => progress >= s.range[0] && progress < s.range[1]) || stages[0];
            if (description) description.textContent = currentStage.text;
            
            const manipulatorProgress = (progress + 0.5) % 1;
            if (avatarB) avatarB.classList.toggle('fire-active', manipulatorProgress > 0.25 && manipulatorProgress < 0.75);
        }
        
        if (path && avatarD && avatarB) {
            Draggable.create([avatarD, avatarB], { 
                type: "motionPath", 
                motionPath: { path: path, align: path }, 
                onDrag: function() { 
                    let progress = (this.target === avatarB) ? this.progress - 0.5 : this.progress; 
                    updateTimelineState(progress); 
                } 
            });
            updateTimelineState(0);
        }
    }

    // --- Calendar & Modal Logic ---
    const calendarInput = doc.getElementById('calendar-input');
    const modal = doc.getElementById('calendar-modal');
    const modalDateEl = doc.getElementById('modal-date');
    const modalNotesDisplay = doc.getElementById('modal-notes-display');
    const modalNoteForm = doc.getElementById('modal-note-form');
    const modalNameInput = doc.getElementById('modal-name-input');
    const modalNoteInput = doc.getElementById('modal-note-input');
    const modalCloseBtn = doc.getElementById('modal-close-btn');
    const modalFeedback = doc.getElementById('modal-feedback');
    let currentSelectedDate = null;

    // Local storage for notes (since we don't have PHP backend)
    function getStoredNotes(date) {
        const notes = localStorage.getItem(`notes_${date}`);
        return notes ? JSON.parse(notes) : [];
    }

    function storeNote(date, name, text) {
        const notes = getStoredNotes(date);
        notes.push({ name, text, timestamp: new Date().toISOString() });
        localStorage.setItem(`notes_${date}`, JSON.stringify(notes));
    }

    function displayNotesForDate(date) {
        const notes = getStoredNotes(date);
        if (!modalNotesDisplay) return;
        
        modalNotesDisplay.innerHTML = '';
        
        if (notes.length > 0) {
            notes.forEach(note => {
                const noteEl = document.createElement('div');
                noteEl.className = 'bg-gray-800 p-3 rounded-lg border border-gray-600';
                noteEl.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <strong class="text-amber-400">${escapeHTML(note.name)}</strong>
                        <span class="text-xs text-gray-500">${new Date(note.timestamp).toLocaleString('pl-PL')}</span>
                    </div>
                    <p class="text-gray-300 whitespace-pre-wrap">${escapeHTML(note.text)}</p>
                `;
                modalNotesDisplay.appendChild(noteEl);
            });
        } else {
            modalNotesDisplay.innerHTML = '<p class="text-gray-500 italic text-center py-4">Brak notatek dla tego dnia. Dodaj pierwszą czerwoną flagę!</p>';
        }
    }

    // Initialize Flatpickr if available
    if (typeof flatpickr !== 'undefined' && calendarInput) {
        const fp = flatpickr(calendarInput, {
            locale: "pl", 
            inline: false, 
            dateFormat: "Y-m-d",
            onChange: (selectedDates, dateStr) => {
                if (selectedDates.length > 0) {
                    currentSelectedDate = dateStr;
                    if (modalDateEl) modalDateEl.textContent = selectedDates[0].toLocaleDateString('pl-PL');
                    displayNotesForDate(dateStr);
                    if (modal) modal.classList.remove('hidden');
                    doc.documentElement.classList.add('modal-open');
                    if (modalNameInput) modalNameInput.focus();
                }
            }
        });
    }

    function closeModal() {
        if (modal) modal.classList.add('hidden');
        doc.documentElement.classList.remove('modal-open');
        if (modalFeedback) modalFeedback.textContent = '';
        if (modalNoteForm) modalNoteForm.reset();
        if (calendarInput) calendarInput.focus();
    }

    if (modalNoteForm) {
        modalNoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (modalFeedback) modalFeedback.textContent = '';
            
            const name = modalNameInput ? modalNameInput.value.trim() : '';
            const text = modalNoteInput ? modalNoteInput.value.trim() : '';
            
            if (!name || !text || !currentSelectedDate) {
                if (modalFeedback) {
                    modalFeedback.textContent = 'Imię i treść notatki są wymagane.';
                    modalFeedback.className = 'text-red-500 text-sm mt-2 min-h-[1.25rem]';
                }
                return;
            }

            try {
                storeNote(currentSelectedDate, name, text);
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
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    doc.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeModal(); 
    });

    // --- Enhanced Guide Section ---
    const guideData = [
        {
            id: 1,
            title: "Branie pieniędzy z instytucji zamiast prawdziwej pomocy",
            description: "Toksyczna osoba stara się o świadczenia opiekuńcze, ale faktycznie nie zajmuje się podopiecznym, wykorzystuje środki na własne cele.",
            example: "Matka uzyskała świadczenie pielęgnacyjne na opiekę nad chorym mężem, ale większość czasu przeznaczała na walkę z synem.",
            redFlags: [
                "Czy osoba pobierająca świadczenie naprawdę angażuje się w opiekę?",
                "Czy pieniądze są przeznaczane na potrzeby podopiecznego?",
                "Czy osoba wykorzystuje środki do walki zamiast pomocy?"
            ]
        },
        {
            id: 2,
            title: "Przerzucanie winy i granie ofiary",
            description: "Manipulant nigdy nie przyzna się do błędu, obwinia innych, grając rolę pokrzywdzonego.",
            example: "W dokumentach opisuje się, że syn jest niewdzięczny, chociaż to matka przez lata zaniedbywała dom i rodzinę.",
            redFlags: [
                "Czy ta osoba zawsze gra ofiarę, nawet gdy ewidentnie szkodzi innym?",
                "Czy nieustannie oskarża innych, ignorując własne błędy?",
                "Czy nigdy nie bierze odpowiedzialności za swoje działania?"
            ]
        },
        {
            id: 3,
            title: "Gaslighting – wmawianie, że jesteś zły i nienormalny",
            description: "Podważanie percepcji ofiary, wmawianie, że przesadza lub wymyśla.",
            example: "Matka wpisała w dokumenty, że syn cierpi na schizofremię, choć nie miał żadnej diagnozy – chodziło tylko o zdyskredytowanie go.",
            redFlags: [
                "Czy po rozmowie z tą osobą czujesz się wariatem?",
                "Czy wmawia Ci rzeczy, których nie zrobiłeś/nie powiedziałeś?",
                "Czy podważa Twoje wspomnienia i percepcję rzeczywistości?"
            ]
        },
        {
            id: 4,
            title: "Inwigilacja i obsesyjna kontrola",
            description: "Notowanie każdego ruchu ofiary, zbieranie dowodów do szantażu.",
            example: "Notowanie godzin gaszenia światła, wejścia do warsztatu, rozmów telefonicznych, by potem użyć tego jako dowodu na rażącą niewdzięczność",
            redFlags: [
                "Czy czujesz się ciągle obserwowany?",
                "Czy ktoś wykorzystuje drobiazgi z Twojego życia do budowania aktu oskarżenia?",
                "Czy Twoja prywatność jest stale naruszana?"
            ]
        },
        {
            id: 5,
            title: "Używanie instytucji jako broni",
            description: "Wciąganie policji, sądów, urzędów do rodzinnych konfliktów.",
            example: "Wzywanie dzielnicowego po to, by uzyskać papier na syna, mimo że problem jest wyłącznie rodzinny, a nie kryminalny.",
            redFlags: [
                "Czy ktoś grozi Ci sądem, policją, opieką społeczną?",
                "Czy drobne konflikty są natychmiast eskalowane do poziomu instytucji?",
                "Czy używa się urzędów do zastraszania i kontroli?"
            ]
        },
        {
            id: 6,
            title: "Szantaż emocjonalny i groźby",
            description: "Grożenie odebraniem domu, wykluczeniem z rodziny.",
            example: "„Jak się nie podporządkujesz, to zabiorę ci wszystk typowa groźba w konflikcie majątkowym.",
            redFlags: [
                "Czy czujesz, że decyzje są wymuszane przez strach, a nie argumenty?",
                "Czy ktoś stosuje groźby dotyczące Twojej przyszłości lub bliskich?",
                "Czy jesteś szantażowany emocjonalnie?"
            ]
        },
        {
            id: 7,
            title: "Tworzenie chaosu i dezinformacji",
            description: "Zmiana wersji wydarzeń, sianie zamętu.",
            example: "Raz opowiada jedną wersję policji, inną rodzinie, jeszcze inną sądowi. Zawsze jest przekonana, że mówi prawdę – w danym momencie.",
            redFlags: [
                "Czy historie tej osoby ciągle się zmieniają?",
                "Czy trudno wyciągnąć z niej konkretną, spójną odpowiedź?",
                "Czy wprowadza chaos informacyjny?"
            ]
        },
        {
            id: 8,
            title: "Sianie podziałów i rozbijanie więzi",
            description: "Nastawianie rodziny przeciwko sobie, budowanie sojuszy.",
            example: "„Twój brat też mówił, że masz problem, Wszyscy są po mojej stronie – takie teksty służą dzieleniu rodziny.",
            redFlags: [
                "Czy ktoś zawsze szuka sojuszników, oczernia innych za plecami?",
                "Czy przez tę osobę rodzina przestała się wspierać, rozpadła się?",
                "Czy stosuje taktykę dziel i rządź?"
            ]
        }
    ];

    function generateGuideSection(item, index) {
        return `
            <article class="guide-section bg-gray-900/50 p-6 rounded-xl border-l-4 border-red-800 transition-all duration-300" data-section="${item.id}">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold text-red-300 special-elite">
                        Grzech ${item.id}: ${item.title}
                    </h3>
                    <div class="flex items-center space-x-3">
                        <button class="quiz-btn bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition">
                            <i class="fas fa-question-circle mr-1"></i>Quiz
                        </button>
                        <div class="completion-indicator w-6 h-6 border-2 border-gray-600 rounded-full flex items-center justify-center">
                            <i class="fas fa-check text-green-400 text-sm hidden"></i>
                        </div>
                    </div>
                </div>
                
                <p class="mb-4 text-gray-300"><strong>Opis:</strong> ${item.description}</p>
                
                <div class="bg-gray-800/50 p-4 rounded-lg border-l-2 border-amber-500 mb-4">
                    <p class="italic text-amber-200"><strong>Przykład z życia:</strong> ${item.example}</p>
                </div>
                
                <div class="mt-4">
                    <h4 class="font-bold text-amber-400 mb-3 flex items-center">
                        <i class="fas fa-exclamation-triangle mr-2"></i>Jak wykryć:
                    </h4>
                    <ul class="space-y-2">
                        ${item.redFlags.map(flag => `
                            <li class="flex items-start text-gray-300">
                                <i class="fas fa-flag text-red-400 mr-3 mt-1 flex-shrink-0"></i>
                                <span>${flag}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="mt-6 flex justify-between items-center">
                    <button class="mark-complete-btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
                        <i class="fas fa-check mr-2"></i>Oznacz jako przeczytane
                    </button>
                    <div class="text-sm text-gray-500">
                        Sekcja ${index + 1} z ${guideData.length}
                    </div>
                </div>
            </article>
        `;
    }

    function initializeGuide() {
        const guideSections = doc.getElementById('guide-sections');
        if (!guideSections) return;

        guideSections.innerHTML = guideData.map((item, index) => generateGuideSection(item, index)).join('');

        // Add event listeners
        guideSections.querySelectorAll('.mark-complete-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => markSectionComplete(index + 1));
        });

        guideSections.querySelectorAll('.quiz-btn').forEach((btn, index) => {
            btn.addEventListener('click', () => startQuiz(index + 1));
        });

        updateProgress();
    }

    function markSectionComplete(sectionId) {
        const completedSections = JSON.parse(localStorage.getItem('completedSections') || '[]');
        if (!completedSections.includes(sectionId)) {
            completedSections.push(sectionId);
            localStorage.setItem('completedSections', JSON.stringify(completedSections));
        }
        updateProgress();
        updateSectionUI(sectionId);
    }

    function updateSectionUI(sectionId) {
        const section = doc.querySelector(`[data-section="${sectionId}"]`);
        if (section) {
            const indicator = section.querySelector('.completion-indicator');
            const checkIcon = section.querySelector('.completion-indicator i');
            if (indicator && checkIcon) {
                indicator.classList.remove('border-gray-600');
                indicator.classList.add('border-green-400', 'bg-green-400/20');
                checkIcon.classList.remove('hidden');
            }
        }
    }

    function updateProgress() {
        const completedSections = JSON.parse(localStorage.getItem('completedSections') || '[]');
        const totalSections = guideData.length;
        const completedCount = completedSections.length;
        const percentage = Math.round((completedCount / totalSections) * 100);

        const progressBar = doc.getElementById('learning-progress');
        const progressText = doc.getElementById('progress-percentage');
        const completedText = doc.getElementById('completed-sections');

        if (progressBar) progressBar.style.width = percentage + '%';
        if (progressText) progressText.textContent = percentage + '%';
        if (completedText) completedText.textContent = completedCount;

        // Update individual section indicators
        completedSections.forEach(sectionId => updateSectionUI(sectionId));
    }

    function startQuiz(sectionId) {
        // Simple quiz implementation
        const section = guideData.find(item => item.id === sectionId);
        if (!section) return;

        const questions = [
            `Czy potrafisz rozpoznać sytuację opisaną w "${section.title}"?`,
            'Jak byś zareagował/a w takiej sytuacji?',
            'Jakie są najważniejsze czerwone flagi w tym przypadku?'
        ];

        const answers = window.prompt(`Quiz - ${section.title}\n\n${questions[0]}\n\nA) Tak, potrafię\nB) Nie jestem pewien/a\nC) Nie, potrzebuję więcej informacji`);
        
        if (answers) {
            alert('Dziękujemy za udział w quizie! Pamiętaj, że rozpoznawanie manipulacji to proces, który wymaga czasu i praktyki.');
            markSectionComplete(sectionId);
        }
    }

    // Initialize guide
    initializeGuide();

    // --- Community Voices ---
    const communityVoices = [
        {
            name: "~Ocalona82",
            message: "Ta historia to lustro mojego życia. Dziękuję, że o tym mówicie. Przez lata myślałam, że to ja jestem problemem.",
            timestamp: "2 dni temu"
        },
        {
            name: "~SzukającyPrawdy",
            message: "Dopiero teraz rozumiem, dlaczego 'prezenty' od niego tyle mnie kosztowały. Każdy dar miał swoją cenę.",
            timestamp: "5 dni temu"
        },
        {
            name: "~WolnaOdKłamstw",
            message: "Sekcja o gaslightingu otworzyła mi oczy. Przez 15 lat wmawiał mi, że mam problemy z pamięcią.",
            timestamp: "1 tydzień temu"
        },
        {
            name: "~NowePoczątki",
            message: "Kalendarz czerwonych flag pomógł mi udokumentować wzorce. Teraz widzę, że to nie były 'przypadki'.",
            timestamp: "2 tygodnie temu"
        },
        {
            name: "~Przetrwałam",
            message: "Dla wszystkich, którzy się wahają - wyjście jest możliwe. Jestem dowodem na to. Trzymajcie się!",
            timestamp: "3 tygodnie temu"
        }
    ];

    function loadCommunityVoices() {
        const container = doc.getElementById('community-voices');
        if (!container) return;

        container.innerHTML = communityVoices.map(voice => `
            <div class="border-b border-gray-700 pb-4">
                <div class="flex justify-between items-start mb-2">
                    <strong class="text-amber-400">${voice.name}</strong>
                    <span class="text-xs text-gray-500">${voice.timestamp}</span>
                </div>
                <p class="text-gray-300 italic">"${voice.message}"</p>
            </div>
        `).join('');
    }

    loadCommunityVoices();

    // --- AI Chat Simulator ---
    const chatForm = doc.getElementById('chat-form');
    const chatInput = doc.getElementById('chat-input');
    const chatContainer = doc.getElementById('chat-container');
    const chatReset = doc.getElementById('chat-reset');
    const chatAnalyze = doc.getElementById('chat-analyze');
    const chatAnalysis = doc.getElementById('chat-analysis');
    const analysisContent = doc.getElementById('analysis-content');

    const aiResponses = [
        { text: "Przesadzasz, jesteś zbyt wrażliwa/y.", technique: "Minimalizacja" },
        { text: "Nigdy czegoś takiego nie powiedziałem/am. Znowu zmyślasz.", technique: "Gaslighting" },
        { text: "Robię to wszystko dla twojego dobra, a ty tego nie doceniasz.", technique: "Fałszywa troska" },
        { text: "Gdybyś tylko bardziej się starał/a, nie musiałbym/abym się tak zachowywać.", technique: "Przerzucanie winy" },
        { text: "Wszyscy myślą, że zwariowałeś/aś. Tylko ja przy tobie trwam.", technique: "Izolacja" },
        { text: "Pamiętasz, jak było nam dobrze? Możemy do tego wrócić, jeśli tylko...", technique: "Hoovering" },
        { text: "Po tym wszystkim, co dla ciebie zrobiłem/am, tak mi się odwdzięczasz?", technique: "Szantaż emocjonalny" },
        { text: "To twoja wina, że jestem zdenerwowany/a.", technique: "Projekcja" }
    ];

    let chatHistory = [];

    function addChatMessage(sender, message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'text-right' : 'text-left';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'flex items-start space-x-3';
        
        if (!isUser) {
            messageContent.innerHTML = `
                <div class="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-user text-white text-sm"></i>
                </div>
                <div class="bg-gray-700 text-gray-200 px-4 py-3 rounded-lg max-w-xs">
                    <strong>Manipulator (AI):</strong> ${message}
                </div>
            `;
        } else {
            messageContent.innerHTML = `
                <div class="bg-amber-500 text-black px-4 py-3 rounded-lg max-w-xs ml-auto">
                    <strong>Ty:</strong> ${message}
                </div>
            `;
        }
        
        messageDiv.appendChild(messageContent);
        chatContainer.appendChild(messageDiv);
        
        // Limit chat history
        if (chatContainer.children.length > 20) {
            chatContainer.removeChild(chatContainer.firstChild);
        }
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const msg = chatInput.value.trim();
            if (msg) {
                addChatMessage('Użytkownik', msg, true);
                chatHistory.push({ sender: 'user', message: msg });
                
                setTimeout(() => {
                    const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                    addChatMessage('AI', response.text, false);
                    chatHistory.push({ sender: 'ai', message: response.text, technique: response.technique });
                }, 1200);
                
                chatInput.value = '';
            }
        });
    }

    if (chatReset) {
        chatReset.addEventListener('click', () => {
            chatHistory = [];
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
            if (chatAnalysis) chatAnalysis.classList.add('hidden');
        });
    }

    if (chatAnalyze) {
        chatAnalyze.addEventListener('click', () => {
            if (chatHistory.length === 0) {
                alert('Najpierw przeprowadź rozmowę z AI, aby móc ją przeanalizować.');
                return;
            }

            const techniques = [...new Set(chatHistory.filter(msg => msg.technique).map(msg => msg.technique))];
            
            if (analysisContent) {
                analysisContent.innerHTML = `
                    <p class="mb-4">W tej rozmowie AI użyło następujących technik manipulacji:</p>
                    <ul class="space-y-2">
                        ${techniques.map(technique => `
                            <li class="flex items-center">
                                <i class="fas fa-exclamation-triangle text-red-400 mr-2"></i>
                                <span class="font-semibold text-red-300">${technique}</span>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="mt-6 p-4 bg-blue-900/30 rounded-lg">
                        <h5 class="font-bold text-blue-300 mb-2">Wskazówki:</h5>
                        <p class="text-sm">Rozpoznanie tych technik to pierwszy krok do obrony przed manipulacją. W prawdziwej sytuacji pamiętaj o dokumentowaniu takich zachowań i szukaniu wsparcia.</p>
                    </div>
                `;
            }
            
            if (chatAnalysis) chatAnalysis.classList.remove('hidden');
        });
    }

    // --- Statistics Modal ---
    const statsBtn = doc.getElementById('stats-btn');
    const statsModal = doc.getElementById('stats-modal');
    const statsModalClose = doc.getElementById('stats-modal-close');

    if (statsBtn) {
        statsBtn.addEventListener('click', () => {
            if (statsModal) statsModal.classList.remove('hidden');
            initializeCharts();
        });
    }

    if (statsModalClose) {
        statsModalClose.addEventListener('click', () => {
            if (statsModal) statsModal.classList.add('hidden');
        });
    }

    function initializeCharts() {
        // Manipulation techniques chart
        const manipulationCtx = doc.getElementById('manipulation-chart');
        if (manipulationCtx && typeof Chart !== 'undefined') {
            new Chart(manipulationCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Gaslighting', 'Szantaż emocjonalny', 'Projekcja', 'Izolacja', 'Hoovering', 'Inne'],
                    datasets: [{
                        data: [35, 25, 15, 12, 8, 5],
                        backgroundColor: [
                            '#ef4444',
                            '#f97316',
                            '#eab308',
                            '#22c55e',
                            '#3b82f6',
                            '#8b5cf6'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#e5e7eb'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Najczęstsze techniki manipulacji',
                            color: '#e5e7eb'
                        }
                    }
                }
            });
        }

        // Violence cycle chart
        const cycleCtx = doc.getElementById('cycle-chart');
        if (cycleCtx && typeof Chart !== 'undefined') {
            new Chart(cycleCtx, {
                type: 'line',
                data: {
                    labels: ['Rok 1', 'Rok 2', 'Rok 3', 'Rok 4', 'Rok 5', 'Rok 6', 'Rok 7', 'Rok 8'],
                    datasets: [{
                        label: 'Intensywność przemocy',
                        data: [2, 4, 3, 6, 5, 8, 7, 9],
                        borderColor: '#ef4444',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 10,
                            ticks: {
                                color: '#e5e7eb'
                            },
                            grid: {
                                color: '#374151'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#e5e7eb'
                            },
                            grid: {
                                color: '#374151'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#e5e7eb'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Cykl 8-letni: Eskalacja przemocy',
                            color: '#e5e7eb'
                        }
                    }
                }
            });
        }
    }

    // --- Theme Toggle ---
    const themeToggle = doc.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            doc.body.classList.toggle('theme-light');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon');
                icon.classList.toggle('fa-sun');
            }
        });
    }

    // --- Emergency Help ---
    const emergencyHelp = doc.getElementById('emergency-help');
    const emergencyModal = doc.getElementById('emergency-modal');
    const emergencyClose = doc.getElementById('emergency-close');

    if (emergencyHelp) {
        emergencyHelp.addEventListener('click', () => {
            if (emergencyModal) emergencyModal.classList.remove('hidden');
        });
    }

    if (emergencyClose) {
        emergencyClose.addEventListener('click', () => {
            if (emergencyModal) emergencyModal.classList.add('hidden');
        });
    }

    // --- Scroll to top button ---
    const toTopButton = doc.getElementById('to-top-button');
    if (toTopButton) {
        window.addEventListener('scroll', () => {
            toTopButton.classList.toggle('hidden', window.scrollY <= 300);
        });
        toTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // --- Start button overlay ---
    const startBtn = doc.getElementById('start-btn');
    const autoplayOverlay = doc.getElementById('autoplay-overlay');
    const heroListenBtn = doc.getElementById('hero-listen-btn');
    const heroLearnBtn = doc.getElementById('hero-learn-btn');

    function hideOverlay() {
        if (autoplayOverlay) autoplayOverlay.classList.add('hidden');
        // Initialize audio context for better browser compatibility
        if (radioPlayer) {
            radioPlayer.play().then(() => radioPlayer.pause()).catch(() => {});
        }
        if (podcastPlayer) {
            podcastPlayer.play().then(() => podcastPlayer.pause()).catch(() => {});
        }
        generateRadioQueue();
    }

    if (startBtn) startBtn.addEventListener('click', hideOverlay);
    if (heroListenBtn) {
        heroListenBtn.addEventListener('click', () => {
            hideOverlay();
            doc.getElementById('live-player')?.scrollIntoView({ behavior: 'smooth' });
        });
    }
    if (heroLearnBtn) {
        heroLearnBtn.addEventListener('click', () => {
            hideOverlay();
            doc.getElementById('poradnik')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- Smooth scrolling for navigation ---
    doc.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = doc.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- Scroll animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    doc.querySelectorAll('section, article').forEach(el => {
        el.classList.add('fade-in-up');
        observer.observe(el);
    });

    // --- Helper functions ---
    function escapeHTML(str) {
        const p = document.createElement('p');
        p.textContent = str;
        return p.innerHTML;
    }

    // Set current year
    const currentYearEl = doc.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // --- Audio Visualizer Canvas ---
    const canvas = doc.getElementById('audio-visualizer');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let animationId;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function drawVisualizer() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Create simple animated background
            const time = Date.now() * 0.001;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Draw animated circles
            for (let i = 0; i < 5; i++) {
                const radius = 50 + i * 30 + Math.sin(time + i) * 20;
                const alpha = 0.1 - i * 0.02;
                
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            
            animationId = requestAnimationFrame(drawVisualizer);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        drawVisualizer();
    }

    // Load playlist on page load
    loadPlaylist();
});