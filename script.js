
// Background animation script
const canvas = document.getElementById('background-animation');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 150;
let mouse = { x: null, y: null, radius: 100 };

for (let i = 0; i < particleCount; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 360}, 50%, 50%)`,
        speed: Math.random() * 1 + 0.5,
        angle: Math.random() * Math.PI * 2,
        velocity: { x: 0, y: 0 } // For mouse interaction
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - particle.x;
            let dy = mouse.y - particle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (mouse.radius - distance) / mouse.radius;
                particle.velocity.x += forceDirectionX * force * particle.speed;
                particle.velocity.y += forceDirectionY * force * particle.speed;
            }
        }

        // Movement (combined with mouse interaction)
        particle.x += Math.cos(particle.angle) * particle.speed + particle.velocity.x;
        particle.y += Math.sin(particle.angle) * particle.speed + particle.velocity.y;

        // Friction and boundary check
        particle.velocity.x *= 0.95;
        particle.velocity.y *= 0.95;
        if (particle.x < 0 || particle.x > canvas.width) particle.angle = Math.PI - particle.angle;
        if (particle.y < 0 || particle.y > canvas.height) particle.angle = -particle.angle;

        // Particle connections
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

    requestAnimationFrame(drawParticles); // Request next frame
}

drawParticles(); // Start the animation loop

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


// Sticky header script
window.onscroll = function() {
    var header = document.getElementById("sticky-header");
    if (window.pageYOffset > 100) {
        header.classList.add("visible");
    } else {
        header.classList.remove("visible");
    }
}

// Add this to your existing script
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('#sticky-header nav ul li a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            currentSection = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active-section');
        if (item.getAttribute('href').slice(1) === currentSection) {
            item.classList.add('active-section');
        }
    });
});

window.addEventListener('scroll', function() {
    // ... existing scroll code ...

    const currentSectionElement = document.getElementById('current-section');
    if (currentSection) {
        currentSectionElement.textContent = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
        currentSectionElement.style.opacity = 1;
    } else {
        currentSectionElement.style.opacity = 0;
    }
});

document.getElementById('download-resume').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Replace 'resume.pdf' with the actual name of your PDF file
    var fileUrl = 'https://raw.githubusercontent.com/bensonbasil/Benson_Basil/main/Files/resume.pdf';
    
    var link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'Benson_Basil_Resume.pdf'; // The name the file will be downloaded as
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});