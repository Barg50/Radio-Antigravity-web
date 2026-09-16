import glob

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the footer address
    content = content.replace('📍 Arlegui 160, Oficina 101, Viña del Mar, Chile', '📍 Arlegui 160, Edificio Lautaro Oficina 101, Viña del Mar')
    
    # Let's also fix the ones with comma after Lautaro
    content = content.replace('Arlegui 160, Edificio Lautaro, Oficina 101', 'Arlegui 160, Edificio Lautaro Oficina 101')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("done")
