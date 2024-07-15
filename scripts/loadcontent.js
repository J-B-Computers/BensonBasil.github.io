
document.addEventListener('DOMContentLoaded', () => {
    const sections = [
        { id: 'experience', file: 'experience.html' },
        { id: 'skills', file: 'skills.html' },
        { id: 'education', file: 'education.html' },
        { id: 'summary', file: 'summary.html' },
        { id: 'projects', file: 'projects.html' },
        { id: 'header', file: 'header.html' },
        { id: 'personal', file: 'personal.html' },
        { id: 'contact', file: 'contact.html' },
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