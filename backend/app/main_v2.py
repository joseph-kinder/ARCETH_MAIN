import os
import json
import base64
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime
from PIL import Image, ImageFont, ImageDraw
import io
import aiohttp
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import redis
from enum import Enum
import hashlib

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Initialize Google Gen AI
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

# Initialize Redis for caching (optional)
try:
    redis_client = redis.Redis(
        host=os.environ.get("REDIS_HOST", "localhost"),
        port=int(os.environ.get("REDIS_PORT", 6379)),
        decode_responses=True
    )
    redis_client.ping()
    REDIS_AVAILABLE = True
except:
    print("Warning: Redis not available. Running without caching.")
    redis_client = None
    REDIS_AVAILABLE = False

app = FastAPI(title="ArcaneETH Card Generator API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Models
class CardRarity(str, Enum):
    COMMON = "Common"
    RARE = "Rare" 
    EPIC = "Epic"
    LEGENDARY = "Legendary"

class GenerateCardRequest(BaseModel):
    prompt: str
    rarity: Optional[CardRarity] = None
    user_address: Optional[str] = None

class CardMetadata(BaseModel):
    name: str
    short_description: str
    long_description: str
    element: str
    attack: int
    defense: int
    rarity: CardRarity
    image_url: Optional[str] = None
    generation_timestamp: str
    prompt_hash: str

# Configure Gemini models - only if API key is available
if os.environ.get("GOOGLE_API_KEY"):
    text_model = genai.GenerativeModel('gemini-pro')
    image_model = genai.GenerativeModel('gemini-pro-vision')
    AI_AVAILABLE = True
else:
    print("Warning: Google AI API key not found. AI features disabled.")
    text_model = None
    image_model = None
    AI_AVAILABLE = False

# Safety settings for content generation
safety_settings = {
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
}