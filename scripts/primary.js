// Sticky Header
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
    currentSectionDisplay.addEventListener('click', () => {
        header.classList.toggle('nav-open');
    });
}