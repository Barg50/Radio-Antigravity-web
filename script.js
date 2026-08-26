document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust scroll position considering the fixed navbar
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 2. Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add offset for the navbar
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 3. Navbar Background Effect on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)'; // Darker slate
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
        } else {
            navbar.style.background = 'rgba(30, 41, 59, 0.7)'; // Original glass
            navbar.style.boxShadow = 'none';
        }
    });

    // 4. Update Copyright Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // 5. Weather Widget (Simulated for now, replace with real API call later)
    // Here we use a placeholder since we don't have the exact city yet.
    // In a real scenario, you'd use fetch() with an API like OpenWeatherMap.
    const loadWeather = () => {
        const locationEl = document.getElementById('weather-location');
        const tempEl = document.getElementById('temperature');
        const descEl = document.getElementById('weather-desc');
        const iconEl = document.getElementById('weather-icon');

        // Simulate network delay
        setTimeout(() => {
            locationEl.textContent = 'Viña del Mar, Chile'; // Change when city is confirmed
            tempEl.textContent = '18°C';
            descEl.textContent = 'Parcialmente nublado';
            // Update icon classes if needed
            iconEl.className = 'fa-solid fa-cloud-sun'; 
        }, 1500);
    };

    loadWeather();

    // 6. Radio Player Logic
    const radioAudio = document.getElementById('radio-stream');
    const playBtn = document.getElementById('radio-play-btn');
    const playIcon = document.getElementById('radio-play-icon');
    const liveDot = document.getElementById('radio-live-dot');
    const statusText = document.getElementById('radio-status-text');

    if (playBtn && radioAudio) {
        playBtn.addEventListener('click', () => {
            if (radioAudio.paused) {
                statusText.textContent = 'Conectando...';
                radioAudio.play().then(() => {
                    playIcon.className = 'fa-solid fa-stop';
                    liveDot.classList.add('playing');
                    statusText.textContent = 'Transmitiendo en Vivo';
                }).catch(error => {
                    console.error("Error reproduciendo audio:", error);
                    statusText.textContent = 'Error (Revisa tu conexión)';
                });
            } else {
                radioAudio.pause();
                radioAudio.src = radioAudio.src; // Reset stream connection to save data
                playIcon.className = 'fa-solid fa-play';
                liveDot.classList.remove('playing');
                statusText.textContent = 'Listo para escuchar';
            }
        });
    }
});
