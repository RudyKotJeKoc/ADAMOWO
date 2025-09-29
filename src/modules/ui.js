export function setupGeneralUi(doc, audioControls, chartsInitializer) {
  const menuToggle = doc.getElementById('menu-toggle');
  const mobileMenu = doc.getElementById('mobile-menu');
  const statsButton = doc.getElementById('stats-btn');
  const statsModal = doc.getElementById('stats-modal');
  const statsModalClose = doc.getElementById('stats-modal-close');
  const themeToggle = doc.getElementById('theme-toggle');
  const emergencyHelp = doc.getElementById('emergency-help');
  const emergencyModal = doc.getElementById('emergency-modal');
  const emergencyClose = doc.getElementById('emergency-close');
  const toTopButton = doc.getElementById('to-top-button');
  const startButton = doc.getElementById('start-btn');
  const autoplayOverlay = doc.getElementById('autoplay-overlay');
  const heroListenButton = doc.getElementById('hero-listen-btn');
  const heroLearnButton = doc.getElementById('hero-learn-btn');
  const currentYearLabel = doc.getElementById('current-year');

  menuToggle?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('hidden');
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  statsButton?.addEventListener('click', () => {
    statsModal?.classList.remove('hidden');
    chartsInitializer(doc);
  });

  statsModalClose?.addEventListener('click', () => {
    statsModal?.classList.add('hidden');
  });

  themeToggle?.addEventListener('click', () => {
    doc.body.classList.toggle('theme-light');
    const icon = themeToggle.querySelector('i');
    icon?.classList.toggle('fa-moon');
    icon?.classList.toggle('fa-sun');
  });

  emergencyHelp?.addEventListener('click', () => {
    emergencyModal?.classList.remove('hidden');
  });

  emergencyClose?.addEventListener('click', () => {
    emergencyModal?.classList.add('hidden');
  });

  if (toTopButton) {
    window.addEventListener('scroll', () => {
      toTopButton.classList.toggle('hidden', window.scrollY <= 300);
    });

    toTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function hideAutoplayOverlay() {
    autoplayOverlay?.classList.add('hidden');
    audioControls?.prepareAutoplayUnlock();
  }

  startButton?.addEventListener('click', hideAutoplayOverlay);

  heroListenButton?.addEventListener('click', () => {
    hideAutoplayOverlay();
    doc.getElementById('live-player')?.scrollIntoView({ behavior: 'smooth' });
  });

  heroLearnButton?.addEventListener('click', () => {
    hideAutoplayOverlay();
    doc.getElementById('poradnik')?.scrollIntoView({ behavior: 'smooth' });
  });

  doc.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      const target = doc.querySelector(anchor.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  doc.querySelectorAll('section, article').forEach((element) => {
    element.classList.add('fade-in-up');
    observer.observe(element);
  });

  if (currentYearLabel) {
    currentYearLabel.textContent = new Date().getFullYear();
  }
}
