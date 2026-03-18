import urllib.request
import json
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
        print(f"Processando imagem: {output_file}...")
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
    except Exception as e:
        print(f"Erro: {e}")

if __name__ == "__main__":
    ref_img = "/home/autobot/.gemini/antigravity/brain/5c283ce1-8586-4cc0-aefa-c48202af100a/media__1773324802958.jpg"
    
    # 1. Primeira imagem: Referência Original sem as pessoas (Fotorrealista)
    out1 = "/home/autobot/.gemini/antigravity/brain/5c283ce1-8586-4cc0-aefa-c48202af100a/cena2_realista_remendo_v4.jpeg"
    prompt1 = "High-quality realistic photo of the same street. REMOVE ALL PEOPLE from the scene. The street is empty. Keep the rectangular asphalt patch as it is. Cloudy sky, high detail photography, 4k. No text."
    
    generate_image(prompt1, out1, ref_img)
    
    # 2. Segunda imagem: Baseada na primeira, com o buraco abrindo naturalmente
    out2 = "/home/autobot/.gemini/antigravity/brain/5c283ce1-8586-4cc0-aefa-c48202af100a/cena2_realista_erosao_v4.jpeg"
    prompt2 = "High-quality realistic photo of the same empty street. The rectangular asphalt patch in the center is now naturally eroded and broken open by heavy rain water flow. A shallow, realistic pothole is exposed. NOT a crater, just natural erosion of the asphalt. Water flowing over the edges. No people. No text. 4k resolution."
    
    generate_image(prompt2, out2, out1) # Usa a primeira limpa como referência para a segunda
