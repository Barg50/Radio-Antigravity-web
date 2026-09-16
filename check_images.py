import glob
from html.parser import HTMLParser

class ImgParser(HTMLParser):
    def __init__(self, filename):
        super().__init__()
        self.filename = filename

    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            attrs_dict = dict(attrs)
            if 'alt' not in attrs_dict or not attrs_dict['alt']:
                print(f"{self.filename}: Missing or empty alt tag -> {attrs_dict.get('src')}")
            
            if 'loading' not in attrs_dict and 'hero' not in attrs_dict.get('class', '') and 'logo' not in attrs_dict.get('class', ''):
                print(f"{self.filename}: Missing loading='lazy' -> {attrs_dict.get('src')} (class: {attrs_dict.get('class')})")

for filepath in glob.glob("*.html"):
    with open(filepath, 'r', encoding='utf-8') as f:
        parser = ImgParser(filepath)
        parser.feed(f.read())
