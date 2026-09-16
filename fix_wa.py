import glob
import re

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace whatsapp button (header)
    content = content.replace('href="https://wa.me/56971372348" class="cta-button"', 'href="https://wa.me/56971372348" class="cta-button" onclick="gtag(\'event\', \'click_whatsapp\', {\'event_category\': \'Contacto\', \'event_label\': \'Boton WhatsApp\'});"')
    
    # Replace whatsapp button (floating)
    content = content.replace('href="https://wa.me/56971372348" class="whatsapp-float"', 'href="https://wa.me/56971372348" class="whatsapp-float" onclick="gtag(\'event\', \'click_whatsapp\', {\'event_category\': \'Contacto\', \'event_label\': \'Boton Flotante\'});"')

    # Replace specific CTA in index.html (agendar cita)
    # We will search for class="cta-primary" or class="solucion-cta" but they are anchor tags?
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("done")
