# VectorCraft Bridge - Blender Add-on

**The precision SVG editor Blender is missing for 2D curves and logos.**

## What It Does

VectorCraft Bridge connects Blender to VectorCraft AI, allowing you to:

1. **Send curves to VectorCraft** for cleaning and optimization
2. **Import cleaned SVG** back as perfect Blender curves
3. **Auto-extrude** imported curves with one click
4. **3D-ready exports** - Logos and decals optimized for 3D use

## Installation

1. Download `vectorcraft-bridge.zip`
2. In Blender: `Edit > Preferences > Add-ons > Install`
3. Select the downloaded zip file
4. Enable "VectorCraft Bridge"

## Usage

### Export from Blender to VectorCraft

1. Select a Curve or Text object in Blender
2. Open sidebar (`N` key) → VectorCraft tab
3. Click **"Send to VectorCraft"**
4. Your curve opens in the VectorCraft web editor
5. Clean, optimize, add effects, vectorize raster logos, etc.

### Import Cleaned SVG Back to Blender

1. In VectorCraft, export your cleaned vector
2. In Blender VectorCraft panel, click **"Import from VectorCraft"**
3. Select the exported SVG file
4. Curves are imported with optional auto-extrude & bevel

## Workflow Examples

### Clean Up a Logo for Helmet Decal

```
Blender: Import trash logo SVG → Send to VectorCraft
VectorCraft: Clean paths, remove artifacts, optimize
VectorCraft: Export 3D Pack (PNG decals + clean curves)
Blender: Import curves → Auto-extrude → Apply to helmet
```

### Convert Text to Clean Curves

```
Blender: Create Text object → Send to VectorCraft
VectorCraft: Convert to clean vector paths
VectorCraft: Export optimized SVG curves
Blender: Import → Extrude → Perfect 3D text
```

### Extract Logo from Website

```
VectorCraft: Import from URL (e.g., client.com)
VectorCraft: Crop logo area → AI vectorize → Clean
VectorCraft: Export 3D Pack
Blender: Import curves → Apply as stadium signage
```

## Features

### Auto-Extrude on Import
- Automatically extrudes imported curves
- Configurable depth and bevel
- Perfect for 3D text and logos

### 3D-Ready Exports
When you export from VectorCraft with "3D Export" mode:

**Decal Pack:**
- High-res PNGs with transparency (512px, 1k, 2k, 4k)
- Optional white/black sticker borders
- Perfect for helmets, jerseys, stadiums

**Curves Pack:**
- SVG optimized for Blender curve import
- No self-intersections
- Joined paths where possible
- Merged small artifacts

### Settings

- **API URL**: VectorCraft API endpoint (default: localhost)
- **Auto Extrude**: Enable/disable automatic extrusion
- **Extrude Depth**: How far to extrude curves
- **Bevel Depth**: Bevel radius for smooth edges

## Use Cases

### Sports Graphics
- Clean up team logos for helmets
- Create stadium signage
- Jersey numbers and text
- Scoreboard overlays

### Product Design
- Logo decals for products
- UI panel text and icons
- Branding elements

### Architectural Visualization
- Building signage
- Wayfinding graphics
- Company logos on buildings

## Requirements

- Blender 3.0 or higher
- VectorCraft AI (web app or local server)
- Internet connection (for API mode)

## Troubleshooting

**"No curves selected" error:**
- Make sure you've selected a Curve or Text object
- Font objects are supported

**Export fails:**
- Check that SVG export is enabled in Blender
- Ensure you have write permissions to temp directory

**Import doesn't auto-extrude:**
- Enable "Auto Extrude" in the import dialog
- Check that imported objects are curve type

## Roadmap

- [ ] Direct API integration (no file export/import)
- [ ] Live preview in Blender viewport
- [ ] Batch processing multiple curves
- [ ] Material presets for decals
- [ ] UV unwrap helper for curved surfaces

## Support

- Documentation: https://vectorcraft.ai/docs/blender
- Issues: https://github.com/vectorcraft-ai/blender-addon/issues

---

**Made with ❤️ for 3D artists who hate cleaning logos**
