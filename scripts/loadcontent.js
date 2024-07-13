
document.addEventListener('DOMContentLoaded', () => {
    const sections = [
        { id: 'experience', file: 'html/experience.html' },
        { id: 'skills', file: 'html/skills.html' },
        { id: 'education', file: 'html/education.html' },
        { id: 'summary', file: 'html/summary.html' },
        { id: 'projects', file: 'html/projects.html' },
        { id: 'header', file: 'html/header.html' },
        { id: 'personal', file: 'html/personal.html' },
        { id: 'contact', file: 'html/contact.html' },
    ];

    sections.forEach(section => {
        const sectionElement = document.getElementById(section.id);

        fetch(section.file)
            .then(response => response.text())
            .then(data => {
                sectionElement.innerHTML = data;
            })
            .catch(error => {
                console.error(`Error loading ${section.id} content:`, error);
            });
    });
});