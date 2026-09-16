import glob

# index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('<button type="submit" class="btn-primary submit-btn" id="cta-formulario">Solicitar Atención por WhatsApp</button>', '<button type="submit" class="btn-primary submit-btn" id="cta-formulario" onclick="gtag(\'event\', \'submit_form\', {\'event_category\': \'Contacto\', \'event_label\': \'Formulario Inicio WhatsApp\'});">Solicitar Atención por WhatsApp</button>')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
    
# contacto.html
with open('contacto.html', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('<button type="submit" class="btn-primary" id="btn-email-contact" style="width: 100%; background-color: white; color: var(--primary-blue); border: 2px solid var(--primary-blue); display: flex; justify-content: center; align-items: center; gap: 8px;">', '<button type="submit" class="btn-primary" id="btn-email-contact" style="width: 100%; background-color: white; color: var(--primary-blue); border: 2px solid var(--primary-blue); display: flex; justify-content: center; align-items: center; gap: 8px;" onclick="gtag(\'event\', \'submit_form\', {\'event_category\': \'Contacto\', \'event_label\': \'Formulario Email Contacto\'});">')
with open('contacto.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
