"""
Inspect Dream Textures addon to find available operators
"""
import bpy

# Enable Dream Textures
try:
    bpy.ops.preferences.addon_enable(module='dream_textures')
    print("✓ Dream Textures enabled")
except Exception as e:
    print(f"✗ Failed to enable: {e}")

# List all Dream Textures operators
print("\n" + "="*60)
print("Available Dream Textures Operators:")
print("="*60)

dream_ops = [op for op in dir(bpy.ops) if 'dream' in op.lower()]
for category in dream_ops:
    print(f"\n[{category}]")
    cat = getattr(bpy.ops, category)
    ops = [op for op in dir(cat) if not op.startswith('_')]
    for op in ops:
        print(f"  - bpy.ops.{category}.{op}")

# Check Dream Textures preferences
print("\n" + "="*60)
print("Dream Textures Addon Info:")
print("="*60)

addon = bpy.context.preferences.addons.get('dream_textures')
if addon:
    print(f"✓ Addon found: {addon.module}")
    if hasattr(addon, 'preferences'):
        prefs = addon.preferences
        print(f"Preferences: {dir(prefs)}")
else:
    print("✗ Addon not found in preferences")

# Check available properties
print("\n" + "="*60)
print("Checking for Dream Textures UI panels:")
print("="*60)

for cls in bpy.types.Panel.__subclasses__():
    if 'dream' in cls.bl_label.lower() or 'dream' in cls.__name__.lower():
        print(f"  - {cls.bl_label} ({cls.__name__})")

print("\n" + "="*60)
print("Complete!")
print("="*60)
