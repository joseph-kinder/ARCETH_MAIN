import requests
import os

bearer_token = os.environ.get("BEARER_TOKEN")

API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
headers = {"Authorization": f"Bearer {bearer_token}"}

def query(payload):
	response = requests.post(API_URL, headers=headers, json=payload)
	return response.content