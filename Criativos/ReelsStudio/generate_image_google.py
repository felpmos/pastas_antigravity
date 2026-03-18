import urllib.request
import json
import sys
import base64
import os

def generate_image(prompt, output_file, reference_image=None):
    api_key = "AIzaSyAlIRl5QZFF91lmvCch490jZxO2TzD7MEg"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent"
    
    headers = {
        'Content-Type': 'application/json',
        'x-goog-api-key': api_key
    }

    parts = [{"text": prompt}]
    
    if reference_image and os.path.exists(reference_image):
        with open(reference_image, "rb") as f:
            encoded = base64.b64encode(f.read()).decode('utf-8')
            parts.append({
                "inlineData": {
                    "mimeType": "image/jpeg",
                    "data": encoded
                }
            })

    data = {
        "contents": [
            {
                "parts": parts
            }
        ],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {
                "aspectRatio": "9:16",
                "imageSize": "2K"
            }
        }
    }

    try:
        req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers, method='POST')
        print(f"Gerando imagem para: {output_file}...")
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode())
            
            if 'candidates' in result and len(result['candidates']) > 0:
                inner_parts = result['candidates'][0]['content']['parts']
                for p in inner_parts:
                    if 'inlineData' in p:
                        img_b64 = p['inlineData']['data']
                        with open(output_file, "wb") as f_out:
                            f_out.write(base64.b64decode(img_b64))
                        print(f"Sucesso! Salvo em: {output_file}")
                        return
            print("Erro ou sem imagem:", json.dumps(result, indent=2))
    except urllib.error.HTTPError as e:
        print(f"HTTP Erro {e.code}: {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    prompt_base = """Transform this exact real-world photo into a highly stylized 3D conceptual graphic view. 
MANDATORY: Remove all people from the scene, nobody in the picture.
Style: Illuminated glowing high-tech topographical X-ray wireframe scan of the street.
High quality, 4k, hyper-detailed.
No text, no letters.
"""
    
    prompt_remendo = prompt_base + "The rectangular asphalt patch in the center is fully solid but glowing with cyan and neon grid lines. It's raining. Water is starting to flow over the patch."
    prompt_erosao = prompt_base + "The central rectangular patch is now violently broken open into a deep, jagged pothole from heavy rainwater flow. Pieces of asphalt are washing away. Glow neon edges on the crack."

    ref_img = "/home/autobot/.gemini/antigravity/brain/5c283ce1-8586-4cc0-aefa-c48202af100a/media__1773324802958.jpg"
    
    out1 = "/home/autobot/.gemini/antigravity/brain/5c283ce1-8586-4cc0-aefa-c48202af100a/buraco_remendo_gemini_9_16.jpeg"
    out2 = "/home/autobot/.gemini/antigravity/brain/5c283ce1-8586-4cc0-aefa-c48202af100a/buraco_erosao_gemini_9_16.jpeg"
    
    generate_image(prompt_remendo, out1, ref_img)
    print("Gerando a segunda.")
    generate_image(prompt_erosao, out2, ref_img)
