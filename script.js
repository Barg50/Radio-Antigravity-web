document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const $ = (id) => document.getElementById(id);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Entrada breve (fade + 4px) para contenido que cambia de golpe. Con movimiento reducido: solo fade.
    const ENTER_EASING = 'cubic-bezier(0.23, 1, 0.32, 1)';
    const animateIn = (el, from = { transform: 'translateY(4px)' }) => {
        if (!el || !el.animate) return;
        const start = prefersReducedMotion.matches ? { opacity: 0 } : { opacity: 0, ...from };
        el.animate([start, { opacity: 1, transform: 'none' }], { duration: 200, easing: ENTER_EASING });
    };

    // ------------------------------------------------------------------
    // Ecualizador "reactivo": cada barra se mueve con un patrón que imita la música
    // (golpes de ritmo fuertes en los graves de la izquierda, agudos más nerviosos a la derecha).
    // No lee el audio real: el servidor del stream no envía cabeceras CORS y analizarlo silenciaría el sonido.
    // Solo se anima transform (scaleY) y se asigna directo al elemento.
    // ------------------------------------------------------------------
    const eqGroups = [...document.querySelectorAll('.eq')].map((eq) => {
        const bars = [...eq.querySelectorAll('i')];
        return bars.map((el, k) => {
            // altura de reposo: se lee del CSS para no duplicar los valores
            const base = new DOMMatrixReadOnly(getComputedStyle(el).transform).d || 0.4;
            return { el, base, value: base, pos: bars.length > 1 ? k / (bars.length - 1) : 0, k };
        });
    });
    const eqBars = eqGroups.flat();
    let eqRunning = false;
    let eqActive = false;   // true = sonando; false = volviendo al reposo
    let eqRaf = 0;
    let eqLast = 0;

    const eqFrame = (now) => {
        const dt = Math.min((now - eqLast) / 1000, 0.05);
        eqLast = now;
        const t = now / 1000;
        const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 4)), 6);   // golpe a ~120 bpm
        const swell = 0.7 + 0.3 * Math.sin(t * 0.8);                       // el "volumen" sube y baja lento
        let settled = true;

        eqBars.forEach((b) => {
            let target = b.base;
            if (eqActive) {
                const bass = 1 - b.pos * 0.65;
                const wobble = 0.5 + 0.5 * Math.sin(t * (3.1 + b.k * 1.7) + b.k * 2.3) * Math.sin(t * (1.3 + b.k * 0.9) + b.k);
                target = 0.14 + 0.86 * Math.min(1, swell * (beat * bass * 0.85 + wobble * 0.62));
            }
            // ataque rápido, caída más lenta (así se sienten los golpes)
            const rate = target > b.value ? 30 : 9;
            b.value += (target - b.value) * (1 - Math.exp(-dt * rate));
            b.el.style.transform = `scaleY(${b.value.toFixed(3)})`;
            if (Math.abs(target - b.value) > 0.01) settled = false;
        });

        if (!eqActive && settled) {
            eqBars.forEach((b) => { b.el.style.transform = ''; b.value = b.base; });
            eqRunning = false;
            return;
        }
        eqRaf = requestAnimationFrame(eqFrame);
    };

    const setEqActive = (active) => {
        eqActive = active && !prefersReducedMotion.matches;
        if (!eqRunning && eqActive) {
            eqRunning = true;
            eqLast = performance.now();
            eqRaf = requestAnimationFrame(eqFrame);
        }
    };

    // ------------------------------------------------------------------
    // Ondas de radio: círculos que se expanden desde el botón de play
    // ------------------------------------------------------------------
    const playWrap = $('play-wrap');
    const emitRings = (count = 3, variant = '') => {
        if (!playWrap || !playWrap.animate || prefersReducedMotion.matches) return;
        for (let i = 0; i < count; i++) {
            const ring = document.createElement('span');
            ring.className = `wave-ring ${variant}`;
            ring.setAttribute('aria-hidden', 'true');
            playWrap.appendChild(ring);
            const anim = ring.animate(
                [
                    { transform: 'scale(0.55)', opacity: 0.6 },
                    { transform: 'scale(5.5)', opacity: 0 }
                ],
                { duration: 1500, delay: i * 240, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'backwards' }
            );
            anim.onfinish = () => ring.remove();
        }
    };
    let ambientRings = 0;
    const setAmbientRings = (on) => {
        clearInterval(ambientRings);
        if (on) ambientRings = setInterval(() => { if (!document.hidden) emitRings(1, 'live'); }, 3200);
    };

    // ------------------------------------------------------------------
    // Confeti (canvas, sin librerías) para celebrar el saludo enviado
    // ------------------------------------------------------------------
    const burstConfetti = (originEl) => {
        if (prefersReducedMotion.matches) return;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:3000';
        document.body.appendChild(canvas);
        ctx.scale(dpr, dpr);

        const rect = originEl.getBoundingClientRect();
        const ox = rect.left + rect.width / 2;
        const oy = rect.top + rect.height / 2;
        const colors = ['#f2b93b', '#ffd978', '#8fd3f0', '#ffffff', '#ff5d4d'];
        const rand = (a, b) => a + Math.random() * (b - a);
        const parts = Array.from({ length: 110 }, () => {
            const angle = -Math.PI / 2 + rand(-0.75, 0.75);
            const speed = rand(520, 1150);
            return {
                x: ox, y: oy,
                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                size: rand(6, 11), rot: rand(0, Math.PI * 2), vr: rand(-9, 9),
                color: colors[Math.floor(Math.random() * colors.length)],
                round: Math.random() < 0.3, life: rand(1500, 2300)
            };
        });

        const start = performance.now();
        let last = start;
        const step = (now) => {
            const dt = Math.min((now - last) / 1000, 0.05);
            last = now;
            const age = now - start;
            ctx.clearRect(0, 0, w, h);
            let alive = false;
            parts.forEach((p) => {
                if (age > p.life) return;
                alive = true;
                p.vy += 1700 * dt;                  // gravedad
                p.vx *= Math.pow(0.12, dt);         // roce con el aire
                p.vy *= Math.pow(0.35, dt);
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.rot += p.vr * dt;
                ctx.globalAlpha = Math.min(1, (p.life - age) / 450);
                ctx.fillStyle = p.color;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                if (p.round) {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
                }
                ctx.restore();
            });
            if (alive) requestAnimationFrame(step);
            else canvas.remove();
        };
        requestAnimationFrame(step);
    };

    // 1. Menú móvil
    const navbar = $('navbar');
    const menuBtn = document.querySelector('.mobile-menu');
    const navLinksEl = $('nav-links');
    const menuIcon = menuBtn && menuBtn.querySelector('i');

    const setMenuOpen = (open) => {
        if (!menuBtn || !navLinksEl) return;
        navLinksEl.classList.toggle('active', open);
        menuBtn.setAttribute('aria-expanded', open);
        menuBtn.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        if (menuIcon) {
            menuIcon.classList.toggle('fa-bars', !open);
            menuIcon.classList.toggle('fa-xmark', open);
        }
    };

    if (menuBtn && navLinksEl) {
        menuBtn.addEventListener('click', () => setMenuOpen(!navLinksEl.classList.contains('active')));
        navLinksEl.addEventListener('click', (e) => { if (e.target.closest('a')) setMenuOpen(false); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenuOpen(false); });
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) setMenuOpen(false);
        });
    }

    // 2. Barra de navegación y botón "volver arriba" según el scroll (un solo listener pasivo, 1 lectura por cuadro)
    const fabs = document.querySelector('.fabs');
    let scrollTicking = false;
    const onScroll = () => {
        const y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 24);
        if (fabs) fabs.classList.toggle('visible', y > 520);
        scrollTicking = false;
    };
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();

    // 3. Enlace activo según la sección visible
    const navLinks = [...document.querySelectorAll('.nav-links a')];
    const sections = navLinks
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach((s) => spy.observe(s));
    }

    // 4. Aparición al hacer scroll (escalonada con --i desde el CSS)
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('in');
                io.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('in'));
    }

    // 5. Año del copyright
    $('year').textContent = new Date().getFullYear();

    // 6. Cuenta regresiva al próximo miércoles 13:00 (hora de Chile, con horario de verano)
    const TZ = 'America/Santiago';
    const tzFormat = new Intl.DateTimeFormat('en-US', {
        timeZone: TZ, hourCycle: 'h23',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric'
    });
    const wallTime = (ms) => {
        const p = {};
        tzFormat.formatToParts(ms).forEach((part) => { p[part.type] = +part.value; });
        return p;
    };
    // Diferencia entre la hora de pared en Chile y UTC para un instante dado
    const tzOffset = (ms) => {
        const w = wallTime(ms);
        return Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute, w.second) - Math.floor(ms / 1000) * 1000;
    };
    // Instante en que son las 13:00 en Chile, `addDays` días después de hoy (hora de Chile)
    const showTime = (now, addDays) => {
        const w = wallTime(now);
        const guess = Date.UTC(w.year, w.month - 1, w.day + addDays, 13, 0, 0);
        let t = guess - tzOffset(guess);
        t = guess - tzOffset(t);
        return t;
    };
    const nextShow = (now) => {
        const w = wallTime(now);
        const dow = new Date(Date.UTC(w.year, w.month - 1, w.day)).getUTCDay();
        let t = showTime(now, (3 - dow + 7) % 7);
        if (t <= now) t = showTime(now, (3 - dow + 7) % 7 + 7);
        return t;
    };

    const cd = { d: $('cd-d'), h: $('cd-h'), m: $('cd-m'), s: $('cd-s') };
    const cdLabel = $('countdown-label');
    const cdBox = $('countdown');
    const setText = (el, value) => { if (el.textContent !== value) el.textContent = value; };
    const pad = (n) => String(n).padStart(2, '0');
    const LIVE_WINDOW_MS = 90 * 60 * 1000; // la ventana en que "hoy es día de radio"

    const tick = () => {
        const now = Date.now();
        const next = nextShow(now);
        const sinceLast = now - (next - 7 * 864e5);
        const isShowDay = sinceLast >= 0 && sinceLast < LIVE_WINDOW_MS;
        cdBox.hidden = isShowDay;
        setText(cdLabel, isShowDay ? 'Hoy es miércoles de radio: ¡dale play!' : 'Próxima transmisión en');
        if (isShowDay) return;
        const s = Math.max(0, Math.floor((next - now) / 1000));
        setText(cd.d, String(Math.floor(s / 86400)));
        setText(cd.h, pad(Math.floor((s % 86400) / 3600)));
        setText(cd.m, pad(Math.floor((s % 3600) / 60)));
        setText(cd.s, pad(s % 60));
    };
    tick();
    setInterval(() => { if (!document.hidden) tick(); }, 1000);

    // 7. Reproductor de radio en vivo (stream directo de Listen2MyRadio, sin su página completa)
    const playBtn = $('live-play-btn');
    const audio = $('live-audio');
    const statusEl = $('live-status');
    const chipText = $('chip-text');
    const miniStop = $('mini-stop');
    // Proxy HTTPS de Listen2MyRadio hacia el servidor Icecast real (ip/port/mount de la cuenta de Radio Nazareo).
    // Evita el bloqueo de "contenido mixto" que da un <audio> apuntando directo a un stream http:// desde esta página https.
    const LIVE_STREAM_URL = 'https://fpsnew1.listen2myradio.com:2199/listen.php?ip=82.145.63.6&port=5151&type=ice&mount=stream';

    if (playBtn && audio && statusEl) {
        // idle | connecting | live | error
        let state = 'idle';

        const UI = {
            idle: { chip: 'Fuera del aire', label: '<i class="fa-solid fa-play" aria-hidden="true"></i> Escuchar en Vivo', status: 'Presiona play para escuchar', cls: '' },
            connecting: { chip: 'Conectando', label: '<i class="fa-solid fa-circle-notch fa-spin" aria-hidden="true"></i> Conectando…', status: 'Conectando…', cls: '' },
            live: { chip: 'Al aire', label: '<i class="fa-solid fa-stop" aria-hidden="true"></i> Detener', status: 'En vivo ahora', cls: 'on-air' },
            error: { chip: 'Fuera del aire', label: '<i class="fa-solid fa-play" aria-hidden="true"></i> Escuchar en Vivo', status: 'La radio está fuera del aire. Vuelve el miércoles a las 13:00 hrs.', cls: 'off-air' }
        };

        const render = (next) => {
            const prev = state;
            state = next;
            const ui = UI[next];
            body.classList.toggle('is-live', next === 'live');
            body.classList.toggle('is-connecting', next === 'connecting');
            playBtn.setAttribute('aria-pressed', String(next === 'live'));
            playBtn.setAttribute('aria-label', next === 'live' ? 'Detener Radio Nazareo' : 'Reproducir Radio Nazareo en vivo');

            chipText.textContent = ui.chip;
            statusEl.classList.remove('on-air', 'off-air');
            if (ui.cls) statusEl.classList.add(ui.cls);
            if (statusEl.textContent !== ui.status) {
                statusEl.textContent = ui.status;
                animateIn(statusEl);
            }

            // El texto del botón cambia de golpe: se re-crea el <span> y se anima su entrada
            if (prev !== next) {
                playBtn.innerHTML = `<span class="btn-label">${ui.label}</span>`;
                animateIn(playBtn.firstElementChild);
            }

            // Animaciones ligadas al estado: ecualizador, y ondas (ráfaga al presionar y al salir al aire, suaves mientras suena)
            setEqActive(next === 'live');
            setAmbientRings(next === 'live');
            if (next === 'connecting') emitRings(2);
            if (next === 'live' && prev !== 'live') emitRings(3, 'live');

            if ('mediaSession' in navigator && next === 'live') {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: 'Radio Nazareo en vivo',
                    artist: 'Colegio Nazareo',
                    artwork: [{ src: 'assets/logo-radio.png', sizes: '1000x1000', type: 'image/png' }]
                });
            }
        };

        const stopStream = () => {
            audio.pause();
            audio.removeAttribute('src');
            audio.load();
        };

        const toggle = () => {
            if (state === 'live' || state === 'connecting') {
                render('idle');   // primero el estado: así el evento 'error' que dispara load() sin src se ignora
                stopStream();
                return;
            }
            render('connecting');
            audio.src = LIVE_STREAM_URL;
            audio.load();
            audio.play().catch(() => {
                // El evento 'error' del audio se encarga de mostrar el mensaje real (ej. fuera del aire)
            });
        };

        playBtn.addEventListener('click', toggle);
        if (miniStop) miniStop.addEventListener('click', toggle);

        audio.addEventListener('playing', () => { if (state !== 'idle') render('live'); });
        audio.addEventListener('error', () => {
            if (state === 'idle') return;
            stopStream();
            render('error');
        });
    }

    // 8. Formulario de Saludos → se envía por WhatsApp (no hay backend propio conectado a este formulario)
    const greetingForm = document.querySelector('.greeting-form');
    if (greetingForm) {
        const submitLabel = greetingForm.querySelector('.btn-label');
        const originalLabel = submitLabel.innerHTML;
        greetingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = $('name').value.trim();
            const message = $('message').value.trim();
            const text = `Hola Radio Nazareo! Soy ${name} y quiero enviar este saludo/petición: ${message}`;
            window.open(`https://wa.me/56993706069?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
            greetingForm.reset();
            const submitBtn = greetingForm.querySelector('button[type="submit"]');
            burstConfetti(submitBtn);
            // WhatsApp se abre en otra pestaña/app: si la persona se va, el confeti se repite al volver
            const submittedAt = Date.now();
            let pending = false;
            const onVisibility = () => {
                if (document.hidden && Date.now() - submittedAt < 4000) pending = true;
                if (!document.hidden && pending) {
                    pending = false;
                    document.removeEventListener('visibilitychange', onVisibility);
                    burstConfetti(submitBtn);
                }
                if (Date.now() - submittedAt > 120000) document.removeEventListener('visibilitychange', onVisibility);
            };
            document.addEventListener('visibilitychange', onVisibility);

            submitLabel.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> ¡Listo! Abriendo WhatsApp';
            animateIn(submitLabel);
            setTimeout(() => {
                submitLabel.innerHTML = originalLabel;
                animateIn(submitLabel);
            }, 3200);
        });
    }
});
