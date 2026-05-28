import numpy as np
from PIL import Image
import glob
import os

def extract_clothes(outfit_path, base_path, out_path):
    print(f"Processing {outfit_path}...")
    # Load images
    try:
        outfit_img = Image.open(outfit_path).convert('RGB')
        base_img = Image.open(base_path).convert('RGB')
    except Exception as e:
        print(f"Error loading images: {e}")
        return

    outfit = np.array(outfit_img)
    base = np.array(base_img)
    
    # Dimensions
    o_h, o_w, _ = outfit.shape
    b_h, b_w, _ = base.shape
    
    if o_w != b_w:
        print(f"Width mismatch: {o_w} vs {b_w}")
        return
        
    best_y = 0
    min_diff = float('inf')
    
    # We use the top 150 rows of the outfit image to find the face/head offset
    template = outfit[0:150, :]
    
    for y in range(b_h - o_h + 1): # Search all possible Y offsets
        region = base[y:y+150, :]
        diff = np.sum(np.abs(region.astype(int) - template.astype(int)))
        if diff < min_diff:
            min_diff = diff
            best_y = y
            
    print(f"Best Y offset: {best_y} (diff: {min_diff})")
    
    # Now extract the clothes
    aligned_base = base[best_y:best_y+o_h, :]
    
    diff = np.abs(outfit.astype(int) - aligned_base.astype(int))
    diff_sum = np.sum(diff, axis=2)
    
    # Checkerboard background mask
    # Check if pixel is gray and roughly 95 brightness
    is_gray = (np.abs(outfit[:,:,0] - outfit[:,:,1]) < 8) & (np.abs(outfit[:,:,1] - outfit[:,:,2]) < 8)
    brightness = outfit[:,:,0]
    is_checker = is_gray & (brightness > 70) & (brightness < 120)
    
    # Clothes are pixels that differ from base AND are not checkerboard
    is_clothes = (diff_sum > 45) & (~is_checker)
    
    # Let's clean up noise (optional, but let's just apply it)
    
    # Create output RGBA 1024x1536
    out_rgba = np.zeros((b_h, b_w, 4), dtype=np.uint8)
    
    outfit_rgba = np.array(outfit_img.convert('RGBA'))
    
    # Place extracted clothes into output
    target_region = out_rgba[best_y:best_y+o_h, :]
    target_region[is_clothes] = outfit_rgba[is_clothes]
    out_rgba[best_y:best_y+o_h, :] = target_region
    
    # Save
    Image.fromarray(out_rgba).save(out_path)
    print(f"Saved {out_path}")

# Run for all outfits across all characters
for char_dir in glob.glob('public/paper_dolls/woman_*'):
    char_id = os.path.basename(char_dir)
    base_path = os.path.join(char_dir, '00_full_character_transparent.png')
    
    if not os.path.exists(base_path):
        # Fallback to skin layer
        base_path = os.path.join(char_dir, '01_skin_visible_layer.png')
        
    for outfit_path in glob.glob(os.path.join(char_dir, 'outfit_*.png')):
        # Skip if already extracted
        if 'extracted' in outfit_path:
            continue
            
        out_name = os.path.basename(outfit_path).replace('outfit_', 'extracted_')
        out_path = os.path.join(char_dir, out_name)
        
        extract_clothes(outfit_path, base_path, out_path)
