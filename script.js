// Language Toggle Functionality
function toggleLanguage() {
    const elements = document.querySelectorAll('[data-en][data-nl]');
    const currentLang = document.querySelector('.language-toggle button').innerText === 'EN/NL' ? 'nl' : 'en';
    
    elements.forEach(element => {
        element.innerText = currentLang === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-nl');
    });

    document.querySelector('.language-toggle button').innerText = currentLang === 'en' ? 'EN/NL' : 'NL/EN';
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});
