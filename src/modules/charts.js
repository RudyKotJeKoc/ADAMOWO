import Chart from 'chart.js/auto';

export function initializeCharts(doc) {
  const manipulationCanvas = doc.getElementById('manipulation-chart');
  if (manipulationCanvas) {
    new Chart(manipulationCanvas, {
      type: 'doughnut',
      data: {
        labels: ['Gaslighting', 'Szantaż emocjonalny', 'Projekcja', 'Izolacja', 'Hoovering', 'Inne'],
        datasets: [
          {
            data: [35, 25, 15, 12, 8, 5],
            backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6']
          }
        ]
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

  const cycleCanvas = doc.getElementById('cycle-chart');
  if (cycleCanvas) {
    new Chart(cycleCanvas, {
      type: 'line',
      data: {
        labels: ['Rok 1', 'Rok 2', 'Rok 3', 'Rok 4', 'Rok 5', 'Rok 6', 'Rok 7', 'Rok 8'],
        datasets: [
          {
            label: 'Intensywność przemocy',
            data: [2, 4, 3, 6, 5, 8, 7, 9],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4
          }
        ]
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
