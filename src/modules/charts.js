import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export function initializeCharts() {
    initManipulationChart();
    initCycleChart();
}

function initManipulationChart() {
    const ctx = document.getElementById('manipulation-chart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
            datasets: [{
                label: 'Intensywność Manipulacji',
                data: [12, 19, 23, 35, 42, 38, 31, 28],
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { 
                    labels: { color: 'white' }
                }
            },
            scales: {
                x: { ticks: { color: 'white' } },
                y: { ticks: { color: 'white' } }
            }
        }
    });
}

function initCycleChart() {
    const ctx = document.getElementById('cycle-chart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Narastanie', 'Wybuch', 'Miodowy Miesiąc', 'Spokojna Faza'],
            datasets: [{
                data: [30, 20, 25, 25],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: { color: 'white' }
                }
            }
        }
    });
}