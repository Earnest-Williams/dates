from PIL import Image
import sys

img = Image.open('public/paper_dolls/woman_01/extracted_spring_01.png')
img = img.resize((64, 96))
pixels = img.load()
for y in range(96):
    line = ""
    for x in range(64):
        a = pixels[x, y][3]
        if a > 128:
            line += "#"
        else:
            line += "."
    print(line)
