"""
Manually set a model from installed models
"""
import bpy

# Enable addon
bpy.ops.preferences.addon_enable(module='dream_textures')

scene = bpy.context.scene
addon = bpy.context.preferences.addons.get('dream_textures')

print("="*60)
print("Installed Models Detail")
print("="*60)

if addon and hasattr(addon.preferences, 'installed_models'):
    models = addon.preferences.installed_models
    print(f"\nFound {len(models)} installed models\n")

    for i, model in enumerate(models):
        print(f"Model {i}:")
        # Print all attributes
        for attr in dir(model):
            if not attr.startswith('_') and not callable(getattr(model, attr)):
                try:
                    val = getattr(model, attr)
                    if val:  # Only print non-empty values
                        print(f"  {attr}: {val}")
                except:
                    pass
        print()

    # Try to set the first non-empty model
    print("="*60)
    print("Attempting to set model")
    print("="*60)

    for i, model in enumerate(models):
        if hasattr(model, 'id') and model.id:
            print(f"\nTrying to set model {i}: ID={model.id}")
            try:
                scene.dream_textures_prompt.model = model.id
                print(f"✓ Successfully set model to: {scene.dream_textures_prompt.model}")
                break
            except Exception as e:
                print(f"✗ Failed: {e}")
        elif hasattr(model, 'name') and model.name:
            print(f"\nTrying to set model {i}: name={model.name}")
            try:
                scene.dream_textures_prompt.model = model.name
                print(f"✓ Successfully set model to: {scene.dream_textures_prompt.model}")
                break
            except Exception as e:
                print(f"✗ Failed: {e}")
