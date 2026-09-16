import glob
import re

nav_links_replacement = r'<nav class="nav-links" id="navLinks" role="navigation">\n            <a href="/">Inicio</a><a href="/audifonos">Audífonos</a><a href="/audiometria">Audiometría</a><a href="/lavado-de-oidos">Lavado de Oídos</a><a href="/calibracion-de-audifonos">Calibración</a><a href="/nosotros">Nosotros</a><a href="/preguntas-frecuentes">FAQ</a><a href="/contacto">Contacto</a>\n        </nav>'
footer_nav_replacement = r'<nav class="footer-nav" aria-label="Navegación de pie de página"><a href="/">Inicio</a><a href="/audifonos">Audífonos</a><a href="/audiometria">Audiometría</a><a href="/lavado-de-oidos">Lavado de Oídos</a><a href="/calibracion-de-audifonos">Calibración</a><a href="/nosotros">Nosotros</a><a href="/preguntas-frecuentes">FAQ</a><a href="/contacto">Contacto</a><a href="/politica-de-privacidad">Privacidad</a></nav>'
footer_bottom_replacement = r'<div class="footer-bottom"><p>&copy; 2026 BeopenSound. Todos los derechos reservados. <a href="/politica-de-privacidad" style="color: white; margin-left: 10px; text-decoration: underline;">Política de Privacidad</a></p></div>'

for filepath in glob.glob("*.html"):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update nav-links
    content = re.sub(
        r'<nav class="nav-links" id="navLinks" role="navigation">.*?</nav>',
        nav_links_replacement,
        content,
        flags=re.DOTALL
    )
    
    # Update footer-nav
    content = re.sub(
        r'<nav class="footer-nav" aria-label="Navegación de pie de página">.*?</nav>',
        footer_nav_replacement,
        content,
        flags=re.DOTALL
    )
    
    # Update footer-bottom
    content = re.sub(
        r'<div class="footer-bottom">.*?</div>',
        footer_bottom_replacement,
        content,
        flags=re.DOTALL
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")
