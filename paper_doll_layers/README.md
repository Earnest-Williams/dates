# Paper Doll Layers for Game

This is a **2D paper-doll style character system** for your game. It provides aligned transparent layers + tinting masks for 7 female characters. You can composite them at runtime, tint skin/hair, and swap outfits.

## Quick Start

```bash
# List characters and available outfits
python compose.py --list

# Generate a character with custom colors + outfit
python compose.py --character woman_01 --outfit spring_01 --skin-tone "#d4a88a" --hair-color "#5c4033" --output output/custom.png
```

The `compose.py` tool handles layering, tinting via masks, and previewing.

## Improved Project Structure
- **Per-character folders** (`woman_01/`, etc.) — all assets at 1024×1536 with identical registration.
- `masks/` — Grayscale masks for accurate tinting (skin, hair, etc.).
- `compose.py` — Runtime-like compositor (Python/PIL). Easy to port to Godot, Unity, or a custom shader.
- `output/` — Generated composites (created on first run).
- `manifest.json` — Machine-readable index (layer descriptions, canvas sizes).

**Note on JPEG outfits**: Converted to RGBA on load. Some outfits (`lbd_full_character.png`) are full-body examples.

## Layer Order (Bottom → Top)
1. `01_skin_visible_layer.png` (tinted with `mask_skin_tintable_no_face_details.png`)
2. `03_underwear_base_layer.png`
3. Clothing/outfit layers (`outfit_spring_01.png`, `outfit_summer_02.png`, etc.)
4. `04_hair_visible_layer.png` (tinted with `mask_hair_visible.png`)
5. `02_face_details_overlay_optional.png` (for eyes/lips after tinting)

Additional files (`00_full_character_transparent.png`, previews) are included for reference.

## Tinting
The compositor uses the masks for realistic color application. In a game engine you can replicate this with:
- Multiply blend + mask for skin/hair
- Or shader with `texture(mask) * tint_color`

## Next Steps / Game Integration Ideas
- **Runtime in engine**:
  - Godot: Load layers as `Texture2D`, use `Image` or `MultiMesh` / custom CanvasItem shader.
  - Unity: `Texture2D` array + `Graphics.Blit` or UI Toolkit layering.
  - Web (Phaser/PixiJS): Preload all layers, composite on a RenderTexture.
- **Performance**: Pre-generate common combinations into sprite atlases or use texture atlases.
- **Expansion**: Add more outfits, animations, male characters, or export to Aseprite/PSD.
- **Better sources**: If you have original PSD/Procreate files, re-export true layers for hidden body parts.

Run `python compose.py --list` to explore. Want to:
- Add more outfits?
- Port the compositor to Godot/Unity?
- Generate sprite sheets?
- Create a web demo?
- Improve the tinting logic further?

Let me know the target engine or specific feature and we'll continue.