from PIL import Image
import sys

def crop_center_to_916(image_path, output_path):
    try:
        img = Image.open(image_path)
        w, h = img.size
        
        target_ratio = 9 / 16.0
        current_ratio = w / h
        
        if current_ratio > target_ratio:
            # Too wide, need to crop width
            new_w = int(h * target_ratio)
            left = (w - new_w) / 2
            right = (w + new_w) / 2
            top = 0
            bottom = h
        else:
            # Too tall, need to crop height
            new_h = int(w / target_ratio)
            top = (h - new_h) / 2
            bottom = (h + new_h) / 2
            left = 0
            right = w
            
        img_cropped = img.crop((left, top, right, bottom))
        img_cropped.save(output_path)
        print(f"Cropped {image_path} to {output_path} with size {img_cropped.size}")
    except Exception as e:
        print(f"Failed to crop {image_path}: {e}")

images = [
    "/home/autobot/.gemini/antigravity/brain/5c283ce1-8586-4cc0-aefa-c48202af100a/cena2_remendo_referencia_3d_1773325306368.png",
    "/home/autobot/.gemini/antigravity/brain/5c283ce1-8586-4cc0-aefa-c48202af100a/cena2_erosao_referencia_3d_1773325380217.png"
]
for img in images:
    crop_center_to_916(img, img.replace(".png", "_9_16.png"))
