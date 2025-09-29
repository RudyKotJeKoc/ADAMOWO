export function initializeVisualizer(doc) {
  const canvas = doc.getElementById('audio-visualizer');
  if (!canvas) {
    return;
  }

  const context = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawVisualizer() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    const time = Date.now() * 0.001;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let index = 0; index < 5; index += 1) {
      const radius = 50 + index * 30 + Math.sin(time + index) * 20;
      const alpha = 0.1 - index * 0.02;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
      context.lineWidth = 2;
      context.stroke();
    }

    requestAnimationFrame(drawVisualizer);
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawVisualizer();
}
