from PIL import Image
import numpy as np

# Load the outfit composite
outfit = Image.open('public/paper_dolls/woman_01/outfit_spring_01.png').convert('RGB')
outfit_arr = np.array(outfit)

# Load the base character (naked/underwear)
# Or wait, what if the base character in the outfit is slightly different?
# Let's load transparent_preview_checkerboard to remove the background
checker = Image.open('public/paper_dolls/woman_01/transparent_preview_checkerboard.png').convert('RGB')
checker_arr = np.array(checker)

# Load base character to subtract
base = Image.open('public/paper_dolls/woman_01/00_full_character_transparent.png').convert('RGBA')
base_arr = np.array(base)

# We want to keep pixels where:
# 1. outfit is NOT checkerboard
# 2. outfit is NOT base skin/hair

# Create output RGBA
h, w, _ = outfit_arr.shape
out_arr = np.zeros((h, w, 4), dtype=np.uint8)

# Calculate absolute difference with checkerboard
diff_checker = np.abs(outfit_arr.astype(int) - checker_arr.astype(int))
sum_diff_checker = np.sum(diff_checker, axis=2)
is_character = sum_diff_checker > 10  # tolerance

# Calculate absolute difference with base character (rgb only)
base_rgb = base_arr[:,:,0:3]
diff_base = np.abs(outfit_arr.astype(int) - base_rgb.astype(int))
sum_diff_base = np.sum(diff_base, axis=2)
is_clothes = sum_diff_base > 30  # tolerance for compression or anti-aliasing

# Clothes are where it's part of the character AND different from the base
# Wait, some clothes might be the same color as the base skin? Probably rare.
# A better way is to just use difference from base character, BUT only where base character is opaque?
# Actually, the clothes cover the skin, so they are different from skin. 
# And the clothes cover the checkerboard, so they are different from checkerboard.

# Clothes mask:
mask = is_character & is_clothes

out_arr[mask, 0:3] = outfit_arr[mask]
out_arr[mask, 3] = 255

out_img = Image.fromarray(out_arr)
out_img.save('public/paper_dolls/woman_01/extracted_spring_01.png')
print("Extracted clothes saved. Checking number of opaque pixels:")
print(np.count_nonzero(mask))
