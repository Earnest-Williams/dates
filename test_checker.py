import numpy as np
from PIL import Image

outfit_path = 'public/paper_dolls/woman_01/outfit_spring_01.png'
base_path = 'public/paper_dolls/woman_01/00_full_character_transparent.png'
checker_path = 'public/paper_dolls/woman_01/transparent_preview_checkerboard.png'

outfit_img = Image.open(outfit_path).convert('RGB')
base_img = Image.open(base_path).convert('RGB')
checker_img = Image.open(checker_path).convert('RGB')

outfit = np.array(outfit_img)
base = np.array(base_img)
checker = np.array(checker_img)

best_y = 18

aligned_base = base[best_y:best_y+1024, :]
aligned_checker = checker[best_y:best_y+1024, :]

diff_checker = np.sum(np.abs(outfit.astype(int) - aligned_checker.astype(int)), axis=2)
diff_base = np.sum(np.abs(outfit.astype(int) - aligned_base.astype(int)), axis=2)

# It's clothes if it's NOT checkerboard AND NOT base
is_checker = diff_checker < 30
is_base = diff_base < 30

is_clothes = (~is_checker) & (~is_base)

print(f"Total outfit pixels: {1024*1024}")
print(f"Checker pixels: {np.count_nonzero(is_checker)}")
print(f"Base pixels: {np.count_nonzero(is_base)}")
print(f"Clothes pixels: {np.count_nonzero(is_clothes)}")

# Let's save a preview
out_rgba = np.zeros((1024, 1024, 4), dtype=np.uint8)
outfit_rgba = np.array(outfit_img.convert('RGBA'))
out_rgba[is_clothes] = outfit_rgba[is_clothes]
Image.fromarray(out_rgba).save('public/paper_dolls/woman_01/test_clothes.png')

