import glob
import re

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We will find all <img ...>
    img_tags = re.findall(r'<img\s+[^>]*>', content)
    for i, tag in enumerate(img_tags):
        # We assume the first image is the logo, which shouldn't be lazy loaded
        if 'loading="lazy"' not in tag and 'logo' not in tag and i > 0:
            new_tag = tag.replace('>', ' loading="lazy">')
            content = content.replace(tag, new_tag)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
print("done")
