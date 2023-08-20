# -*- coding: utf-8 -*-
import os
import openai
import json
import re
import requests
import time
from PIL import Image, ImageFont, ImageDraw
from moralis import evm_api
import base64
from flask import Flask, request, jsonify

openai.api_key = os.environ.get("OPEN_AI_API_KEY")
url = os.environ.get("STABLE_DIFFUSION_URL")
stable_diff_key = os.environ.get("STABLE_DIFFUSION_API_KEY")
ipfs_api_key = os.environ.get("IPFS_API_KEY")

def get_attributes_alt(text):

  # Replace newlines with hashtag
  text = text.replace('\n', '#')
  text = text.replace('[', "")
  text = text.replace(']', "")

  # Split text on hashtag delimiter
  attributes = text.split('#')

  # Remove empty items
  attributes = [a for a in attributes if a]

  # Parse each attribute
  attributes_dict = {}
  for attr in attributes:
    name, value = attr.split(': ', 1)

    if value[-2:] == ", ":
      value[-2:] = ""
    elif value[-1] == ",":
      value[-1] = ""

    attributes_dict[name] = value


  # Remove hashtags
  attributes_dict = {k: v.replace('#', '') for k, v in attributes_dict.items()}

  return attributes_dict

def validate_metadata(metadata):

  # Required fields
  required_fields = ['name', 'short_description', 'long_description', 'element', 'attack', 'defense', 'rarity']

  try:
    with open(metadata, 'r') as f:
      metadata_str = f.read()

    data = json.loads(metadata_str.lower())
    print(data)

  except ValueError:
    print("Invalid JSON format")
    return False

  # Check required fields
  for field in required_fields:
    if field not in data:
      print(f"Missing required field: {field}")
      return False

  # Validate data types
  if not isinstance(data['name'], str):
    print("Name must be a string")
    return False

  if not isinstance(data['short_description'], str):
    print("Description must be a string")
    return False

  # And so on for other fields

  return True

def stable_diff(prompt):
  payload = json.dumps({
    "model_id": "sdxl",
    "key": stable_diff_key,
    "prompt": prompt + ", fantasy art style, center focus",
    "negative_prompt": None,
    "width": "680",
    "height": "992",
    "samples": "1",
    "num_inference_steps": "20",
    "seed": None,
    "guidance_scale": 7.5,
    "safety_checker": "yes",
    "multi_lingual": "no",
    "panorama": "no",
    "self_attention": "no",
    "upscale": "no",
    "embeddings_model": None,
    "webhook": None,
    "track_id": None
  })

  headers = {
  'Content-Type': 'application/json'
  }

  response = requests.request("POST", url, headers=headers, data=payload)


  return(response.text)

def gpt(prompt):
  prompt_full = "Fill in the following: name: {text}, short_description: {text}, long_description: {text}, element: {single-word}, attack: {#/100}, defense: {#/100}, rarity: {One of: Common, Rare, Epic, Legendary} for this fantasy character: " + str(prompt) + ". Reserve the more rare tiers for more powerful characters."
  response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": prompt_full}]
  )
  return response

def gpt_with_rar(prompt, rarity):
  prompt_full = "Fill in the following: name: {text}, short_description: {text}, long_description: {text}, element: {single-word}, attack: {#/100}, defense: {#/100}, rarity: {One of: Common, Rare, Epic, Legendary} for this fantasy character: " + str(prompt) + " with this rarity level: " + str(rarity) + ". The attributes should reflect the rarity level."
  response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": prompt_full}]
  )
  return response

def generate_card(prompt):

  valid = False
  while not valid:

    response = gpt(prompt)

    content = response['choices'][0]['message']['content']
    # Build metadata
    metadata = get_attributes_alt(content)

    # Save to JSON file
    with open('metadata.json', 'w') as f:
      json.dump(metadata, f)

    valid = validate_metadata('metadata.json')

  image_response = stable_diff(metadata["long_description"])
  image_response = json.loads(image_response)

  print(image_response)


  # Get image

  if image_response['status'] == 'success':
    image_url = image_response['output'][0]

  elif image_response['status'] == 'processing':
    # Wait for ETA
    time.sleep(round(image_response['eta']))

    # Fetch result
    image_url = image_response['fetch_result']


  _response = requests.get(image_url)

  with open('img_temp.png', 'wb') as f:
    f.write(_response.content)

  rarity = metadata['rarity']

  template = '/assets/borders/border upscaled gen.png'

  if rarity == 'Legendary':
    template = '/assets/borders/border upscaled gold.png'
  elif rarity == 'Epic':
    template = '/assets/borders/border upscaled purple.png'
  elif rarity == 'Rare':
    template = '/assets/borders/border upscaled blue.png'


  card = gen_card('img_temp.png', template)
  final_card = text_on_card('output.png', 'metadata.json')

  print("Metadata generated and saved")

  final_card.save('final_output.png')

  return final_card

def gen_card_with_rar(prompt, rarity):

  valid = False
  while not valid:

    response = gpt(prompt)

    content = response['choices'][0]['message']['content']
    # Build metadata
    metadata = get_attributes_alt(content)

    # Save to JSON file
    with open('metadata.json', 'w') as f:
      json.dump(metadata, f)

    valid = validate_metadata('metadata.json')

  if metadata['rarity'] != rarity:
    if metadata['rarity'] == 'Epic':
      return 'That is an Epic idea, please prompt again to get an idea that matches your rarity pass!'
    else:
      return 'That is a ' + metadata['rarity'] + ' idea, please prompt again to get an idea that matches your rarity pass!'

  image_response = stable_diff(metadata["long_description"])
  image_response = json.loads(image_response)

  print(image_response)


  # Get image

  if image_response['status'] == 'success':
    image_url = image_response['output'][0]

  elif image_response['status'] == 'processing':
    # Wait for ETA
    time.sleep(round(image_response['eta']))

    # Fetch result
    image_url = image_response['fetch_result']


  _response = requests.get(image_url)

  with open('img_temp.png', 'wb') as f:
    f.write(_response.content)

  rarity = metadata['rarity']

  template = '/assets/borders/border upscaled gen.png'

  if rarity == 'Legendary':
    template = '/assets/borders/border upscaled gold.png'
  elif rarity == 'Epic':
    template = '/assets/borders/border upscaled purple.png'
  elif rarity == 'Rare':
    template = '/assets/borders/border upscaled blue.png'


  card = gen_card('img_temp.png', template)
  final_card = text_on_card('output.png', 'metadata.json')

  print("Metadata generated and saved")

  final_card.save('final_output.png')

  return final_card

"""# Combining image & text into card"""

def gen_card(artwork, template):

  artwork = Image.open(artwork)
  template = Image.open(template)

  artwork = artwork.convert("RGBA")
  template = template.convert("RGBA")

  # Resizing not necessary when API is configured to give exact dimensions

  # Ideally the template is not resized, the image is generated to that dimension to preserve image quality

  # artwork_resized = artwork.resize((340, 500))
  # template_resized = template.resize((396,664))

  bg = Image.new('RGBA', (792,1328), (255,255,255))
  bg.paste(artwork, box=(60,70))

  composed = Image.alpha_composite(bg, template)
  composed.save('output.png')


  return composed

def text_on_card(card, metadata):

  with open(metadata, 'r') as f:
    metadata_str = f.read()

  card_meta = json.loads(metadata_str)

  rarity = card_meta['rarity']
  title = card_meta['name']
  description = card_meta['short_description']
  card = add_rarity(card, rarity)
  card = add_description('temp.png', add_title(card, title), description)


  return card

def add_rarity(card, rarity):

  card = Image.open(card)

  # Load font
  font = ImageFont.truetype('SavaPro-Black.ttf', size=32)

  # Create draw context
  draw = ImageDraw.Draw(card)

  color = 'White'
  x, y = 0, 1260
  # Set font color
  if rarity == 'Legendary':
    color = 'gold'
    x = 332
  elif rarity == 'Epic':
    color = 'purple'
    x = 367
  elif rarity == 'Rare':
    color = 'blue'
    x = 367
  elif rarity == 'Common':
    color = 'white'
    x = 340

  # Draw rarity
  draw.text((x, y), rarity, fill=color, font=font)

  return card

def add_title(card, title):

  # Load font
  font = ImageFont.truetype('SavaPro-Black.ttf', size=26)


  # Calculate text width
  text_width = font.getsize(title)[0]


  for size in range(54, 10, -1):
    font = ImageFont.truetype('SavaPro-Black.ttf', size=size)
    text_width = font.getsize(title)[0]
    if text_width < 445:
      break

  # Create draw context
  draw = ImageDraw.Draw(card)

  x = (card.width - text_width) / 2
  y = 1070

  if size < 18:
    # Find last space character
    last_space = title.rfind(' ')

    if last_space != -1:
      # Split at last space
      title1 = title[:last_space]
      title2 = title[last_space+1:]

    else:
      # No spaces, split mid-word
      title1 = title[:len(title)//2]
      title2 = title[len(title)//2:]

    # Use bigger font size
    font = ImageFont.truetype('SavaPro-Black.ttf', size=40)

    # Draw two lines
    x = (card.width - text_width)/2
    y_if = y
    draw.text((x, y_if), title1, fill='white', font=font)

    y_if += font.getsize(title1)[1]
    draw.text((x, y_if), title2, fill='white', font=font)

  else:
    draw.text((x, y), title, fill='white', font=font)
    y_if = y + font.getsize(title)[1]

  card.save('temp.png')

  return y_if

def add_description(card, y_start, desc):

  card = Image.open(card)

  # Load font
  font = ImageFont.truetype('SavaPro-Regular.ttf', size=30)

  draw = ImageDraw.Draw(card)

  # Generate all possible splits
  splits = re.split(r'\s+', desc)

  lines = []
  current_line = ''

  for split in splits:

    # Add next word to current line
    current_line += split + ' '
    width, _ = font.getsize(current_line)

    # If line exceeds width, move word to next line
    if width > 470:
      lines.append(current_line[:-(len(split) + 1)])
      current_line = split + ' '

  # Add final line
  lines.append(current_line)

  # Draw lines
  x = 170
  y = y_start + 10
  for line in lines:
    draw.text((x, y), line, font=font, fill='white')
    y += font.getsize(line)[1]

  return card

"""# Uploading to Ipfs

"""

def image_to_base64(image_path):

  with open(image_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read())

  return encoded_string.decode('utf-8')

def upload_image_to_ipfs(path):
  body = [
      {
          "path": path,
          "content": image_to_base64(path),
      }
  ]

  result = evm_api.ipfs.upload_folder(
      api_key=ipfs_api_key,
      body=body
  )

  return result

def upload_json_to_ipfs(metadata, img_path):

  with open(metadata, 'r') as f:
    metadata_str = f.read()

  meta = json.loads(metadata_str)

  attributes = ['element', 'attack', 'defense', 'rarity']

  att_list = []

  i=0

  for attribute in attributes:
    att_list.append(dict())
    att_list[i]['trait_type'] = attribute
    att_list[i]['value'] = meta[attribute]
    i+=1


  meta['image'] = upload_image_to_ipfs(img_path)[0]['path']
  meta['attributes'] = att_list

  with open('final_metadata.json', 'w') as f:
      json.dump(meta, f)

  body = [
      {
          "path" : "final_metadata.json",
          "content": base64.b64encode(bytes(json.dumps(meta), "ascii")).decode(
              "ascii"
          ),
      }

  ]

  result = evm_api.ipfs.upload_folder(
      api_key=ipfs_api_key,
      body=body
  )

  print(result)

"""# Endpoints"""

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_nft():
  data = request.json
  prompt = data['prompt']
  rarity = data['rarity']

  result = gen_card_with_rar(prompt, rarity)

  if isinstance(result, str):  # Check if the result is a string
        return jsonify({
            'message': result  # Return the string as a response
        })
  elif isinstance(result, Image):  # Check if the result is an image (you need to define the Image class)
        ipfs_uri = upload_image_to_ipfs(result)  # Upload the image to IPFS
        return jsonify({
            'ipfs_uri': ipfs_uri  # Return the IPFS URI as a response
        })

if __name__ == '__main__':
  app.run()

#Test comment 4