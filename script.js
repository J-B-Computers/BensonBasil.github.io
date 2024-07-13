        // Background animation script
        const canvas = document.getElementById('background-effect');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 400;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2.5 + 0.1,
                color: `hsl(${Math.random() * 9960}, 50%, 50%)`,
                speed: Math.random() * .2 + .2,
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
                        ctx.lineWidth = .2;
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

// Mouse interaction
let mouse = { x: null, y: null, radius: 100 };

canvas.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    
    particles.forEach(particle => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            particle.speedX += dx * force * 0.02;
            particle.speedY += dy * force * 0.02;
        }
    });
});
// --- Sticky Header ---
const header = document.getElementById('sticky-header');
const headerContent = header.querySelector('.header-content');

fetch('header.html')
    .then(response => response.text())
    .then(data => {
        header.innerHTML = data;
        initializeNavigation();
    });

function initializeNavigation() {
    const navItems = document.querySelectorAll('#sticky-header nav ul li a');
    const currentSectionDisplay = document.getElementById('current-section');
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            header.classList.add('visible');
        } else {
            header.classList.remove('visible');
        }

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

        if (currentSection) {
            currentSectionDisplay.textContent = currentSection.charAt(0).toUpperCase() + currentSection.slice(1);
            currentSectionDisplay.style.opacity = 1;
        } else {
            currentSectionDisplay.style.opacity = 0;
        }
    });

    // Mobile navigation
    const navToggle = document.querySelector('.nav-toggle');
    navToggle.addEventListener('click', () => {
        headerContent.classList.toggle('nav-open');
    });
}

// --- Download Resume ---
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'download-resume') {
        e.preventDefault();
        
        var fileUrl = 'https://raw.githubusercontent.com/bensonbasil/Benson_Basil/main/Files/resume.pdf';
        
        var link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'Benson_Basil_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});

// --- Load Section Content ---
const sections = ['summary', 'experience', 'education', 'skills', 'projects', 'personal', 'contact'];
sections.forEach(section => {
    fetch(`${section}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById(section).innerHTML = data;
        });
});



// --- Scroll to Top ---
document.querySelector('#sticky-header .profile-pic').addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});