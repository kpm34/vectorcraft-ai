"""
Find Dream Textures internal generation API
"""
import bpy
import sys

# Enable addon
bpy.ops.preferences.addon_enable(module='dream_textures')

# Import Dream Textures modules
import dream_textures

print("="*60)
print("Dream Textures Module Structure")
print("="*60)

# List all submodules
def explore_module(mod, prefix="", depth=0):
    if depth > 2:  # Limit recursion
        return

    indent = "  " * depth
    members = dir(mod)

    for member in members:
        if member.startswith('_'):
            continue

        try:
            obj = getattr(mod, member)
            if callable(obj) and 'generate' in member.lower():
                print(f"{indent}✓ Function: {prefix}{member}")
                # Try to get signature
                try:
                    import inspect
                    sig = inspect.signature(obj)
                    print(f"{indent}  Signature: {sig}")
                except:
                    pass
            elif hasattr(obj, '__module__') and obj.__module__ and 'dream_textures' in obj.__module__:
                if depth < 2:
                    print(f"{indent}📦 Module: {prefix}{member}")
                    explore_module(obj, f"{prefix}{member}.", depth + 1)
        except:
            pass

explore_module(dream_textures)

print("\n" + "="*60)
print("Searching for generation classes/functions")
print("="*60)

# Search for specific generation-related items
search_terms = ['generate', 'prompt', 'diffusion', 'pipeline', 'backend', 'render']

for term in search_terms:
    print(f"\n[{term}]")
    for attr in dir(dream_textures):
        if term.lower() in attr.lower():
            obj = getattr(dream_textures, attr)
            print(f"  - {attr}: {type(obj)}")

