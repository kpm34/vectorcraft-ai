"""
Check Dream Textures version and compatibility
"""
import bpy
import os

# Enable addon
bpy.ops.preferences.addon_enable(module='dream_textures')

addon = bpy.context.preferences.addons.get('dream_textures')
if addon:
    print("="*60)
    print("Dream Textures Addon Info")
    print("="*60)
    print(f"Module: {addon.module}")

    # Get addon path
    import dream_textures
    addon_path = os.path.dirname(dream_textures.__file__)
    print(f"Path: {addon_path}")

    # Check for version info
    if hasattr(dream_textures, '__version__'):
        print(f"Version: {dream_textures.__version__}")

    # Check bl_info
    bl_info_path = os.path.join(addon_path, '__init__.py')
    if os.path.exists(bl_info_path):
        with open(bl_info_path, 'r') as f:
            content = f.read()
            # Find bl_info dict
            if 'bl_info' in content:
                import ast
                for line in content.split('\n'):
                    if 'version' in line.lower() and '(' in line:
                        print(f"Version line: {line.strip()}")

    print(f"\nBlender version: {bpy.app.version_string}")
    print(f"Blender API: {bpy.app.version}")

else:
    print("Dream Textures addon not found!")
