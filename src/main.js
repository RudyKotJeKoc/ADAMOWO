import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import flatpickr from 'flatpickr';
import { Polish } from 'flatpickr/dist/l10n/pl.js';

import '../style.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/dark.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { setupAudioExperience } from './modules/audio.js';
import { setupCalendar } from './modules/calendar.js';
import { setupGuide } from './modules/guide.js';
import { renderCommunityVoices } from './modules/community.js';
import { setupChat } from './modules/chat.js';
import { initializeCharts } from './modules/charts.js';
import { initializeVisualizer } from './modules/visualizer.js';
import { initializeTimelineAnimation } from './modules/timeline.js';
import { setupGeneralUi } from './modules/ui.js';
import { registerServiceWorker } from './modules/serviceWorker.js';

// Register GSAP plugins used by the infinity timeline animation.
gsap.registerPlugin(Draggable, MotionPathPlugin);

document.addEventListener('DOMContentLoaded', () => {
  const doc = document;

  const audioControls = setupAudioExperience(doc);
  setupCalendar(doc, flatpickr, Polish);
  setupGuide(doc);
  renderCommunityVoices(doc);
  setupChat(doc);
  initializeVisualizer(doc);
  initializeTimelineAnimation(doc, gsap, Draggable);
  setupGeneralUi(doc, audioControls, initializeCharts);

  audioControls.loadPlaylist();
  registerServiceWorker();
});
