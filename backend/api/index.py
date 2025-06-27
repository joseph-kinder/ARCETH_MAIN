from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import random
import hashlib
from datetime import datetime

app = FastAPI(title="ArcaneETH Card Generator API - V3")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Copy all the code from main_v3.py here...
# Models
class GenerateCardRequest(BaseModel):
    prompt: str
    rarity: str
    user_address: Optional[str] = None

ELEMENTS = ["Fire", "Water", "Earth", "Air", "Light", "Dark"]

RARITY_CONFIGS = {
    "Common": {
        "stat_range": (10, 40),
        "description_prefix": "A simple",
        "description_suffix": "with basic abilities",
        "power_words": ["basic", "simple", "ordinary", "standard", "modest"]
    },
    "Rare": {
        "stat_range": (30, 60),
        "description_prefix": "An uncommon",
        "description_suffix": "with enhanced powers",
        "power_words": ["enhanced", "improved", "notable", "special", "refined"]
    },
    "Epic": {
        "stat_range": (50, 80),
        "description_prefix": "A powerful",
        "description_suffix": "with exceptional abilities",
        "power_words": ["powerful", "mighty", "formidable", "exceptional", "impressive"]
    },
    "Legendary": {
        "stat_range": (70, 100),
        "description_prefix": "The legendary",
        "description_suffix": "with unmatched power",
        "power_words": ["legendary", "mythical", "unmatched", "supreme", "ultimate"]
    }
}

@app.get("/")
async def root():
    return {"name": "ArcaneETH API V3", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/generate")
async def generate_card(request: GenerateCardRequest):
    if request.rarity not in RARITY_CONFIGS:
        raise HTTPException(status_code=400, detail="Invalid rarity")
    
    config = RARITY_CONFIGS[request.rarity]
    prompt_hash = hashlib.md5(f"{request.prompt}{request.rarity}".encode()).hexdigest()
    
    min_stat, max_stat = config["stat_range"]
    attack = random.randint(min_stat, max_stat)
    defense = random.randint(min_stat, max_stat)
    
    name = request.prompt[:50]
    if request.rarity == "Common" and any(word in request.prompt.lower() for word in ["god", "supreme", "ultimate", "legendary"]):
        name = f"Lesser {name}"
    elif request.rarity == "Rare" and any(word in request.prompt.lower() for word in ["god", "supreme", "ultimate"]):
        name = f"Minor {name}"
    
    power_word = random.choice(config["power_words"])
    short_description = f"{config['description_prefix']} {power_word} creature {config['description_suffix']}"
    
    if request.rarity == "Common":
        long_description = f"While inspired by '{request.prompt}', this common manifestation possesses only basic abilities."
    elif request.rarity == "Rare":
        long_description = f"This rare interpretation of '{request.prompt}' shows enhanced capabilities beyond the ordinary."
    elif request.rarity == "Epic":
        long_description = f"An epic embodiment of '{request.prompt}', displaying formidable powers that few can match."
    else:
        long_description = f"The true legendary form of '{request.prompt}', possessing unmatched power and abilities."
    
    metadata = {
        "name": name,
        "short_description": short_description,
        "long_description": long_description,
        "element": random.choice(ELEMENTS),
        "attack": attack,
        "defense": defense,
        "rarity": request.rarity,
        "image_url": f"/api/image/{prompt_hash}",
        "generation_timestamp": datetime.utcnow().isoformat(),
        "prompt_hash": prompt_hash,
        "original_prompt": request.prompt
    }
    
    return JSONResponse(content=metadata, status_code=200)

# Vercel serverless function handler
handler = app