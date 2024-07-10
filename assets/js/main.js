javascript
// Background animation
function setupBackgroundAnimation() {
  const canvas = document.createElement('canvas');
  canvas.id = 'background-animation';
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const particleCount = 150;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      color: `hsl(${Math.random() * 360}, 50%, 50%)`,
      speed: Math.random() * 1 + 0.5,
      angle: Math.random() * Math.PI * 2
    });
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();

      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed;

      if (particle.x < 0 || particle.x > canvas.width) particle.angle = Math.PI - particle.angle;
      if (particle.y < 0 || particle.y > canvas.height) particle.angle = -particle.angle;

      particles.forEach(other => {
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(drawParticles);
  }

  drawParticles();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Sticky header
function setupStickyHeader() {
  const header = document.getElementById("sticky-header");
  window.onscroll = function() {
    if (window.pageYOffset > 100) {
      header.classList.add("visible");
    } else {
      header.classList.remove("visible");
    }
  };
}

// Map display
function setupMap() {
  const showMapLink = document.getElementById('show-map');
  const mapContainer = document.getElementById('map');

  if (showMapLink && mapContainer) {
    showMapLink.addEventListener('click', function(e) {
      e.preventDefault();
      if (mapContainer.style.display === 'none') {
        mapContainer.style.display = 'block';
        mapContainer.innerHTML = '<iframe width="100%" height="100%" frameborder="0" style="border:0" src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Cranbourne,Victoria,Australia" allowfullscreen></iframe>';
      } else {
        mapContainer.style.display = 'none';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setupBackgroundAnimation();
  setupStickyHeader();
  setupMap();
});