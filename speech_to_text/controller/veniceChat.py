import os
import sys
import requests
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(parent_dir)
from models.venice import headers

# url = "https://api.venice.ai/api/v1/models"
# response = requests.request("GET", url, headers=headers)

# print(response.text)

url = "https://api.venice.ai/api/v1/chat/completions"
system_prompt = """You are a Storytelling AI assistant. Your task is to analyze the input and frame the scenewise story and background description. Return only a JSON array with objects containing the keys 'scenceNumber', 'backgroundDescription', and 'story'. Do not output any additional text or explanations, only the JSON array."""

def venice_chat(prompt):
    payload = {
        "model": "dolphin-2.9.2-qwen2-72b",
        "messages": [
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": "Give a json array of story of continuing this story line :"+prompt
            }
        ],
        "temperature": 0.8
    }

    response = requests.request("POST", url, json=payload, headers=headers)
    print(response.json()['choices'][0]['message']['content'])
    return response.json()['choices'][0]['message']['content']

# print(venice_chat("a boy is not interested in a girl but his friends are convincing to be her boyfriend but he is not interested now what will happen"))