import requests
import json
import base64
import sys
import os
import uuid
import time

parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(parent_dir)
from models.venice import headers
# "Bsky from Texas is reaching out to Nigar, their casual and friendly interaction suggests a long-standing partnership or camaraderie. The setting is a bustling cityscape where both have established roots, possibly in the same town or city."
url = "https://api.venice.ai/api/v1/image/generate"
def generate_image(prompt):

    payload = {
        "model": "flux-dev",
        "prompt": prompt,
        "width": 1024,
        "height": 1024,
        "steps": 15,
        "hide_watermark": True,
        "return_binary": False,  # Ensures base64 encoding in response
        "seed": 123,
        "cfg_scale": 15,
        "style_preset": "3D Model",
        "negative_prompt": "",
        "safe_mode": False
    }


    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        try:
            response_json = response.json()
            images = response_json.get("images", [])
            
            if images:
                image_data = base64.b64decode(images[0])
                file_path = f"./tmp/generated_image_{uuid.uuid4().hex}_{int(time.time())}.png"
                
                with open(file_path, "wb") as file:
                    file.write(image_data)
                
                return file_path
            else:
                print("Error: No image data found in response.")
        except json.JSONDecodeError:
            print("Error decoding JSON response.")
    else:
        print(f"Error: {response.status_code}, {response.text}")

# file_stored=generate_image("Bsky from Texas is reaching out to Nigar, their casual and friendly interaction suggests a long-standing partnership or camaraderie. The setting is a bustling cityscape where both have established roots, possibly in the same town or city.")
# print(file_stored)