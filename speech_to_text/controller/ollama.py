import requests

OLLAMA_API_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "deepseek-r1:8b"

def query_ollama(prompt):
    system_prompt = """You are a Storytelling AI assistant. Your task is to analyze the input and frame the scenewise story and background description. Return only a JSON array with objects containing the keys 'scenceNumber', 'backgroundDescription', and 'story'. Do not output any additional text or explanations, only the JSON array."""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": "Give a json array of story of continuing this story line "+prompt,
        "system": system_prompt,
        "stream": False,
        "options": {
            "temperature": 0.7,
            "max_tokens": 5
        }
    }
    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to query Ollama: {str(e)}"}