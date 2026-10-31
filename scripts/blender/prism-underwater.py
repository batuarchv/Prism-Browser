# The glass Prism logo resting on the floor of a vast dark space, seen from straight above, lit like still deep water:
# a single soft beam from above into pure black, suspended specks and a faint haze (no surface ripples).
#   /Applications/Blender.app/Contents/MacOS/Blender -b design/prism-logo.blend -P scripts/blender/prism-underwater.py -- <out.png> [--res WxH] [--samples N] [--blend PATH] [--film]
# Without --film it writes the clean render (the film grade + looping grain video is done by film-loop.py).
import bpy, sys, math, os, random
from mathutils import Vector, Euler

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def opt(name, default=None, cast=str):
    return cast(argv[argv.index(name) + 1]) if name in argv else default
out = os.path.abspath(argv[0] if argv and not argv[0].startswith('--') else 'prism-underwater.png')
size, samples = opt('--size', 1600, int), opt('--samples', 160, int)

scene = bpy.context.scene
prism = bpy.data.objects['Prism']
for o in list(scene.objects):
    if o is not prism: bpy.data.objects.remove(o, do_unlink=True)

# The logo sits on the floor, tipped a little so one face catches more light.
prism.location = (0, 0, 0.02)
prism.rotation_euler = Euler((math.radians(9), math.radians(-6), math.radians(24)))
mix = next(n for n in prism.active_material.node_tree.nodes if n.type == 'MIX_SHADER')
mix.inputs['Fac'].default_value = 0.04   # the logo's colours glow faintly through the glass

def material(name, color, rough, bump=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1); b.inputs['Roughness'].default_value = rough
    if bump:
        noise = nt.nodes.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value = 3.5; noise.inputs['Detail'].default_value = 8
        bn = nt.nodes.new('ShaderNodeBump'); bn.inputs['Strength'].default_value = bump
        nt.links.new(noise.outputs['Fac'], bn.inputs['Height']); nt.links.new(bn.outputs['Normal'], b.inputs['Normal'])
    return m

def add(name, data, loc=(0, 0, 0)):
    o = bpy.data.objects.new(name, data); o.location = loc; scene.collection.objects.link(o); return o

# Floor: a wide, near-black blue-grey plane with a soft, sandy unevenness.
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 0, 0)); floor = bpy.context.active_object; floor.name = 'Floor'
floor.data.materials.append(material('Floor', (.025, .025, .025), .8, bump=.12))

# Still water: a faint blue haze through the whole space, so light falls off with depth and the beam reads softly.
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 4)); water = bpy.context.active_object; water.name = 'Water'
water.scale = (40, 40, 8)
wm = bpy.data.materials.new('Water'); wm.use_nodes = True; nt = wm.node_tree
nt.nodes.remove(nt.nodes['Principled BSDF'])
vol = nt.nodes.new('ShaderNodeVolumePrincipled')
vol.inputs['Color'].default_value = (.8, .9, 1.0, 1); vol.inputs['Density'].default_value = 0.004
vol.inputs['Anisotropy'].default_value = 0.55; vol.inputs['Absorption Color'].default_value = (.35, .6, .9, 1)
nt.links.new(vol.outputs['Volume'], nt.nodes['Material Output'].inputs['Volume'])
water.data.materials.append(wm)

# Suspended specks drifting in the water, a few in the beam.
random.seed(7)
speck_mesh = bpy.data.meshes.new('Speck'); import bmesh; bm = bmesh.new(); bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1); bm.to_mesh(speck_mesh); bm.free()
speck_mat = material('Speck', (.8, .9, 1), .4); speck_mesh.materials.append(speck_mat)
for i in range(90):
    r = 1.0 * math.sqrt(random.random()); a = random.random() * math.tau
    s = add('Speck', speck_mesh, (r * math.cos(a), r * math.sin(a), random.uniform(.1, 2.3)))
    s.scale = (random.uniform(.002, .006),) * 3

world = bpy.data.worlds.new('Deep'); scene.world = world; world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0, 0, 0, 1)   # nothing but black around it

def light(name, kind, loc, energy, color, **kw):
    l = bpy.data.lights.new(name, kind); l.energy = energy; l.color = color
    for k, v in kw.items(): setattr(l, k, v)
    o = add(name, l, loc); o.rotation_euler = (Vector((0, 0, 0)) - Vector(loc)).to_track_quat('-Z', 'Y').to_euler(); return o
# The only light: one soft, near-white beam from straight above with a slight cool cast, falling off into black.
# A large, soft source from above-left whose beam fades smoothly to nothing, so light wraps the glass and dies into black.
light('Softbox', 'SPOT', (-1.0, .85, 3.6), 260, (.94, .97, 1), spot_size=math.radians(62), spot_blend=1.0, shadow_soft_size=1.1)

# Straight down from above, the logo small in a lot of dark.
cd = bpy.data.cameras.new('Top'); cd.lens = 45; cd.sensor_width = 36
cd.dof.use_dof = True; cd.dof.focus_distance = 4.55; cd.dof.aperture_fstop = 2.2
cam = add('Top', cd, (0.05, -0.05, 5.2)); cam.rotation_euler = (0, 0, math.radians(-8)); scene.camera = cam

scene.render.engine = 'CYCLES'; scene.cycles.samples = samples; scene.cycles.use_denoising = True
scene.cycles.volume_step_rate = 2; scene.cycles.volume_bounces = 1
scene.render.film_transparent = False
scene.render.resolution_x, scene.render.resolution_y = (int(v) for v in opt('--res', '1920x1080').split('x')); scene.render.resolution_percentage = 100
scene.view_settings.view_transform = 'AgX'; scene.view_settings.look = 'None'; scene.view_settings.exposure = -0.3
scene.render.image_settings.file_format = 'PNG'; scene.render.image_settings.color_mode = 'RGB'
if not os.environ.get('PRISM_CPU'):
  try:
    prefs = bpy.context.preferences.addons['cycles'].preferences; prefs.compute_device_type = 'METAL'; prefs.get_devices()
    for d in prefs.devices: d.use = True
    scene.cycles.device = 'GPU'
  except Exception: pass

blend = opt('--blend')
if blend: bpy.ops.wm.save_as_mainfile(filepath=os.path.abspath(blend), relative_remap=True)
scene.render.filepath = out; bpy.ops.render.render(write_still=True)

if '--film' not in argv: print('PRISM_UNDERWATER', out); sys.exit(0)
# Finish like an old black-and-white film photograph: halation round the highlights, silver-gelatin tone with lifted
# blacks, a heavy vignette, clumpy grain, and a little dust and a couple of faint scratches.
import numpy as np
img = bpy.data.images.load(out); w, h = img.size
px = np.empty(w * h * 4, np.float32); img.pixels.foreach_get(px); px = px.reshape(h, w, 4)
rng = np.random.default_rng(3)
def blur(a, f):   # cheap wide blur: downsample, smooth, upsample
    hh, ww = a.shape[0] // f * f, a.shape[1] // f * f
    small = a[:hh, :ww].reshape(hh // f, f, ww // f, f, *a.shape[2:]).mean((1, 3))
    for _ in range(3):
        small = (np.roll(small, 1, 0) + np.roll(small, -1, 0) + np.roll(small, 1, 1) + np.roll(small, -1, 1) + small) / 5
    big = np.repeat(np.repeat(small, f, 0), f, 1); o = a.copy(); o[:hh, :ww] = big; return o
L = px[..., :3] @ np.array([.30, .59, .11], np.float32)
L = L + 0.25 * blur(np.clip(L - 0.3, 0, None), 16) + 0.15 * blur(np.clip(L - 0.15, 0, None), 4)   # halation + bloom
y, x = np.mgrid[0:h, 0:w]; r = np.hypot((x - w * .47) / (w * .5), (y - h * .52) / (h * .5))
L *= np.clip(1.12 - 0.9 * r ** 1.7, 0, 1)
L = np.clip(L, 0, 1); L = L * L * (3 - 2 * L) * .55 + L * .45   # gentle S-curve
fine = rng.normal(0, 1, (h, w)).astype(np.float32); clump = blur(rng.normal(0, 1, (h, w)).astype(np.float32), 2) * 2.2
L += (0.05 * fine + 0.03 * clump) * (0.35 + np.sqrt(np.clip(L, 0, 1)) * 0.65)
for _ in range(60):   # dust: small soft specks, mostly pale
    cx, cy, rad = rng.integers(0, w), rng.integers(0, h), rng.uniform(.6, 2.6)
    m = np.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * rad ** 2)); L += m * rng.choice([.5, .5, -.3])
for _ in range(2):    # faint vertical scratches
    sx = rng.integers(w // 6, w * 5 // 6); L += 0.06 * np.exp(-((x - sx - 3 * np.sin(y / 90)) ** 2) / 1.5) * (rng.random((h, 1)) > .3)
L = 0.025 + np.clip(L, 0, 1) * 0.94   # lifted, milky blacks
tone = np.array([1.0, .975, .93], np.float32)   # warm silver print
px[..., :3] = np.clip(L[..., None] * tone, 0, 1); img.pixels.foreach_set(px.ravel()); img.filepath_raw = out; img.file_format = 'PNG'; img.save()
print('PRISM_UNDERWATER', out)
