import numpy as np
from PIL import Image

def fix_outfit():
    outfit_path = 'public/paper_dolls/woman_01/outfit_spring_01.png'
    base_path = 'public/paper_dolls/woman_01/00_full_character_transparent.png'
    out_path = 'public/paper_dolls/woman_01/extracted_spring_01.png'
    
    outfit_img = Image.open(outfit_path).convert('RGB')
    base_img = Image.open(base_path).convert('RGB')
    outfit = np.array(outfit_img)
    base = np.array(base_img)
    
    best_y = 18  # Forced alignment
    o_h, o_w, _ = outfit.shape
    b_h, b_w, _ = base.shape
    
    aligned_base = base[best_y:best_y+o_h, :]
    diff = np.abs(outfit.astype(int) - aligned_base.astype(int))
    diff_sum = np.sum(diff, axis=2)
    
    is_gray = (np.abs(outfit[:,:,0] - outfit[:,:,1]) < 8) & (np.abs(outfit[:,:,1] - outfit[:,:,2]) < 8)
    brightness = outfit[:,:,0]
    is_checker = is_gray & (brightness > 70) & (brightness < 120)
    
    # Loosen difference threshold just in case
    is_clothes = (diff_sum > 25) & (~is_checker)
    
    out_rgba = np.zeros((b_h, b_w, 4), dtype=np.uint8)
    outfit_rgba = np.array(outfit_img.convert('RGBA'))
    
    target_region = out_rgba[best_y:best_y+o_h, :]
    target_region[is_clothes] = outfit_rgba[is_clothes]
    out_rgba[best_y:best_y+o_h, :] = target_region
    
    Image.fromarray(out_rgba).save(out_path)
    print(f"Fixed {out_path}")

fix_outfit()
