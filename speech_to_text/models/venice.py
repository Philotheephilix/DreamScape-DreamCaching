import os
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("VENICE_TOKEN")

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}
