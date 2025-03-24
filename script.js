// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});
window.addEventListener('scroll', () => {
    document.querySelectorAll('.section').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            section.classList.add('visible');
        }
    });
});

window.addEventListener('scroll', () => {
    const video = document.querySelector('#bg-video');
    video.style.transform = `translateY(${window.scrollY * 0.2}px)`;
});
// Scroll-triggered animations
window.addEventListener('scroll', () => {
    document.querySelectorAll('.section, .highlight-section').forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            section.classList.add('visible');
        }
    });
    document.querySelectorAll('.work-item').forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            item.classList.add('visible');
        }
    });

    // Parallax effect for shapes (adjusted to not interfere with 3D rotation)
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach(shape => {
        const speed = shape.classList.contains('floating-shape-1') || shape.classList.contains('floating-shape-2') ? 0.3 : 0.1;
        const offset = window.scrollY * speed;
        // Apply parallax translation without overriding the rotation
        shape.style.transform = shape.style.transform.replace(/translateY\([^)]+\)/, '') + ` translateY(${offset}px)`;
    });
});
