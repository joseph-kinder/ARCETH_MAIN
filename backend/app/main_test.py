from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import random
import hashlib
from datetime import datetime

app = FastAPI(title="ArcaneETH Card Generator API - Test Mode")

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
    rarity: Optional[str] = None
    user_address: Optional[str] = None

# Predefined test data
ELEMENTS = ["Fire", "Water", "Earth", "Air", "Light", "Dark"]
RARITIES = ["Common", "Rare", "Epic", "Legendary"]

@app.get("/")
async def root():
    return {
        "name": "ArcaneETH Card Generator API",
        "version": "2.0-test",
        "status": "running in test mode",
        "endpoints": {
            "/generate": "Generate a new card",
            "/health": "Check API health"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "mode": "test",
        "services": {
            "redis": False,
            "google_ai": False
        }
    }

@app.post("/generate")
async def generate_card(request: GenerateCardRequest):
    """Generate a test card with random attributes"""
    
    # Create a hash of the prompt
    prompt_hash = hashlib.md5(request.prompt.encode()).hexdigest()
    
    # Determine rarity
    if request.rarity and request.rarity in RARITIES:
        rarity = request.rarity
    else:
        # Random rarity with weights
        rarity = random.choices(
            RARITIES,
            weights=[60, 25, 10, 5],
            k=1
        )[0]
    
    # Generate random stats based on rarity
    rarity_multipliers = {
        "Common": 1.0,
        "Rare": 1.3,
        "Epic": 1.6,
        "Legendary": 2.0
    }
    
    base_attack = random.randint(20, 50)
    base_defense = random.randint(20, 50)
    multiplier = rarity_multipliers[rarity]
    
    # Create metadata
    metadata = {
        "name": f"{request.prompt[:30]}",
        "short_description": f"A {rarity.lower()} creature born from imagination",
        "long_description": f"This {rarity.lower()} card was created from the prompt: {request.prompt}",
        "element": random.choice(ELEMENTS),
        "attack": int(base_attack * multiplier),
        "defense": int(base_defense * multiplier),
        "rarity": rarity,
        "image_url": f"/api/image/{prompt_hash}",
        "generation_timestamp": datetime.utcnow().isoformat(),
        "prompt_hash": prompt_hash
    }
    
    return JSONResponse(content=metadata, status_code=200)

@app.get("/image/{prompt_hash}")
async def get_image(prompt_hash: str):
    """Return a placeholder image"""
    # In test mode, just return a message
    return JSONResponse(
        content={
            "message": "Image generation not available in test mode",
            "prompt_hash": prompt_hash
        },
        status_code=200
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)