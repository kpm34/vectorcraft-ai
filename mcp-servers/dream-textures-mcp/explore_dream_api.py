"""
Explore Dream Textures API to understand how to generate textures programmatically
"""
import bpy

# Enable addon
bpy.ops.preferences.addon_enable(module='dream_textures')

print("="*60)
print("Exploring Dream Textures Node System")
print("="*60)

# Create new node tree
bpy.ops.dream_textures.new_engine_node_tree()

# Find the created node tree
node_trees = [nt for nt in bpy.data.node_groups if 'Dream' in nt.name]
print(f"\nNode trees created: {len(node_trees)}")
for nt in node_trees:
    print(f"  - {nt.name} (type: {nt.bl_idname})")
    print(f"    Nodes: {[n.name for n in nt.nodes]}")
    for node in nt.nodes:
        print(f"\n    Node: {node.name} ({node.bl_idname})")
        if hasattr(node, 'inputs'):
            print(f"      Inputs: {[inp.name for inp in node.inputs]}")
        if hasattr(node, 'outputs'):
            print(f"      Outputs: {[out.name for out in node.outputs]}")

        # Check for properties
        props = [p for p in dir(node) if not p.startswith('_') and not callable(getattr(node, p))]
        if props:
            print(f"      Properties: {props[:10]}")  # First 10 props

# Check scene properties
print("\n" + "="*60)
print("Scene Properties:")
print("="*60)

scene_props = [p for p in dir(bpy.context.scene) if 'dream' in p.lower()]
print(f"Dream-related properties: {scene_props}")

for prop in scene_props:
    val = getattr(bpy.context.scene, prop)
    print(f"  - {prop}: {type(val)}")
    if hasattr(val, '__dict__'):
        print(f"    Attributes: {list(val.__dict__.keys())[:10]}")

print("\n" + "="*60)
print("Complete!")
print("="*60)
