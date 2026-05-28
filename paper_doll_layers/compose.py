#!/usr/bin/env python3
"""
Paper Doll Compositor for the game.

Usage:
  python compose.py --character woman_01 --outfit spring_01 --skin_tone #f5d0c5 --hair_color #3c2f2f
  python compose.py --list

Creates composited character images and supports runtime-like layering.
"""
import argparse
import json
from pathlib import Path
from typing import Dict, Optional

from PIL import Image, ImageOps, ImageChops, ImageColor


class PaperDollCompositor:
    def __init__(self, root_dir: Path = Path(".")):
        self.root = root_dir
        self.manifest = json.loads((root_dir / "manifest.json").read_text())

    def get_character(self, char_name: str):
        for c in self.manifest["characters"]:
            if c["folder"] == char_name:
                return c
        raise ValueError(f"Character {char_name} not found")

    def load_image(self, char_folder: str, rel_path: str) -> Image.Image:
        path = self.root / char_folder / rel_path
        if not path.exists():
            raise FileNotFoundError(f"Missing layer: {path}")
        return Image.open(path).convert("RGBA")

    def tint_image(self, img: Image.Image, color: str, mask_path: Optional[str] = None, char_folder: str = "") -> Image.Image:
        """Tint an image using a color and optional mask. Uses multiply for natural look."""
        if not color or color.lower() in ("none", "default"):
            return img.copy()

        tint_color = ImageColor.getcolor(color, "RGB")
        base = img.copy()

        if mask_path and char_folder:
            try:
                mask_img = self.load_image(char_folder, mask_path)
                mask = mask_img.convert("L")
                # Colorize the mask with the tint (good for hair/skin masks)
                tinted = ImageOps.colorize(mask, (0, 0, 0), tint_color)
                tinted = tinted.convert("RGBA")
                # Composite the tinted mask over the original using the mask's alpha
                tinted.putalpha(mask)
                return Image.alpha_composite(base, tinted)
            except Exception:
                pass  # fallback to simple tint

        # Fallback: simple multiply tint (preserves highlights/shadows)
        r, g, b, a = base.split()
        rgb = Image.merge("RGB", (r, g, b))
        tint_layer = Image.new("RGB", rgb.size, tint_color)
        tinted_rgb = ImageChops.multiply(rgb, tint_layer)  # better than blend for tinting
        return Image.merge("RGBA", (*tinted_rgb.split(), a))


    def composite(self, char_name: str, outfit: Optional[str] = None,
                  skin_tone: str = "#e8c3a0", hair_color: str = "#2c1f1a",
                  output_path: Optional[Path] = None) -> Image.Image:
        char = self.get_character(char_name)
        folder = char["folder"]

        # Load base layers (bottom to top)
        layers = []

        # 1. Skin
        skin = self.load_image(folder, "01_skin_visible_layer.png")
        skin = self.tint_image(skin, skin_tone, "masks/mask_skin_tintable_no_face_details.png", folder)
        layers.append(skin)

        # 2. Underwear
        underwear = self.load_image(folder, "03_underwear_base_layer.png")
        layers.append(underwear)

        # 3. Outfit (if specified) - these should be clothing overlays, not full-body
        if outfit:
            outfit_file = f"outfit_{outfit}.png"
            if (self.root / folder / outfit_file).exists():
                outfit_img = self.load_image(folder, outfit_file)
                if outfit_img.mode != "RGBA":
                    outfit_img = outfit_img.convert("RGBA")
                # Attempt to remove solid white background if present (common in extracted outfits)
                data = outfit_img.getdata()
                new_data = []
                for item in data:
                    if item[0] > 240 and item[1] > 240 and item[2] > 240:  # near-white
                        new_data.append((255, 255, 255, 0))
                    else:
                        new_data.append(item)
                outfit_img.putdata(new_data)
                layers.append(outfit_img)
            else:
                print(f"Warning: Outfit {outfit_file} not found for {char_name}")

        # 4. Hair
        hair = self.load_image(folder, "04_hair_visible_layer.png")
        hair = self.tint_image(hair, hair_color, "masks/mask_hair_visible.png", folder)
        layers.append(hair)

        # 5. Optional face details on top
        face = self.load_image(folder, "02_face_details_overlay_optional.png")
        layers.append(face)

        # Composite all (ensure all layers are same size)
        result = layers[0].copy()
        for layer in layers[1:]:
            if layer.size != result.size:
                layer = layer.resize(result.size, Image.Resampling.LANCZOS)
            result = Image.alpha_composite(result, layer)

        if output_path:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            result.save(output_path)
            print(f"Saved composite to {output_path}")

        return result


def main():
    parser = argparse.ArgumentParser(description="Paper Doll Compositor for game")
    parser.add_argument("--character", default="woman_01", help="Character folder (woman_01..07)")
    parser.add_argument("--outfit", help="Outfit prefix e.g. spring_01, summer_02, or None")
    parser.add_argument("--skin-tone", default="#e8c3a0", help="Hex skin tone, e.g. #f5d0c5")
    parser.add_argument("--hair-color", default="#2c1f1a", help="Hex hair color")
    parser.add_argument("--output", "-o", help="Output PNG path")
    parser.add_argument("--list", action="store_true", help="List available characters and outfits")
    args = parser.parse_args()

    comp = PaperDollCompositor()

    if args.list:
        for c in comp.manifest["characters"]:
            print(f"{c['folder']}: {c.get('label', '')}")
            outfits = [f for f in Path(comp.root / c["folder"]).glob("outfit_*.png")]
            if outfits:
                print("  Outfits:", [o.stem.replace("outfit_", "") for o in outfits])
        return

    out_path = Path(args.output) if args.output else Path(f"output/{args.character}_{args.outfit or 'base'}.png")
    result = comp.composite(
        args.character,
        args.outfit,
        args.skin_tone,
        args.hair_color,
        out_path
    )
    result.show()  # Opens preview


if __name__ == "__main__":
    main()
