"""
Check the actual model configuration in the scene
"""
import bpy

# Enable addon
bpy.ops.preferences.addon_enable(module='dream_textures')

scene = bpy.context.scene

print("="*60)
print("Scene Dream Textures Configuration")
print("="*60)

# Check engine prompt
if hasattr(scene, 'dream_textures_engine_prompt'):
    engine = scene.dream_textures_engine_prompt
    print(f"\nEngine Prompt:")
    for attr in dir(engine):
        if not attr.startswith('_') and 'model' in attr.lower():
            val = getattr(engine, attr, None)
            print(f"  {attr}: {val}")

# Check prompt
if hasattr(scene, 'dream_textures_prompt'):
    prompt = scene.dream_textures_prompt
    print(f"\nPrompt:")
    for attr in dir(prompt):
        if not attr.startswith('_') and ('model' in attr.lower() or 'backend' in attr.lower()):
            val = getattr(prompt, attr, None)
            print(f"  {attr}: {val}")

# Get addon preferences
addon = bpy.context.preferences.addons.get('dream_textures')
if addon:
    print(f"\nAddon Preferences:")
    prefs = addon.preferences
    if hasattr(prefs, 'installed_models'):
        print(f"  Installed models: {len(prefs.installed_models)}")
        for i, model in enumerate(prefs.installed_models):
            print(f"    {i}: {model.name if hasattr(model, 'name') else model}")
            if hasattr(model, 'id'):
                print(f"       ID: {model.id}")

# Try to generate args and see what's in it
print("\n" + "="*60)
print("Testing generate_args()")
print("="*60)

try:
    gen_args = scene.dream_textures_prompt.generate_args(bpy.context)
    print(f"Generated args successfully!")
    print(f"  Model: {gen_args.model}")
    print(f"  Width: {gen_args.width}")
    print(f"  Height: {gen_args.height}")
    print(f"  Steps: {gen_args.steps}")
except Exception as e:
    print(f"Error generating args: {e}")
    import traceback
    traceback.print_exc()
