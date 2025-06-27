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

# Models
class GenerateCardRequest(BaseModel):
    prompt: str
    rarity: str  # "Common", "Rare", "Epic", "Legendary"
    user_address: Optional[str] = None

# Predefined test data
ELEMENTS = ["Fire", "Water", "Earth", "Air", "Light", "Dark"]

# Rarity-based constraints for stats and descriptions
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
    return {
        "name": "ArcaneETH Card Generator API V3",
        "version": "3.0",
        "status": "running",
        "endpoints": {
            "/generate": "Generate a new card with rarity constraints",
            "/health": "Check API health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "3.0"
    }

@app.post("/generate")
async def generate_card(request: GenerateCardRequest):
    """Generate a card that respects the rarity constraints"""
    
    # Validate rarity
    if request.rarity not in RARITY_CONFIGS:
        raise HTTPException(status_code=400, detail="Invalid rarity")
    
    # Get rarity configuration
    config = RARITY_CONFIGS[request.rarity]
    
    # Create a hash of the prompt
    prompt_hash = hashlib.md5(f"{request.prompt}{request.rarity}".encode()).hexdigest()
    
    # Generate stats based on rarity
    min_stat, max_stat = config["stat_range"]
    attack = random.randint(min_stat, max_stat)
    defense = random.randint(min_stat, max_stat)
    
    # Adjust the name based on rarity
    # For "God of all things" as Common, we'd make it something like "Lesser Deity of Minor Things"
    name = request.prompt[:50]
    if request.rarity == "Common" and any(word in request.prompt.lower() for word in ["god", "supreme", "ultimate", "legendary"]):
        name = f"Lesser {name}"
    elif request.rarity == "Rare" and any(word in request.prompt.lower() for word in ["god", "supreme", "ultimate"]):
        name = f"Minor {name}"
    
    # Generate description that matches rarity
    power_word = random.choice(config["power_words"])
    short_description = f"{config['description_prefix']} {power_word} creature {config['description_suffix']}"
    
    # Long description that justifies the rarity
    if request.rarity == "Common":
        long_description = f"While inspired by '{request.prompt}', this common manifestation possesses only basic abilities. Its power is limited, suitable for a novice's collection."
    elif request.rarity == "Rare":
        long_description = f"This rare interpretation of '{request.prompt}' shows enhanced capabilities beyond the ordinary. Its abilities are refined but not yet exceptional."
    elif request.rarity == "Epic":
        long_description = f"An epic embodiment of '{request.prompt}', displaying formidable powers that few can match. This card represents significant magical potential."
    else:  # Legendary
        long_description = f"The true legendary form of '{request.prompt}', possessing unmatched power and abilities. This is the ultimate expression of its concept."
    
    # Create metadata
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

@app.get("/metadata/{token_id}")
async def get_metadata(token_id: str):
    """Return metadata for a specific token (for OpenSea, etc.)"""
    # In production, this would fetch from a database
    return {
        "name": f"ArcaneETH Card #{token_id}",
        "description": "An AI-generated trading card from ArcaneETH",
        "image": f"https://api.arcaneeth.com/image/{token_id}",
        "attributes": []
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)