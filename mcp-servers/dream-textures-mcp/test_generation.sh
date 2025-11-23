#!/bin/bash

echo "Testing Dream Textures Direct API Generation"
echo "=============================================="
echo ""

echo "1. Testing single texture generation (albedo)..."
curl -X POST http://127.0.0.1:5555/generate-texture \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "brushed metal",
    "resolution": 512,
    "steps": 10,
    "map_type": "albedo"
  }' \
  --max-time 180 \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data.get('success'):
    print('✓ Single texture generation PASSED')
    print(f\"  Generated {data.get('map_type')} at {data.get('resolution')}px\")
    print(f\"  Image data size: {len(data.get('image', ''))} bytes (base64)\")
else:
    print('✗ Single texture generation FAILED')
    print(f\"  Error: {data.get('error')}\")
    if 'traceback' in data:
        print(f\"  Traceback: {data['traceback']}\")
"

echo ""
echo "2. Testing PBR set generation (2 maps for speed)..."
curl -X POST http://127.0.0.1:5555/generate-pbr-set \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "rusty metal",
    "resolution": 512,
    "steps": 10,
    "maps": ["albedo", "roughness"]
  }' \
  --max-time 300 \
  | python3 -c "
import sys, json
data = json.load(sys.stdin)
if data.get('success'):
    maps = data.get('maps', {})
    successful = sum(1 for v in maps.values() if v is not None)
    print(f'✓ PBR set generation PASSED ({successful}/{len(maps)} maps)')
    for map_type, img_data in maps.items():
        if img_data:
            print(f\"  ✓ {map_type}: {len(img_data)} bytes\")
        else:
            print(f\"  ✗ {map_type}: failed\")
else:
    print('✗ PBR set generation FAILED')
    print(f\"  Error: {data.get('error')}\")
    if 'traceback' in data:
        print(f\"  Traceback: {data['traceback']}\")
"

echo ""
echo "=============================================="
echo "Test complete!"
