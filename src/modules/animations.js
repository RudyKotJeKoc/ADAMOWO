import { gsap } from 'gsap';

// Note: Premium plugins like Draggable and MotionPathPlugin require a commercial license
// For this demo, we'll use basic GSAP functionality and provide fallbacks

let animationsEnabled = true;

export function initAnimations() {
    console.log('Initializing GSAP animations...');
    
    // Basic GSAP animations that work with the free version
    initBasicAnimations();
    
    // Try to initialize interactive timeline (fallback implementation)
    initTimelineInteraction();
}

function initBasicAnimations() {
    // Fade in elements on load
    const fadeElements = document.querySelectorAll('[data-fade-in]');
    fadeElements.forEach((element, index) => {
        gsap.fromTo(element, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0, 
                duration: 0.6, 
                delay: index * 0.1,
                ease: "power2.out"
            }
        );
    });

    // Animate cards on hover
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (animationsEnabled) {
                gsap.to(card, { 
                    y: -8, 
                    scale: 1.02, 
                    duration: 0.3, 
                    ease: "power2.out" 
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            if (animationsEnabled) {
                gsap.to(card, { 
                    y: 0, 
                    scale: 1, 
                    duration: 0.3, 
                    ease: "power2.out" 
                });
            }
        });
    });
}

function initTimelineInteraction() {
    const timelineContainer = document.getElementById('infinity-timeline-container');
    const avatarD = document.getElementById('avatar-d');
    const avatarB = document.getElementById('avatar-b');
    const description = document.getElementById('timeline-description');

    if (!timelineContainer || !avatarD || !avatarB) {
        console.log('Timeline elements not found, skipping animation setup');
        return;
    }

    // Simplified timeline animation without premium plugins
    const stages = [
        { range: [0, 0.25], text: "Początek dewaluacji: pojawiają się pierwsze drobne uszczypliwości.", color: "text-green-400" },
        { range: [0.25, 0.5], text: "Eskalacja: otwarty konflikt i systematyczny gaslighting.", color: "text-yellow-400" },
        { range: [0.5, 0.75], text: "Faza odrzucenia: manipulator karze ofiarę ciszą i dystansem.", color: "text-orange-400" },
        { range: [0.75, 1.0], text: "Powrót do idealizacji: obietnice poprawy i nadzieję.", color: "text-red-400" }
    ];

    let currentStage = 0;
    let animationProgress = 0;

    // Create a simple click-to-progress interaction
    timelineContainer.addEventListener('click', () => {
        currentStage = (currentStage + 1) % stages.length;
        animationProgress = (currentStage + 1) / stages.length;
        
        updateTimelineState(animationProgress, stages);
    });

    // Auto-animate the timeline
    function autoAnimate() {
        animationProgress += 0.01;
        if (animationProgress > 1) animationProgress = 0;
        
        updateTimelineState(animationProgress, stages);
        
        if (animationsEnabled) {
            setTimeout(autoAnimate, 100);
        }
    }

    // Start auto-animation
    setTimeout(autoAnimate, 2000);
}

function updateTimelineState(progress, stages) {
    const description = document.getElementById('timeline-description');
    if (!description) return;

    // Find current stage
    const stage = stages.find(s => progress >= s.range[0] && progress <= s.range[1]) || stages[0];
    
    // Update description
    description.innerHTML = `
        <p class="${stage.color} font-medium transition-colors duration-500">
            ${stage.text}
        </p>
        <div class="mt-2 bg-gray-700 rounded-full h-2 overflow-hidden">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500" 
                 style="width: ${progress * 100}%"></div>
        </div>
    `;

    // Animate avatars with basic positioning (simplified version without MotionPath)
    const avatarD = document.getElementById('avatar-d');
    const avatarB = document.getElementById('avatar-b');
    
    if (avatarD && avatarB) {
        const angle1 = progress * Math.PI * 2;
        const angle2 = (progress + 0.5) * Math.PI * 2;
        const radius = 80;
        
        const x1 = Math.cos(angle1) * radius;
        const y1 = Math.sin(angle1) * radius * 0.5; // Make it more elliptical
        const x2 = Math.cos(angle2) * radius;
        const y2 = Math.sin(angle2) * radius * 0.5;
        
        gsap.to(avatarD, { 
            x: x1, 
            y: y1, 
            duration: 0.5, 
            ease: "power2.out" 
        });
        
        gsap.to(avatarB, { 
            x: x2, 
            y: y2, 
            duration: 0.5, 
            ease: "power2.out" 
        });
    }
}

export function disableAnimations() {
    animationsEnabled = false;
    console.log('Animations disabled for performance');
}

export function enableAnimations() {
    animationsEnabled = true;
    console.log('Animations enabled');
}

// Export GSAP for other modules that might need it
export { gsap };