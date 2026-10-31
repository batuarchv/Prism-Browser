# Turns a clean render into a seamless looping video with a light old-film grade and live, sizzling grain.
#   python3 scripts/blender/film-loop.py design/renders/prism-underwater.png design/renders/prism-underwater-loop.mp4 [--strength 0.1] [--seconds 4] [--fps 24]
# The grade (halation, silver tone, S-curve, lifted blacks, vignette) is mixed in at --strength; grain, dust and the odd
# scratch are drawn fresh every frame, so the loop has no seam.
import sys, subprocess, numpy as np
args = sys.argv[1:]
def opt(name, default, cast=float):
    return cast(args[args.index(name) + 1]) if name in args else default
src, dst = args[0], args[1]
strength, seconds, fps = opt('--strength', 0.1), opt('--seconds', 4), opt('--fps', 24, int)
grain_amt = opt('--grain', 0.022)

def read_png(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'rawvideo', '-pix_fmt', 'rgb48le', '-'], capture_output=True, check=True).stdout
    w, h = map(int, subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', path], capture_output=True, text=True, check=True).stdout.strip().split(','))
    return np.frombuffer(raw, np.uint16).reshape(h, w, 3).astype(np.float32) / 65535

def blur(a, f):
    hh, ww = a.shape[0] // f * f, a.shape[1] // f * f
    small = a[:hh, :ww].reshape(hh // f, f, ww // f, f, *a.shape[2:]).mean((1, 3))
    for _ in range(3):
        small = (np.roll(small, 1, 0) + np.roll(small, -1, 0) + np.roll(small, 1, 1) + np.roll(small, -1, 1) + small) / 5
    big = np.repeat(np.repeat(small, f, 0), f, 1); o = a.copy(); o[:hh, :ww] = big; return o

img = read_png(src); h, w, _ = img.shape
y, x = np.mgrid[0:h, 0:w].astype(np.float32)
# The full-strength grade, then mixed into the clean render.
L = img @ np.array([.30, .59, .11], np.float32)
L = L + 0.25 * blur(np.clip(L - 0.3, 0, None), 16) + 0.15 * blur(np.clip(L - 0.15, 0, None), 4)
r = np.hypot((x - w * .5) / (w * .5), (y - h * .5) / (h * .5))
L *= np.clip(1.12 - 0.9 * r ** 1.7, 0, 1)
L = np.clip(L, 0, 1); L = L * L * (3 - 2 * L) * .55 + L * .45
L = 0.025 + L * 0.94
graded = L[..., None] * np.array([1.0, .975, .93], np.float32)
base = img * (1 - strength) + graded * strength
luma = np.clip(base @ np.array([.30, .59, .11], np.float32), 0, 1)
grain_weight = (0.35 + np.sqrt(luma) * 0.65)[..., None]

rng = np.random.default_rng(11)
n = int(round(seconds * fps))
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{w}x{h}', '-r', str(fps), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-tune', 'grain', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', dst], stdin=subprocess.PIPE)
for i in range(n):
    fine = rng.normal(0, 1, (h, w)).astype(np.float32)
    clump = blur(rng.normal(0, 1, (h, w)).astype(np.float32), 2) * 2.2
    g = (0.7 * fine + 0.45 * clump)[..., None] * grain_amt * grain_weight
    f = base * (1 + rng.normal(0, 0.006)) + g          # grain + a faint exposure flicker
    for _ in range(rng.integers(0, 4)):                # a few specks of dust, different every frame
        cx, cy, rad = rng.integers(0, w), rng.integers(0, h), rng.uniform(.6, 2.2)
        x0, x1, y0, y1 = max(cx - 8, 0), min(cx + 9, w), max(cy - 8, 0), min(cy + 9, h)
        m = np.exp(-((x[y0:y1, x0:x1] - cx) ** 2 + (y[y0:y1, x0:x1] - cy) ** 2) / (2 * rad ** 2))
        f[y0:y1, x0:x1] += (m * rng.choice([.25, -.15]) * strength * 3)[..., None]
    if rng.random() < .12:                             # the odd faint scratch
        sx = rng.integers(w // 6, w * 5 // 6); f += (0.03 * np.exp(-((x - sx) ** 2) / 1.2))[..., None]
    enc.stdin.write((np.clip(f, 0, 1) * 255 + rng.random((h, w, 1)) * .999).astype(np.uint8).tobytes())
enc.stdin.close(); enc.wait()
print('FILM_LOOP', dst, n, 'frames')
