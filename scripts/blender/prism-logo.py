# The Prism logo as a real 3D glass object, modelled and rendered headlessly in Blender (Cycles).
#   /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/blender/prism-logo.py -- <out> [options]
# Options: --size N  --samples N  --dark  --turn DEG (spin about the vertical axis)  --frames N --sweep DEG (turntable
# sequence <out>-00.png …)  --webp (WebP frames)  --model PATH (write the bevelled mesh as src/glass-model.js for the
# live WebGL logo, without rendering)  --glb PATH (also export the mesh).
#
# Geometry: the Prism logo is a right square pyramid seen through a perspective camera; assets/prism-pyramid.json
# holds both (solved from the original artwork) and scripts/draw-mark.cjs draws the 2D logo from the same data, so
# the render at rest is the logo. The glass wears the logo's own face colours, projected from that pose (UVs), with
# real reflections and refraction on top. The spin axis is vertical through the centre of the base.
import bpy, sys, math, os, json
from mathutils import Vector, Matrix

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def opt(name, default=None, cast=str):
    return cast(argv[argv.index(name) + 1]) if name in argv else default
out = os.path.abspath(argv[0] if argv and not argv[0].startswith('--') else 'prism-glass.png')
size, samples, dark = opt('--size', 1024, int), opt('--samples', 192, int), '--dark' in argv
turn, frames, sweep, glb = opt('--turn', 0.0, float), opt('--frames', 0, int), opt('--sweep', 36.0, float), opt('--glb')

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CAM = json.load(open(os.path.join(ROOT, 'assets', 'prism-pyramid.json')))
R, T, FOCAL, H = Matrix(CAM['rotation']), Vector(CAM['translation']), CAM['focal'], CAM['height']
CORNERS = {'L': (-.5, .5, 0), 'F': (-.5, -.5, 0), 'R': (.5, -.5, 0), 'Q': (.5, .5, 0), 'A': (0, 0, H)}
keys = list(CORNERS)
verts = [Vector(CORNERS[k]) for k in keys]
faces = [[keys.index(k) for k in f] for f in (('L', 'Q', 'R', 'F'), ('F', 'R', 'A'), ('R', 'Q', 'A'), ('Q', 'L', 'A'), ('L', 'F', 'A'))]
def pixel(p):   # rest-pose projection onto the 1024 logo canvas (y down)
    cc = R @ Vector(p) + T
    return 512 + FOCAL * cc.x / cc.z, 512 + FOCAL * cc.y / cc.z

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
mesh = bpy.data.meshes.new('Prism')
mesh.from_pydata(verts, [], faces)
mesh.validate(); mesh.update()
# UVs: where each corner sits in the logo at rest, so every face carries the logo's colour for that face.
uv = mesh.uv_layers.new(name='Logo')
for loop in mesh.loops:
    x, y = pixel(mesh.vertices[loop.vertex_index].co); uv.data[loop.index].uv = (x / 1024, 1 - y / 1024)
obj = bpy.data.objects.new('Prism', mesh); scene.collection.objects.link(obj)
bpy.context.view_layer.objects.active = obj; obj.select_set(True)
bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.normals_make_consistent(inside=False); bpy.ops.object.mode_set(mode='OBJECT')
obj.rotation_euler = (0, 0, math.radians(turn))

bevel = obj.modifiers.new('Bevel', 'BEVEL'); bevel.width = 0.003; bevel.segments = 3; bevel.limit_method = 'ANGLE'; bevel.harden_normals = True
mat = bpy.data.materials.new('Glass'); mat.use_nodes = True
nt = mat.node_tree; bsdf = nt.nodes['Principled BSDF']
bsdf.inputs['Base Color'].default_value = (.86, .93, .97, 1)
bsdf.inputs['Transmission Weight'].default_value = 1.0
bsdf.inputs['Roughness'].default_value = 0.035
bsdf.inputs['IOR'].default_value = 1.47
if 'Dispersion' in bsdf.inputs: bsdf.inputs['Dispersion'].default_value = 0.35
# A faint blue-grey body, like the original's tint, thicker glass reads deeper.
absorb = nt.nodes.new('ShaderNodeVolumeAbsorption'); absorb.inputs['Color'].default_value = (.60, .82, .94, 1); absorb.inputs['Density'].default_value = 0.35
nt.links.new(absorb.outputs['Volume'], nt.nodes['Material Output'].inputs['Volume'])
# The logo's colours (emission, exact at rest) mixed with the glass, which adds reflections and refraction.
tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = bpy.data.images.load(os.path.join(ROOT, 'assets', 'prism-mark-flat.png')); tex.interpolation = 'Cubic'
uvn = nt.nodes.new('ShaderNodeUVMap'); uvn.uv_map = 'Logo'; nt.links.new(uvn.outputs['UV'], tex.inputs['Vector'])
emit = nt.nodes.new('ShaderNodeEmission'); nt.links.new(tex.outputs['Color'], emit.inputs['Color'])
mix = nt.nodes.new('ShaderNodeMixShader'); mix.inputs['Fac'].default_value = 0.22
nt.links.new(emit.outputs['Emission'], mix.inputs[1]); nt.links.new(bsdf.outputs['BSDF'], mix.inputs[2])
nt.links.new(mix.outputs['Shader'], nt.nodes['Material Output'].inputs['Surface'])
absorb.inputs['Density'].default_value = 0.0
obj.data.materials.append(mat)

# Studio: a soft procedural sky (pale above, blue-grey below) so the glass refracts the original's tones, plus soft
# boxes that give each facet its own brightness and bright edge highlights.
world = bpy.data.worlds.new('World'); scene.world = world; world.use_nodes = True
wn, wl = world.node_tree.nodes, world.node_tree.links
coord = wn.new('ShaderNodeTexCoord'); sep = wn.new('ShaderNodeSeparateXYZ'); ramp = wn.new('ShaderNodeValToRGB')
wl.new(coord.outputs['Generated'], sep.inputs[0]); wl.new(sep.outputs['Z'], ramp.inputs['Fac'])
SKY = [(0.0, (.36, .50, .60) if dark else (.62, .76, .85)), (.47, (.60, .76, .86) if dark else (.76, .88, .95)), (.53, (.88, .95, 1.0)), (1.0, (.97, .99, 1.0))]
ramp.color_ramp.elements[0].position, ramp.color_ramp.elements[1].position = SKY[0][0], SKY[-1][0]
ramp.color_ramp.elements[0].color, ramp.color_ramp.elements[1].color = (*SKY[0][1], 1), (*SKY[-1][1], 1)
for pos, col in SKY[1:-1]: ramp.color_ramp.elements.new(pos).color = (*col, 1)
wl.new(ramp.outputs['Color'], wn['Background'].inputs['Color'])
wn['Background'].inputs['Strength'].default_value = 0.85 if dark else 1.0
def area(name, loc, energy, size, color=(1, 1, 1)):
    light = bpy.data.lights.new(name, 'AREA'); light.energy = energy; light.size = size; light.color = color
    o = bpy.data.objects.new(name, light); o.location = loc; scene.collection.objects.link(o)
    o.rotation_euler = (Vector((0, .7, 1)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler()
area('Key', (-2.4, -2.6, 3.4), 420 if dark else 520, 2.6)
area('Fill', (2.8, -1.8, 1.2), 160, 2.0, (.86, .93, 1))
area('Rim', (1.2, 3.6, 2.6), 380, 1.6, (.9, .96, 1))
area('Top', (0, .6, 4.2), 260, 3.0)

# The logo's perspective camera: OpenCV-style pose (x right, y down, z forward) to Blender (y up, looking down −z).
cam_data = bpy.data.cameras.new('Camera'); cam_data.type = 'PERSP'; cam_data.sensor_fit = 'HORIZONTAL'; cam_data.sensor_width = 36
cam_data.lens = FOCAL / 1024 * 36; cam_data.clip_start = .1; cam_data.clip_end = 100
cam = bpy.data.objects.new('Camera', cam_data); scene.collection.objects.link(cam); scene.camera = cam
cam.matrix_world = Matrix.Translation(-(R.transposed() @ T)) @ (R.transposed() @ Matrix.Diagonal((1, -1, -1))).to_4x4()

scene.render.engine = 'CYCLES'; scene.cycles.samples = samples; scene.cycles.use_denoising = True
scene.cycles.max_bounces = 24; scene.cycles.transmission_bounces = 24; scene.cycles.caustics_refractive = True
scene.render.film_transparent = True; scene.cycles.film_transparent_glass = False
scene.render.resolution_x = scene.render.resolution_y = size; scene.render.resolution_percentage = 100
scene.view_settings.view_transform = 'Standard'; scene.view_settings.look = 'None'   # the logo's colours, unchanged
scene.view_settings.exposure = -.1 if dark else 0
scene.render.image_settings.file_format = 'WEBP' if '--webp' in argv else 'PNG'; scene.render.image_settings.color_mode = 'RGBA'
if '--webp' in argv: scene.render.image_settings.quality = 88
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'METAL'; prefs.get_devices()
    for d in prefs.devices: d.use = True
    scene.cycles.device = 'GPU'
except Exception: pass

model = opt('--model')
if model:
    # The live logo (src/glass-logo.js) draws this exact mesh: bevelled, triangulated, with Blender's corner normals and
    # the logo UVs, in the pyramid's own axes (z up), with the camera that draws the logo.
    obj.rotation_euler.z = 0; dg = bpy.context.evaluated_depsgraph_get(); eo = obj.evaluated_get(dg); me = eo.to_mesh(); me.calc_loop_triangles()
    pos, nor, uvs = [], [], []; layer = me.uv_layers['Logo'].data
    for tri in me.loop_triangles:
        for li in tri.loops:
            co = me.vertices[me.loops[li].vertex_index].co; n = me.corner_normals[li].vector
            pos += [co.x, co.y, co.z]; nor += [n.x, n.y, n.z]; uvs += [layer[li].uv[0], 1 - layer[li].uv[1]]
    fmt = lambda a: ','.join('%.4f' % x for x in a)
    with open(os.path.abspath(model), 'w') as f:
        f.write('// Generated by scripts/blender/prism-logo.py --model: the Blender glass logo mesh for src/glass-logo.js.\n')
        f.write('globalThis.PrismGlassModel={camera:%s,\npositions:[%s],\nnormals:[%s],\nuvs:[%s]};\n' % (json.dumps({'rotation': CAM['rotation'], 'translation': CAM['translation'], 'focal': FOCAL, 'height': H}), fmt(pos), fmt(nor), fmt(uvs)))
    print('PRISM_MODEL', model, len(pos) // 9, 'triangles'); sys.exit(0)
if glb:
    bpy.ops.export_scene.gltf(filepath=os.path.abspath(glb), use_selection=True, export_apply=True)
if frames:
    base, ext = os.path.splitext(out); ext = '.webp' if '--webp' in argv else '.png'
    for i in range(frames):
        obj.rotation_euler.z = math.radians(-sweep / 2 + sweep * i / max(1, frames - 1))
        scene.render.filepath = f'{base}-{i:02d}{ext}'; bpy.ops.render.render(write_still=True)
else:
    scene.render.filepath = out; bpy.ops.render.render(write_still=True)
print('PRISM_LOGO', out)
