import glob
import re

for filepath in glob.glob("*.html"):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'<link rel="canonical" href="(.*?)">', content)
    if match:
        print(f"{filepath}: {match.group(1)}")
    else:
        print(f"{filepath}: MISSING CANONICAL")
