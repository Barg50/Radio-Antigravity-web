import glob
import re

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We want to replace href="https://wa.me/56971372348..." with the same but followed by onclick if it doesn't exist
    # Let's use regex to find all <a ... href="https://wa.me/..." ...>
    
    # Find all anchor tags
    a_tags = re.findall(r'<a\s+[^>]*href="https://wa\.me/[^>]*>', content)
    for tag in a_tags:
        if 'onclick' not in tag:
            # We determine the label based on if it's floating or not
            if 'whatsapp-float' in tag:
                new_tag = tag.replace('>', ' onclick="gtag(\'event\', \'click_whatsapp\', {\'event_category\': \'Contacto\', \'event_label\': \'Boton Flotante\'});">')
            else:
                new_tag = tag.replace('>', ' onclick="gtag(\'event\', \'click_whatsapp\', {\'event_category\': \'Contacto\', \'event_label\': \'Boton WhatsApp\'});">')
            content = content.replace(tag, new_tag)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("done")
