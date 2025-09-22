// Level2 specific application entry point
import '../src/styles/main.css';
import { initAnimations, gsap } from '../src/modules/animations.js';
import { setupInteractions } from '../src/modules/interactions.js';

// Level2 specific functionality
function initLevel2Features() {
    console.log('Initializing Level2 specific features...');
    
    // Initialize CSRF token fetching
    fetchCsrfToken();
    
    // Initialize radio player if elements exist
    initRadioPlayer();
    
    // Initialize infinity timeline with enhanced animation
    initInfinityTimeline();
    
    // Initialize calendar
    initCalendar();
}

async function fetchCsrfToken() {
    try {
        const response = await fetch('../api/v1/csrf-token');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const csrfToken = data.data.csrf_token;
        document.querySelector('meta[name="csrf-token"]').setAttribute('content', csrfToken);
        console.log('CSRF token updated');
    } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        const feedbackEl = document.getElementById('modal-feedback');
        if (feedbackEl) feedbackEl.textContent = 'Security error. Please refresh page.';
    }
}

function initRadioPlayer() {
    const radioPlayer = document.getElementById('radio-player');
    if (!radioPlayer) return;
    
    // Enhanced radio player functionality
    console.log('Radio player initialized');
}

function initInfinityTimeline() {
    const path = document.getElementById('infinity-path');
    const avatarD = document.getElementById('avatar-d');
    const avatarB = document.getElementById('avatar-b');
    const description = document.getElementById('timeline-description');
    
    if (!path || !avatarD || !avatarB) return;
    
    console.log('Initializing infinity timeline...');
    
    const stages = [
        { range: [0, 0.25], text: "Początek dewaluacji: pojawiają się pierwsze drobne uszczypliwości." },
        { range: [0.25, 0.5], text: "Eskalacja: otwarty konflikt i gaslighting." },
        { range: [0.5, 0.75], text: "Faza odrzucenia: manipulator karze ofiarę ciszą." },
        { range: [0.75, 1.0], text: "Powrót do idealizacji (hoovering): obietnice poprawy." }
    ];

    let progress = 0;
    
    function updateTimelineState(currentProgress) {
        const stage = stages.find(s => currentProgress >= s.range[0] && currentProgress <= s.range[1]) || stages[0];
        
        if (description) {
            description.textContent = stage.text;
        }
        
        // Animate avatars using basic GSAP (without premium plugins)
        const angle1 = currentProgress * Math.PI * 2;
        const angle2 = (currentProgress + 0.5) * Math.PI * 2;
        const radius = 60;
        
        gsap.to(avatarD, {
            x: Math.cos(angle1) * radius,
            y: Math.sin(angle1) * radius * 0.6,
            duration: 1,
            ease: "power2.inOut"
        });
        
        gsap.to(avatarB, {
            x: Math.cos(angle2) * radius,
            y: Math.sin(angle2) * radius * 0.6,
            duration: 1,
            ease: "power2.inOut"
        });
    }
    
    // Auto-animate timeline
    function animate() {
        progress += 0.005;
        if (progress >= 1) progress = 0;
        updateTimelineState(progress);
        requestAnimationFrame(animate);
    }
    
    animate();
}

function initCalendar() {
    // Enhanced calendar functionality
    if (typeof flatpickr !== 'undefined') {
        console.log('Calendar initialized with flatpickr');
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    console.log('Radio Adamowo Level2 - Loading...');
    
    // Initialize base functionality
    setupInteractions();
    initAnimations();
    
    // Initialize level2 specific features
    initLevel2Features();
    
    console.log('Radio Adamowo Level2 - Ready!');
});