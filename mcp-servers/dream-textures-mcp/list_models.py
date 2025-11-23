"""
List available Stable Diffusion models in Dream Textures
"""
import bpy

# Enable addon
bpy.ops.preferences.addon_enable(module='dream_textures')

print("="*60)
print("Available Dream Textures Models")
print("="*60)

# Get backend
backend = bpy.context.scene.dream_textures_engine_prompt.get_backend()

# List models
models = backend.list_models()
print(f"\nFound {len(models)} models:\n")
for i, model in enumerate(models):
    print(f"{i+1}. {model}")
    if hasattr(model, '__dict__'):
        for key, val in model.__dict__.items():
            if not key.startswith('_'):
                print(f"   {key}: {val}")

# Check preferences for installed models
addon = bpy.context.preferences.addons.get('dream_textures')
if addon and hasattr(addon.preferences, 'installed_models'):
    print("\n" + "="*60)
    print("Installed Models (from preferences):")
    print("="*60)
    for model in addon.preferences.installed_models:
        print(f"  - {model.name if hasattr(model, 'name') else model}")
        if hasattr(model, 'id'):
            print(f"    ID: {model.id}")
