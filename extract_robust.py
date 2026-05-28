import numpy as np
from PIL import Image
import glob
import os

def binary_dilation_np(mask, iterations=1):
    dilated = mask.copy()
    for _ in range(iterations):
        padded = np.pad(dilated, pad_width=1, mode='constant', constant_values=False)
        dilated = (
            padded[1:-1, 1:-1] |
            padded[:-2, 1:-1] |
            padded[2:, 1:-1] |
            padded[1:-1, :-2] |
            padded[1:-1, 2:] |
            padded[:-2, :-2] |
            padded[2:, 2:] |
            padded[:-2, 2:] |
            padded[2:, :-2]
        )
    return dilated

def extract_clothes_robust(outfit_path, base_path, out_path):
    print(f"Processing {outfit_path}...")
    try:
        outfit_img = Image.open(outfit_path).convert('RGB')
        base_img = Image.open(base_path).convert('RGB')
    except Exception as e:
        print(f"Error: {e}")
        return

    outfit = np.array(outfit_img)
    base = np.array(base_img)
    o_h, o_w, _ = outfit.shape
    b_h, b_w, _ = base.shape
    
    best_y = 18
    if 'woman_06' in outfit_path:
        best_y = 19
    elif 'woman_04' in outfit_path:
        best_y = 15
    elif 'woman_01' in outfit_path:
        best_y = 18

    aligned_base = base[best_y:best_y+o_h, :]
    
    # Identify checkerboard
    r, g, b = outfit[:,:,0].astype(int), outfit[:,:,1].astype(int), outfit[:,:,2].astype(int)
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    saturation = max_c - min_c
    
    is_low_sat = saturation < 25
    is_dark = max_c < 115
    is_light = max_c > 210
    
    is_checker = is_low_sat & (is_dark | is_light)
    
    # Dilate checkerboard to remove anti-aliased borders
    is_checker_dilated = binary_dilation_np(is_checker, iterations=2)
    is_character = ~is_checker_dilated
    
    # Identify clothes vs skin
    diff = np.abs(outfit.astype(int) - aligned_base.astype(int))
    diff_sum = np.sum(diff, axis=2)
    
    is_clothes = is_character & (diff_sum > 40)
    is_clothes = binary_dilation_np(is_clothes, iterations=1)
    
    out_rgba = np.zeros((b_h, b_w, 4), dtype=np.uint8)
    outfit_rgba = np.array(outfit_img.convert('RGBA'))
    
    target_region = out_rgba[best_y:best_y+o_h, :]
    target_region[is_clothes] = outfit_rgba[is_clothes]
    out_rgba[best_y:best_y+o_h, :] = target_region
    
    Image.fromarray(out_rgba).save(out_path)
    print(f"Saved {out_path} with {np.count_nonzero(is_clothes)} clothes pixels")

for char_dir in glob.glob('public/paper_dolls/woman_*'):
    base_path = os.path.join(char_dir, '00_full_character_transparent.png')
    if not os.path.exists(base_path):
        base_path = os.path.join(char_dir, '01_skin_visible_layer.png')
        
    for outfit_path in glob.glob(os.path.join(char_dir, 'outfit_*.png')):
        out_name = os.path.basename(outfit_path).replace('outfit_', 'extracted_')
        out_path = os.path.join(char_dir, out_name)
        extract_clothes_robust(outfit_path, base_path, out_path)
