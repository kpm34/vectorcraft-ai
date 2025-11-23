"""
Blender Dream Textures Bridge
Exposes Dream Textures plugin via HTTP API for MCP server integration
"""

import bpy
import sys
import json
import base64
import io
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Enable Dream Textures addon
try:
    bpy.ops.preferences.addon_enable(module='dream_textures')
    print("✓ Dream Textures addon enabled")
except Exception as e:
    print(f"✗ Failed to enable Dream Textures: {e}")
    print("Make sure Dream Textures is installed in Blender")

@app.route('/health', methods=['GET'])
def health_check():
    """Check if Blender and Dream Textures are ready"""
    try:
        # Check if Dream Textures is available
        addon_enabled = 'dream_textures' in bpy.context.preferences.addons

        return jsonify({
            'status': 'healthy',
            'blender_version': bpy.app.version_string,
            'dream_textures_enabled': addon_enabled,
            'python_version': sys.version
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/generate-texture', methods=['POST'])
def generate_texture():
    """
    Generate single texture map using Dream Textures direct API

    Request body:
    {
        "prompt": "brushed steel texture",
        "resolution": 1024,
        "seed": -1,
        "steps": 20,
        "map_type": "albedo" | "normal" | "roughness" | "metallic"
    }
    """
    try:
        data = request.json
        prompt = data['prompt']
        resolution = data.get('resolution', 1024)
        seed = data.get('seed', -1)
        steps = data.get('steps', 20)
        map_type = data.get('map_type', 'albedo')

        # Adjust prompt based on map type
        if map_type == 'normal':
            prompt = f"{prompt}, normal map, blue purple surface detail, bump map"
        elif map_type == 'roughness':
            prompt = f"{prompt}, roughness map, grayscale surface variation, smooth to rough"
        elif map_type == 'metallic':
            prompt = f"{prompt}, metallic map, grayscale metal mask, black non-metal white metal"
        elif map_type == 'ao':
            prompt = f"{prompt}, ambient occlusion map, grayscale cavity shadows"

        # Use scene's existing Dream Textures configuration
        scene = bpy.context.scene

        # Get the texture-diffusion model (Model 0 from installed models)
        addon = bpy.context.preferences.addons.get('dream_textures')
        if addon and hasattr(addon.preferences, 'installed_models') and len(addon.preferences.installed_models) > 0:
            texture_model = addon.preferences.installed_models[0]  # dream-textures/texture-diffusion
            print(f"Using model: {texture_model.model_base}")
        else:
            return jsonify({
                'success': False,
                'error': 'No models installed. Please install dream-textures/texture-diffusion model.'
            }), 500

        # Update prompt in scene properties
        scene.dream_textures_prompt.prompt_structure = "custom"
        scene.dream_textures_prompt.prompt_structure_token_subject = prompt

        # Set resolution and steps
        scene.dream_textures_prompt.width = resolution
        scene.dream_textures_prompt.height = resolution
        scene.dream_textures_prompt.steps = steps

        if seed != -1:
            scene.dream_textures_prompt.random_seed = False
            scene.dream_textures_prompt.seed = seed
        else:
            scene.dream_textures_prompt.random_seed = True

        # Generate using the existing backend configuration
        backend = scene.dream_textures_engine_prompt.get_backend()

        # Build generation arguments from scene settings
        gen_args = scene.dream_textures_prompt.generate_args(bpy.context)

        # Manually set the model since the enum is broken in Blender 4.5.1
        # Create a model wrapper with the expected 'id' attribute
        class ModelWrapper:
            def __init__(self, model):
                self.id = model.model_base  # Use model_base as id
                self.model = model.model  # Full path
                self.model_base = model.model_base

        gen_args.model = ModelWrapper(texture_model)

        # Generate texture
        generated_result = None
        generation_error = None

        def step_callback(results):
            return True  # Continue generation

        def complete_callback(result):
            nonlocal generated_result, generation_error
            if isinstance(result, Exception):
                generation_error = result
            elif isinstance(result, list) and len(result) > 0:
                generated_result = result[0]

        backend.generate(gen_args, step_callback, complete_callback)

        # Wait for generation to complete
        import time
        timeout = 120  # 2 minutes max
        elapsed = 0
        while generated_result is None and generation_error is None and elapsed < timeout:
            time.sleep(0.5)
            elapsed += 0.5

        if generation_error:
            return jsonify({
                'success': False,
                'error': f'Generation failed: {str(generation_error)}'
            }), 500

        if generated_result is None:
            return jsonify({
                'success': False,
                'error': 'Generation timed out'
            }), 500

        # Convert PIL image to base64
        from io import BytesIO
        buffer = BytesIO()
        generated_result.image.save(buffer, format='PNG')
        img_data = base64.b64encode(buffer.getvalue()).decode('utf-8')

        return jsonify({
            'success': True,
            'map_type': map_type,
            'image': img_data,
            'resolution': resolution,
            'prompt_used': prompt
        })

    except Exception as e:
        import traceback
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/generate-pbr-set', methods=['POST'])
def generate_pbr_set():
    """
    Generate complete PBR texture set using Dream Textures direct API

    Request body:
    {
        "prompt": "brushed steel with scratches",
        "resolution": 1024,
        "seed": -1,
        "steps": 20,
        "maps": ["albedo", "normal", "roughness", "metallic", "ao"]
    }
    """
    try:
        data = request.json
        base_prompt = data['prompt']
        resolution = data.get('resolution', 1024)
        seed = data.get('seed', -1)
        steps = data.get('steps', 20)
        maps = data.get('maps', ['albedo', 'normal', 'roughness', 'metallic'])

        results = {}

        # Import needed modules
        from io import BytesIO
        import time

        # Get scene configuration
        scene = bpy.context.scene
        backend = scene.dream_textures_engine_prompt.get_backend()

        # Get the texture-diffusion model
        addon = bpy.context.preferences.addons.get('dream_textures')
        if addon and hasattr(addon.preferences, 'installed_models') and len(addon.preferences.installed_models) > 0:
            texture_model = addon.preferences.installed_models[0]
            print(f"Using model: {texture_model.model_base}")
        else:
            return jsonify({
                'success': False,
                'error': 'No models installed. Please install dream-textures/texture-diffusion model.'
            }), 500

        # Generate each map type
        for map_type in maps:
            # Create specialized prompt for each map
            if map_type == 'albedo':
                prompt = f"{base_prompt}, color map, diffuse texture, photorealistic material"
            elif map_type == 'normal':
                prompt = f"{base_prompt}, normal map, blue purple tangent space, surface detail"
            elif map_type == 'roughness':
                prompt = f"{base_prompt}, roughness map, grayscale, smooth black rough white"
            elif map_type == 'metallic':
                prompt = f"{base_prompt}, metallic map, grayscale, metal white non-metal black"
            elif map_type == 'ao':
                prompt = f"{base_prompt}, ambient occlusion, grayscale, cavity shadows"
            else:
                prompt = base_prompt

            print(f"Generating {map_type} map: {prompt}")

            # Update scene prompt settings
            scene.dream_textures_prompt.prompt_structure = "custom"
            scene.dream_textures_prompt.prompt_structure_token_subject = prompt
            scene.dream_textures_prompt.width = resolution
            scene.dream_textures_prompt.height = resolution
            scene.dream_textures_prompt.steps = steps

            if seed != -1:
                scene.dream_textures_prompt.random_seed = False
                scene.dream_textures_prompt.seed = seed
            else:
                scene.dream_textures_prompt.random_seed = True

            # Generate arguments from scene
            gen_args = scene.dream_textures_prompt.generate_args(bpy.context)

            # Manually set the model with wrapper
            class ModelWrapper:
                def __init__(self, model):
                    self.id = model.model_base
                    self.model = model.model
                    self.model_base = model.model_base

            gen_args.model = ModelWrapper(texture_model)

            # Generate texture
            generated_result = None
            generation_error = None

            def step_callback(results):
                return True

            def complete_callback(result):
                nonlocal generated_result, generation_error
                if isinstance(result, Exception):
                    generation_error = result
                elif isinstance(result, list) and len(result) > 0:
                    generated_result = result[0]

            backend.generate(gen_args, step_callback, complete_callback)

            # Wait for generation
            timeout = 120
            elapsed = 0
            while generated_result is None and generation_error is None and elapsed < timeout:
                time.sleep(0.5)
                elapsed += 0.5

            if generation_error:
                print(f"✗ Failed to generate {map_type}: {str(generation_error)}")
                results[map_type] = None
            elif generated_result:
                # Convert to base64
                buffer = BytesIO()
                generated_result.image.save(buffer, format='PNG')
                results[map_type] = base64.b64encode(buffer.getvalue()).decode('utf-8')
                print(f"✓ Generated {map_type}")
            else:
                results[map_type] = None
                print(f"✗ Failed to generate {map_type} (timeout)")

        return jsonify({
            'success': True,
            'prompt': base_prompt,
            'resolution': resolution,
            'maps': results
        })

    except Exception as e:
        import traceback
        return jsonify({
            'success': False,
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/refine-texture', methods=['POST'])
def refine_texture():
    """
    Refine existing texture using img2img

    Request body:
    {
        "base_texture": "base64_png_data",
        "prompt": "add scratches and wear",
        "strength": 0.5,
        "resolution": 1024,
        "steps": 20
    }
    """
    try:
        data = request.json
        base_texture_b64 = data['base_texture']
        prompt = data['prompt']
        strength = data.get('strength', 0.5)
        resolution = data.get('resolution', 1024)
        steps = data.get('steps', 20)

        # Decode base texture
        img_data = base64.b64decode(base_texture_b64)
        temp_input = '/tmp/dream_input.png'

        with open(temp_input, 'wb') as f:
            f.write(img_data)

        # Load image into Blender
        base_img = bpy.data.images.load(temp_input)

        # Call Dream Textures img2img
        bpy.ops.dream_textures.refine_texture(
            image=base_img,
            prompt=prompt,
            strength=strength,
            steps=steps,
            width=resolution,
            height=resolution
        )

        # Get refined image
        refined_img = bpy.data.images.get('DreamTextures_Refined')

        if refined_img:
            temp_output = '/tmp/dream_refined.png'
            refined_img.filepath_raw = temp_output
            refined_img.file_format = 'PNG'
            refined_img.save()

            with open(temp_output, 'rb') as f:
                refined_data = base64.b64encode(f.read()).decode('utf-8')

            # Cleanup
            os.remove(temp_input)
            os.remove(temp_output)
            bpy.data.images.remove(base_img)
            bpy.data.images.remove(refined_img)

            return jsonify({
                'success': True,
                'image': refined_data
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Refinement failed'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("Dream Textures Blender Bridge")
    print("=" * 60)
    print(f"Blender version: {bpy.app.version_string}")
    print(f"Python version: {sys.version}")
    print("Starting Flask API server on http://127.0.0.1:5555")
    print("=" * 60)

    app.run(
        host='127.0.0.1',
        port=5555,
        debug=False,
        threaded=True
    )
