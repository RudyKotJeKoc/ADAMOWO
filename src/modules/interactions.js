export function setupInteractions() {
    setupSmoothScrolling();
    setupModalInteractions();
    setupFormHandling();
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function setupModalInteractions() {
    // Modal setup logic can be added here
    // Currently focusing on the basic smooth scrolling functionality
}

function setupFormHandling() {
    // Form handling logic can be added here
    // Currently focusing on the basic interactions
}

// Animation utilities
export function fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease`;
    
    // Force reflow
    element.offsetHeight;
    
    element.style.opacity = '1';
}

export function fadeOut(element, duration = 300) {
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = '0';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, duration);
}