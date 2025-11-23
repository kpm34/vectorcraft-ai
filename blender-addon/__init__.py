bl_info = {
    "name": "VectorCraft Bridge",
    "author": "VectorCraft AI",
    "version": (1, 0, 0),
    "blender": (3, 0, 0),
    "location": "View3D > Sidebar > VectorCraft",
    "description": "Send curves to VectorCraft AI for cleaning and optimization",
    "category": "Import-Export",
}

import bpy
import bmesh
import tempfile
import os
import requests
from bpy.props import StringProperty, BoolProperty, EnumProperty
from bpy.types import Panel, Operator

class VECTORCRAFT_OT_send_to_editor(Operator):
    """Send selected curve or text to VectorCraft AI editor"""
    bl_idname = "vectorcraft.send_to_editor"
    bl_label = "Send to VectorCraft"
    bl_options = {'REGISTER', 'UNDO'}

    @classmethod
    def poll(cls, context):
        return context.selected_objects and any(
            obj.type in {'CURVE', 'FONT'} for obj in context.selected_objects
        )

    def execute(self, context):
        selected = [obj for obj in context.selected_objects if obj.type in {'CURVE', 'FONT'}]

        if not selected:
            self.report({'WARNING'}, "No curves or text objects selected")
            return {'CANCELLED'}

        # Export selected objects to SVG
        svg_path = export_to_svg(selected, context)

        if not svg_path:
            self.report({'ERROR'}, "Failed to export SVG")
            return {'CANCELLED'}

        # Open in VectorCraft web editor
        # For now, just open the local file
        # In production, upload to VectorCraft API
        import webbrowser
        webbrowser.open('http://localhost:5173')  # VectorCraft dev server

        self.report({'INFO'}, f"Exported {len(selected)} object(s) to VectorCraft")
        return {'FINISHED'}


class VECTORCRAFT_OT_import_from_editor(Operator):
    """Import cleaned SVG from VectorCraft"""
    bl_idname = "vectorcraft.import_from_editor"
    bl_label = "Import from VectorCraft"
    bl_options = {'REGISTER', 'UNDO'}

    filepath: StringProperty(subtype='FILE_PATH')
    auto_extrude: BoolProperty(name="Auto Extrude", default=True)
    extrude_depth: bpy.props.FloatProperty(name="Extrude Depth", default=0.1, min=0)
    bevel_depth: bpy.props.FloatProperty(name="Bevel Depth", default=0.01, min=0)

    def execute(self, context):
        if not self.filepath:
            self.report({'WARNING'}, "No file selected")
            return {'CANCELLED'}

        # Import SVG as curves
        bpy.ops.import_curve.svg(filepath=self.filepath)

        if self.auto_extrude:
            # Auto-extrude imported curves
            for obj in context.selected_objects:
                if obj.type == 'CURVE':
                    obj.data.extrude = self.extrude_depth
                    obj.data.bevel_depth = self.bevel_depth

        self.report({'INFO'}, f"Imported curves from VectorCraft")
        return {'FINISHED'}

    def invoke(self, context, event):
        context.window_manager.fileselect_add(self)
        return {'RUNNING_MODAL'}


class VECTORCRAFT_PT_panel(Panel):
    """VectorCraft Bridge Panel"""
    bl_label = "VectorCraft Bridge"
    bl_idname = "VECTORCRAFT_PT_panel"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'VectorCraft'

    def draw(self, context):
        layout = self.layout

        # Send to Editor section
        box = layout.box()
        box.label(text="Export to VectorCraft", icon='EXPORT')

        selected_curves = [obj for obj in context.selected_objects if obj.type in {'CURVE', 'FONT'}]

        if selected_curves:
            box.label(text=f"Selected: {len(selected_curves)} curve(s)", icon='CHECKMARK')
        else:
            box.label(text="Select curves or text", icon='INFO')

        row = box.row()
        row.scale_y = 1.5
        row.operator("vectorcraft.send_to_editor", icon='EXPORT')

        # Import from Editor section
        box = layout.box()
        box.label(text="Import from VectorCraft", icon='IMPORT')

        row = box.row()
        row.scale_y = 1.5
        row.operator("vectorcraft.import_from_editor", icon='IMPORT')

        # Settings
        box = layout.box()
        box.label(text="Settings", icon='PREFERENCES')
        box.prop(context.scene, "vectorcraft_api_url")


def export_to_svg(objects, context):
    """Export selected Blender curves to SVG"""
    try:
        # Create temporary file
        temp_dir = tempfile.gettempdir()
        svg_path = os.path.join(temp_dir, "vectorcraft_export.svg")

        # Select only the objects we want
        bpy.ops.object.select_all(action='DESELECT')
        for obj in objects:
            obj.select_set(True)

        # Export to SVG
        bpy.ops.export_curve.svg(filepath=svg_path)

        return svg_path
    except Exception as e:
        print(f"Export failed: {e}")
        return None


def register():
    bpy.utils.register_class(VECTORCRAFT_OT_send_to_editor)
    bpy.utils.register_class(VECTORCRAFT_OT_import_from_editor)
    bpy.utils.register_class(VECTORCRAFT_PT_panel)

    # Add settings
    bpy.types.Scene.vectorcraft_api_url = StringProperty(
        name="API URL",
        default="http://localhost:3001/api"
    )


def unregister():
    bpy.utils.unregister_class(VECTORCRAFT_OT_send_to_editor)
    bpy.utils.unregister_class(VECTORCRAFT_OT_import_from_editor)
    bpy.utils.unregister_class(VECTORCRAFT_PT_panel)

    del bpy.types.Scene.vectorcraft_api_url


if __name__ == "__main__":
    register()
