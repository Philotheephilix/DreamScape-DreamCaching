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
from controller.commicizer import add_comic_text

# "Bsky from Texas is reaching out to Nigar, their casual and friendly interaction suggests a long-standing partnership or camaraderie. The setting is a bustling cityscape where both have established roots, possibly in the same town or city."
url = "https://api.venice.ai/api/v1/image/generate"
def generate_image(prompt, scene_number,texts):

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
                if (texts):
                    comic_image=add_comic_text(images[0],texts=texts)
                else:
                    comic_image=images[0]
                upload_url = "http://localhost:5000/upload-image"
                upload_payload = {
                    "base64Image": comic_image,
                    "scene_number": scene_number
                }
                upload_response = requests.post(upload_url, json=upload_payload)
                print (upload_response.json().get("fileId"))
                return upload_response.json().get("fileId")
            else:
                print("Error: No image data found in response.")
        except json.JSONDecodeError:
            print("Error decoding JSON response.")
    else:
        print(f"Error: {response.status_code}, {response.text}")

# file_stored=generate_image("Bsky from Texas is reaching out to Nigar, their casual and friendly interaction suggests a long-standing partnership or camaraderie. The setting is a bustling cityscape where both have established roots, possibly in the same town or city.",0,texts=[' joe is a good boy','joe has recently purchasd 8gb ddr4 sodimm memory @ 2666 mhz but it will only run on 2133'])
# print(file_stored)
