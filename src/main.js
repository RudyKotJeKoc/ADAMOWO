// Main application entry point
import './styles/main.css';
import { initializeCharts } from './modules/charts.js';
import { setupInteractions } from './modules/interactions.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Radio Adamowo - Modern Platform Loading...');
    
    // Initialize chart functionality
    initializeCharts();
    
    // Setup UI interactions
    setupInteractions();
    
    console.log('Radio Adamowo - Platform Ready!');
});