from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
from typing import Optional
import random
import hashlib
from datetime import datetime
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

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
    rarity: str
    user_address: Optional[str] = None

ELEMENTS = ["Fire", "Water", "Earth", "Air", "Light", "Dark"]

RARITY_CONFIGS = {
    "Common": {
        "stat_range": (10, 40),
        "description_prefix": "A simple",
        "description_suffix": "with basic abilities",
        "power_words": ["basic", "simple", "ordinary", "standard", "modest"],
        "color": (150, 150, 150)  # Gray
    },
    "Rare": {
        "stat_range": (30, 60),
        "description_prefix": "An uncommon",
        "description_suffix": "with enhanced powers",
        "power_words": ["enhanced", "improved", "notable", "special", "refined"],
        "color": (0, 150, 255)  # Blue
    },
    "Epic": {
        "stat_range": (50, 80),
        "description_prefix": "A powerful",
        "description_suffix": "with exceptional abilities",
        "power_words": ["powerful", "mighty", "formidable", "exceptional", "impressive"],
        "color": (178, 0, 237)  # Purple
    },
    "Legendary": {
        "stat_range": (70, 100),
        "description_prefix": "The legendary",
        "description_suffix": "with unmatched power",
        "power_words": ["legendary", "mythical", "unmatched", "supreme", "ultimate"],
        "color": (255, 215, 0)  # Gold
    }
}

def generate_card_image(name, rarity, element, attack, defense):
    """Generate a simple card image"""
    width, height = 400, 600
    img = Image.new('RGB', (width, height), color='black')
    draw = ImageDraw.Draw(img)
    
    # Get rarity color
    rarity_color = RARITY_CONFIGS[rarity]["color"]
    
    # Draw border
    border_width = 10
    draw.rectangle([0, 0, width-1, height-1], outline=rarity_color, width=border_width)
    
    # Draw inner border
    draw.rectangle([20, 20, width-20, height-20], outline=rarity_color, width=2)
    
    # Try to use default font, fallback to basic if needed
    try:
        title_font = ImageFont.truetype("arial.ttf", 24)
        body_font = ImageFont.truetype("arial.ttf", 18)
        stat_font = ImageFont.truetype("arial.ttf", 20)
    except:
        # Fallback to default font
        title_font = ImageFont.load_default()
        body_font = ImageFont.load_default()
        stat_font = ImageFont.load_default()
    
    # Draw card content
    y_offset = 40
    
    # Title (truncate if too long)
    if len(name) > 20:
        name = name[:17] + "..."
    draw.text((width//2, y_offset), name, fill='white', font=title_font, anchor="mt")
    
    # Rarity
    y_offset += 40
    draw.text((width//2, y_offset), rarity, fill=rarity_color, font=body_font, anchor="mt")
    
    # Element
    y_offset += 30
    draw.text((width//2, y_offset), f"Element: {element}", fill='white', font=body_font, anchor="mt")
    
    # Card art placeholder
    art_top = y_offset + 40
    art_bottom = height - 150
    draw.rectangle([40, art_top, width-40, art_bottom], fill=(50, 50, 50), outline=rarity_color, width=2)
    draw.text((width//2, (art_top + art_bottom)//2), "AI Art\nPlaceholder", fill='white', font=body_font, anchor="mm", align="center")
    
    # Stats
    stat_y = height - 100
    draw.text((60, stat_y), f"ATK: {attack}", fill='red', font=stat_font)
    draw.text((width-120, stat_y), f"DEF: {defense}", fill='lightblue', font=stat_font)
    
    # Convert to base64
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return img_str

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
    
    # Generate stats
    min_stat, max_stat = config["stat_range"]
    attack = random.randint(min_stat, max_stat)
    defense = random.randint(min_stat, max_stat)
    
    # Generate name based on prompt and rarity
    name = request.prompt[:30]  # Truncate to 30 chars
    if request.rarity == "Common" and any(word in request.prompt.lower() for word in ["god", "supreme", "ultimate", "legendary"]):
        name = f"Lesser {name}"
    elif request.rarity == "Rare" and any(word in request.prompt.lower() for word in ["god", "supreme", "ultimate"]):
        name = f"Minor {name}"
    
    # Generate element
    element = random.choice(ELEMENTS)
    
    # Generate descriptions
    power_word = random.choice(config["power_words"])
    short_description = f"{config['description_prefix']} {power_word} creature {config['description_suffix']}"
    
    if request.rarity == "Common":
        long_description = f"While inspired by '{request.prompt}', this common manifestation possesses only basic abilities. Its power is limited, suitable for a novice's collection."
    elif request.rarity == "Rare":
        long_description = f"This rare interpretation of '{request.prompt}' shows enhanced capabilities beyond the ordinary. Its abilities are refined but not yet exceptional."
    elif request.rarity == "Epic":
        long_description = f"An epic embodiment of '{request.prompt}', displaying formidable powers that few can match. This card represents significant magical potential."
    else:
        long_description = f"The true legendary form of '{request.prompt}', possessing unmatched power and abilities. This is the ultimate expression of its concept."
    
    # Generate card image
    image_base64 = generate_card_image(name, request.rarity, element, attack, defense)
    
    # Create full metadata
    metadata = {
        "name": name,
        "short_description": short_description,
        "long_description": long_description,
        "element": element,
        "attack": attack,
        "defense": defense,
        "rarity": request.rarity,
        "image_url": f"/api/image/{prompt_hash}",
        "image_data": image_base64,  # Include the actual image data
        "generation_timestamp": datetime.utcnow().isoformat(),
        "prompt_hash": prompt_hash,
        "original_prompt": request.prompt
    }
    
    return JSONResponse(content=metadata, status_code=200)

@app.get("/api/image/{prompt_hash}")
async def get_image(prompt_hash: str):
    """Return a generated card image"""
    # In production, you'd retrieve this from storage
    # For now, generate a placeholder
    img = Image.new('RGB', (400, 600), color='black')
    draw = ImageDraw.Draw(img)
    draw.text((200, 300), "Card Image", fill='white', anchor="mm")
    
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    
    return Response(content=buffered.getvalue(), media_type="image/png")

@app.get("/metadata/{token_id}")
async def get_metadata(token_id: str):
    """Return metadata for a specific token (for OpenSea, etc.)"""
    return {
        "name": f"ArcaneETH Card #{token_id}",
        "description": "An AI-generated trading card from ArcaneETH",
        "image": f"https://api.arcaneeth.com/image/{token_id}",
        "attributes": []
    }

# Vercel handler
handler = app