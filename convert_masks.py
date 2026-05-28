from PIL import Image
import glob
import os

for mask_path in glob.glob('public/paper_dolls/*/masks/*.png'):
    try:
        img = Image.open(mask_path).convert('L')
        out = Image.new('RGBA', img.size, (255, 255, 255, 255))
        out.putalpha(img)
        out.save(mask_path)
        print(f"Converted {mask_path}")
    except Exception as e:
        print(f"Failed {mask_path}: {e}")

