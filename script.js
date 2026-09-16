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

                // Close mobile menu on navigation
                const navLinksContainer = document.querySelector('.nav-links');
                if (navLinksContainer) {
                    navLinksContainer.classList.remove('active');
                }
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinksContainer) {
        const toggleMenu = () => {
            const isOpen = navLinksContainer.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        };
        mobileMenuBtn.addEventListener('click', toggleMenu);
        mobileMenuBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });
    }

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
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 23, 42, 0.9)'; // Darker slate
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
        } else {
            navbar.style.background = 'rgba(30, 41, 59, 0.7)'; // Original glass
            navbar.style.boxShadow = 'none';
        }

        // Back to Top Visibility
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // 4. Update Copyright Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // 5. Reproductor de Radio en Vivo (stream directo de Listen2MyRadio, sin su página completa)
    const livePlayBtn = document.getElementById('live-play-btn');
    const liveAudio = document.getElementById('live-audio');
    const liveStatus = document.getElementById('live-status');
    const liveDot = document.getElementById('live-dot');
    // Proxy HTTPS de Listen2MyRadio hacia el servidor Icecast real (ip/port/mount de la cuenta de Radio Nazareo).
    // Evita el bloqueo de "contenido mixto" que da un <audio> apuntando directo a un stream http:// desde esta página https.
    const LIVE_STREAM_URL = 'https://fpsnew1.listen2myradio.com:2199/listen.php?ip=82.145.63.6&port=5151&type=ice&mount=stream';

    if (livePlayBtn && liveAudio && liveStatus) {
        const setStatus = (text, state = '') => {
            liveStatus.textContent = text;
            liveStatus.classList.remove('on-air', 'off-air');
            if (state) liveStatus.classList.add(state);
            if (liveDot) liveDot.hidden = state !== 'on-air';
        };

        const showPlayIcon = () => {
            livePlayBtn.classList.remove('playing');
            livePlayBtn.innerHTML = '<i class="fa-solid fa-play"></i> Escuchar en Vivo';
        };

        const showStopIcon = () => {
            livePlayBtn.classList.add('playing');
            livePlayBtn.innerHTML = '<i class="fa-solid fa-stop"></i> En Vivo Ahora';
        };

        const stopStream = () => {
            liveAudio.pause();
            liveAudio.removeAttribute('src');
            liveAudio.load();
            showPlayIcon();
        };

        livePlayBtn.addEventListener('click', () => {
            if (livePlayBtn.classList.contains('playing')) {
                stopStream();
                setStatus('Presiona play para escuchar');
                return;
            }

            livePlayBtn.disabled = true;
            setStatus('Conectando...');
            liveAudio.src = LIVE_STREAM_URL;
            liveAudio.load();
            liveAudio.play().catch(() => {
                // El evento 'error' del audio se encarga de mostrar el mensaje real (ej. fuera del aire)
            });
        });

        liveAudio.addEventListener('playing', () => {
            livePlayBtn.disabled = false;
            showStopIcon();
            setStatus('En vivo ahora', 'on-air');
        });

        liveAudio.addEventListener('error', () => {
            livePlayBtn.disabled = false;
            stopStream();
            setStatus('La radio está fuera del aire. Vuelve el miércoles a las 13:00 hrs.', 'off-air');
        });
    }

    // 6. Formulario de Saludos → se envía por WhatsApp (no hay backend propio conectado a este formulario)
    const greetingForm = document.querySelector('.greeting-form');
    if (greetingForm) {
        greetingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const message = document.getElementById('message').value.trim();
            const text = `Hola Radio Nazareo! Soy ${name} y quiero enviar este saludo/petición: ${message}`;
            window.open(`https://wa.me/56993706069?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
            greetingForm.reset();
        });
    }

});
