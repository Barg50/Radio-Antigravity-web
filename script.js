document.addEventListener('DOMContentLoaded', () => {
    // =============================================
    // MOBILE HAMBURGER MENU
    // =============================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Create overlay element
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            overlay.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            overlay.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });

        // Close menu when clicking a nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                overlay.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // =============================================
    // SMOOTH SCROLLING for anchor links
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // =============================================
    // CONTACT FORM → WhatsApp
    // =============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('form-nombre')?.value || '';
            const telefono = document.getElementById('form-telefono')?.value || '';
            const servicio = document.getElementById('form-servicio')?.value || '';
            const mensaje = document.getElementById('form-mensaje')?.value || '';

            if (!nombre || !telefono) {
                alert('Por favor, completa tu nombre y teléfono para poder contactarte.');
                return;
            }

            // Build formatted WhatsApp message
            let textoWhatsapp = `Hola, me comunico con el centro audiológico BeopenSound. Me gustaría recibir orientación sobre sus servicios y agendar una hora, por favor.%0A%0A*Datos del Paciente:*%0A👤 Nombre: ${nombre}%0A📞 Teléfono: ${telefono}`;
            
            if (servicio) {
                textoWhatsapp += `%0A🔧 Servicio: ${servicio}`;
            }
            if (mensaje) {
                textoWhatsapp += `%0A💬 Consulta: ${mensaje}`;
            }

            // Redirect to WhatsApp
            const url = `https://wa.me/56971372348?text=${textoWhatsapp}`;
            window.open(url, '_blank');

            // Visual feedback
            const submitBtn = contactForm.querySelector('.submit-btn');
            if (submitBtn) {
                submitBtn.textContent = '¡Redirigiendo a WhatsApp!';
                submitBtn.style.backgroundColor = '#25d366';
                submitBtn.style.color = '#fff';
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.textContent = 'Solicitar Atención por WhatsApp';
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                }, 3000);
            }
        });
    }

    // =============================================
    // CONTACT FORM PAGE → Dual Actions (WhatsApp/Email)
    // =============================================
    const btnWspContact = document.getElementById('btn-wsp-contact');
    const contactFormPage = document.getElementById('contactFormPage');

    if (btnWspContact && contactFormPage) {
        btnWspContact.addEventListener('click', (e) => {
            // Check HTML5 validation first
            if (!contactFormPage.checkValidity()) {
                contactFormPage.reportValidity();
                return;
            }

            const nombre = document.getElementById('name')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const telefono = document.getElementById('telefono')?.value || '';
            const servicio = document.getElementById('service')?.value || '';
            const mensaje = document.getElementById('message')?.value || '';

            // Build formatted WhatsApp message
            let textoWhatsapp = `Hola, me comunico con el centro audiológico BeopenSound. Me gustaría contactarme por el siguiente motivo:%0A%0A*Datos del Paciente:*%0A👤 Nombre: ${nombre}%0A✉️ Correo: ${email}%0A📞 Teléfono: ${telefono}`;
            
            if (servicio) {
                textoWhatsapp += `%0A🔧 Servicio: ${servicio}`;
            }
            if (mensaje) {
                textoWhatsapp += `%0A💬 Consulta: ${mensaje}`;
            }

            // Redirect to WhatsApp
            const url = `https://wa.me/56971372348?text=${textoWhatsapp}`;
            window.open(url, '_blank');

            // Visual feedback
            btnWspContact.innerHTML = '<i class="fab fa-whatsapp"></i> ¡Redirigiendo!';
            setTimeout(() => {
                contactFormPage.reset();
                btnWspContact.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar por WhatsApp';
            }, 3000);
        });
    }
});
