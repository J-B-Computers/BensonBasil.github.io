// Download resume functionality
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

// Load content for each section
const sections = ['summary', 'experience', 'education', 'skills', 'projects', 'personal', 'contact'];
sections.forEach(section => {
    fetch(`${section}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById(section).innerHTML = data;
        });
});