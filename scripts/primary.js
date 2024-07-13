document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('sticky-header');
    const nav = header.querySelector('.main-nav');
    const currentSection = document.getElementById('current-section');
    const sections = document.querySelectorAll('main section');
    const navToggle = document.createElement('button');
    navToggle.className = 'nav-toggle';
    navToggle.textContent = 'Menu';
    header.insertBefore(navToggle, nav);

    function updateCurrentSection() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 50) {
                current = section.getAttribute('id');
            }
        });
        currentSection.textContent = current;
    }

    function toggleMobileNav() {
        header.classList.toggle('nav-open');
    }

    window.addEventListener('scroll', function() {
        header.classList.toggle('sticky', window.scrollY > 0);
        updateCurrentSection();
    });

    nav.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
            if (header.classList.contains('nav-open')) {
                toggleMobileNav();
            }
        }
    });

    navToggle.addEventListener('click', toggleMobileNav);

    currentSection.addEventListener('click', toggleMobileNav);

    updateCurrentSection();
});

//Left Navigation Settings
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('left-nav');
    const summarySection = document.getElementById('summary');
  
    window.addEventListener('scroll', function() {
      if (window.scrollY >= summarySection.offsetTop) {
        nav.classList.add('visible');
      } else {
        nav.classList.remove('visible');
      }
    });
  });
  document.addEventListener('DOMContentLoaded', function() {
    const logoLink = document.querySelector('#left-nav .nav-logo');
    
    logoLink.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });