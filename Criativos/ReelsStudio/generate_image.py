import os
import requests
import json
import sys

def generate_image(prompt):
    api_key = "AIzaSyAlIRl5QZFF91lmvCch490jZxO2TzD7MEg"
    # Endpoints comuns da Nano Banana / RunPod (Substitua pelo endpoint correto se necessário)
    url = "https://api.nano-banana.com/v1/generate"
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    payload = {
        "prompt": prompt,
        "aspect_ratio": "9:16",
        # Adicionando parâmetros comuns de modelos de difusão de ponta
        "output_format": "jpeg",
        "guidance_scale": 7.5
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        print(json.dumps(result, indent=2))
        return result
    except requests.exceptions.RequestException as e:
        print(f"Erro na API: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response: {e.response.text}")
        return None

if __name__ == "__main__":
    if len(sys.argv) > 1:
        prompt = sys.argv[1]
        generate_image(prompt)
    else:
        print("Forneça o prompt como argumento.")
