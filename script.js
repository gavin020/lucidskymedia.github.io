// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Language Toggle
function toggleLanguage() {
    const button = document.getElementById('language-toggle');
    const currentLang = button.textContent.trim().toLowerCase() === 'english' ? 'en' : 'nl';
    const newLang = currentLang === 'en' ? 'nl' : 'en';
    button.textContent = newLang === 'en' ? 'English' : 'Nederlands';
    
    document.querySelectorAll('[data-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-${newLang}`);
    });
    document.querySelectorAll('a[data-en]').forEach(link => {
        link.textContent = link.getAttribute(`data-${newLang}`);
    });
    document.querySelectorAll('li span[data-en]').forEach(span => {
        span.textContent = span.getAttribute(`data-${newLang}`);
    });
}

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Scroll-triggered animations for sections and work items
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
});

// Trigger animations on page load for elements already in view
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section, .highlight-section, .work-item').forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            element.classList.add('visible');
        }
    });

    // Shape Spawning Mechanism
    const shapeContainer = document.querySelector('.shape-container');
    const shapeTypes = ['sphere-3d', 'cube-3d', 'tetrahedron-3d', 'dodecahedron-3d'];
    const rotationDirections = ['clockwise', 'counterclockwise'];
    const floatSpeeds = ['15s', '17s', '18s', '19s', '20s', '22s'];

    function spawnShape() {
        const shape = document.createElement('div');
        shape.classList.add('shape');

        // Random shape type
        const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
        shape.classList.add(shapeType);

        // Random rotation direction
        const rotation = rotationDirections[Math.floor(Math.random() * rotationDirections.length)];
        shape.setAttribute('data-rotation', rotation);

        // Random float speed
        const floatSpeed = floatSpeeds[Math.floor(Math.random() * floatSpeeds.length)];
        shape.setAttribute('data-float-speed', floatSpeed);
        shape.style.setProperty('--float-speed', floatSpeed);

        // Random horizontal position
        const leftPosition = Math.random() * 90 + 5; // Between 5% and 95%
        shape.style.left = `${leftPosition}%`;

        // Append to container
        shapeContainer.appendChild(shape);

        // Remove shape after animation completes to prevent DOM clutter
        setTimeout(() => {
            shape.remove();
        }, parseFloat(floatSpeed) * 1000);
    }

    // Start spawning shapes
    setInterval(spawnShape, 2000); // Spawn a new shape every 2 seconds
});

// Parallax effect for video background
window.addEventListener('scroll', () => {
    const video = document.querySelector('#bg-video');
    video.style.transform = `translateY(${window.scrollY * 0.2}px)`;
});

// Geolocation-based dynamic text replacement
document.addEventListener('DOMContentLoaded', () => {
    // Mapping of mentioned cities to nearby towns
    const cityMappings = {
        'Purmerend': ['Edam', 'Volendam', 'Hoorn', 'Wormerveer'],
        'Best': ['Eindhoven', 'Oirschot', 'Son en Breugel', 'Veldhoven'],
        'Zaandam': ['Koog aan de Zaan', 'Wormerveer', 'Assendelft', 'Westzaan'],
        'Krommenie': ['Wormerveer', 'Assendelft', 'Westzaan', 'Zaandijk'],
        'Randstad': ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague']
    };

    // Function to replace city names with nearby ones
    function replaceCities(nearbyCity) {
        document.querySelectorAll('[data-en]').forEach(element => {
            let enText = element.getAttribute('data-en');
            let nlText = element.getAttribute('data-nl');
            
            if (enText) {
                for (const [city, nearby] of Object.entries(cityMappings)) {
                    if (enText.includes(city)) {
                        const replacement = nearby[Math.floor(Math.random() * nearby.length)];
                        enText = enText.replace(city, replacement);
                    }
                }
                element.setAttribute('data-en', enText);
            }

            if (nlText) {
                for (const [city, nearby] of Object.entries(cityMappings)) {
                    if (nlText.includes(city)) {
                        const replacement = nearby[Math.floor(Math.random() * nearby.length)];
                        nlText = nlText.replace(city, replacement);
                    }
                }
                element.setAttribute('data-nl', nlText);
            }

            const currentLang = document.getElementById('language-toggle').textContent.trim().toLowerCase() === 'english' ? 'en' : 'nl';
            element.textContent = element.getAttribute(`data-${currentLang}`);
        });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                    .then(response => response.json())
                    .then(data => {
                        const nearbyCity = data.address.city || data.address.town || data.address.village || 'Amsterdam';
                        replaceCities(nearbyCity);
                    })
                    .catch(() => {
                        console.error('Error fetching location data, using default.');
                        replaceCities('Amsterdam');
                    });
            },
            error => {
                console.error('Geolocation error, using default:', error);
                replaceCities('Amsterdam');
            }
        );
    } else {
        console.error('Geolocation not supported, using default.');
        replaceCities('Amsterdam');
    }
});
