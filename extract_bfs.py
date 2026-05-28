import numpy as np
from PIL import Image
import glob
import os

def bfs_flood_fill(mask):
    """
    Given a boolean mask where True means 'potential background',
    flood fills from the borders (top, bottom, left, right) to find the contiguous background.
    """
    h, w = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    
    # Start queue with all border pixels that are True in the mask
    queue = []
    
    # Top and bottom rows
    for x in range(w):
        if mask[0, x]: queue.append((0, x))
        if mask[h-1, x]: queue.append((h-1, x))
        
    # Left and right cols
    for y in range(h):
        if mask[y, 0]: queue.append((y, 0))
        if mask[y, w-1]: queue.append((y, w-1))
        
    queue = list(set(queue)) # remove duplicates at corners
    
    for r, c in queue:
        visited[r, c] = True
        
    # BFS
    head = 0
    while head < len(queue):
        r, c = queue[head]
        head += 1
        
        # Check neighbors
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < h and 0 <= nc < w:
                if not visited[nr, nc] and mask[nr, nc]:
                    visited[nr, nc] = True
                    queue.append((nr, nc))
                    
    return visited

def extract_clothes_bfs(outfit_path, base_path, out_path):
    print(f"Processing {outfit_path}...")
    outfit_img = Image.open(outfit_path).convert('RGB')
    base_img = Image.open(base_path).convert('RGB')

    outfit = np.array(outfit_img)
    base = np.array(base_img)
    o_h, o_w, _ = outfit.shape
    b_h, b_w, _ = base.shape
    
    best_y = 18
    if 'woman_06' in outfit_path: best_y = 19
    elif 'woman_04' in outfit_path: best_y = 15
    elif 'woman_01' in outfit_path: best_y = 18

    aligned_base = base[best_y:best_y+o_h, :]
    
    # Identify potential background: Low saturation
    r, g, b = outfit[:,:,0].astype(int), outfit[:,:,1].astype(int), outfit[:,:,2].astype(int)
    max_c = np.maximum(np.maximum(r, g), b)
    min_c = np.minimum(np.minimum(r, g), b)
    saturation = max_c - min_c
    
    # Checkerboard and its anti-aliased edges are all gray (low saturation)
    # Give it a generous saturation tolerance to catch all edges
    is_low_sat = saturation < 35 
    
    # Flood fill from borders
    is_background = bfs_flood_fill(is_low_sat)
    
    # Dilate the background slightly to eat into the remaining fringes
    padded = np.pad(is_background, pad_width=1, mode='constant', constant_values=False)
    is_background_dilated = (
        padded[1:-1, 1:-1] |
        padded[:-2, 1:-1] |
        padded[2:, 1:-1] |
        padded[1:-1, :-2] |
        padded[1:-1, 2:]
    )
    
    is_character = ~is_background_dilated
    
    # Identify clothes vs skin
    diff = np.abs(outfit.astype(int) - aligned_base.astype(int))
    diff_sum = np.sum(diff, axis=2)
    
    is_clothes = is_character & (diff_sum > 40)
    
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
        extract_clothes_bfs(outfit_path, base_path, out_path)
