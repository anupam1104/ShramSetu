const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIZE = 256;

// ---- Minimal PNG encoder ----
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  // Raw data: each row prefixed by filter byte 0
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// ---- Draw the icon ----
const px = Buffer.alloc(SIZE * SIZE * 4);

function lerp(a, b, t) { return a + (b - a) * t; }

function fillRoundedRect(cx, cy, half, radius, color) {
  for (let y = cy - half; y <= cy + half; y++) {
    for (let x = cx - half; x <= cx + half; x++) {
      let inside = true;
      // corner rounding via nearest corner center
      const nx = x < cx - half + radius ? cx - half + radius : x > cx + half - radius ? cx + half - radius : x;
      const ny = y < cy - half + radius ? cy - half + radius : y > cy + half - radius ? cy + half - radius : y;
      if ((x - nx) * (x - nx) + (y - ny) * (y - ny) > radius * radius) inside = false;
      if (inside && x >= 0 && x < SIZE && y >= 0 && y < SIZE) {
        const i = (y * SIZE + x) * 4;
        px[i] = color[0]; px[i + 1] = color[1]; px[i + 2] = color[2]; px[i + 3] = 255;
      }
    }
  }
}

function fillPoly(points, color) {
  const ys = points.map(p => p[1]);
  const minY = Math.max(0, Math.floor(Math.min(...ys)));
  const maxY = Math.min(SIZE - 1, Math.ceil(Math.max(...ys)));
  for (let y = minY; y <= maxY; y++) {
    const xs = [];
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      if ((p1[1] <= y && p2[1] > y) || (p2[1] <= y && p1[1] > y)) {
        const t = (y - p1[1]) / (p2[1] - p1[1]);
        xs.push(p1[0] + t * (p2[0] - p1[0]));
      }
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const x0 = Math.max(0, Math.floor(xs[i]));
      const x1 = Math.min(SIZE - 1, Math.ceil(xs[i + 1]));
      for (let x = x0; x <= x1; x++) {
        const idx = (y * SIZE + x) * 4;
        px[idx] = color[0]; px[idx + 1] = color[1]; px[idx + 2] = color[2]; px[idx + 3] = 255;
      }
    }
  }
}

// Emerald gradient rounded square
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const t = (x + y) / (2 * SIZE);
    px[(y * SIZE + x) * 4] = lerp(16, 6, t);       // emerald-700 -> emerald-900
    px[(y * SIZE + x) * 4 + 1] = lerp(160, 95, t + 0.15);
    px[(y * SIZE + x) * 4 + 2] = lerp(100, 50, t);
    px[(y * SIZE + x) * 4 + 3] = 255;
  }
}

// Transparent outside the rounded square (recompute border)
const half = 118, radius = 52, ccx = 128, ccy = 128;
for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const nx = x < ccx - half + radius ? ccx - half + radius : x > ccx + half - radius ? ccx + half - radius : x;
    const ny = y < ccy - half + radius ? ccy - half + radius : y > ccy + half - radius ? ccy + half - radius : y;
    if ((x - nx) * (x - nx) + (y - ny) * (y - ny) > radius * radius) {
      const i = (y * SIZE + x) * 4;
      px[i + 3] = 0;
    }
  }
}

// White shield
const shield = [
  [128, 52],
  [174, 72],
  [172, 128],
  [160, 176],
  [128, 206],
  [96, 176],
  [84, 128],
  [82, 72]
];
fillPoly(shield, [255, 255, 255]);

// Emerald wrench-cut inside the shield (simplified: a notch)
fillPoly([
  [128, 104],
  [146, 112],
  [144, 132],
  [128, 136],
  [112, 132],
  [110, 112]
], [16, 160, 100]);

const outDir = path.join(__dirname, '..', 'build-resources');
fs.mkdirSync(outDir, { recursive: true });

const png = encodePng(SIZE, SIZE, px);
fs.writeFileSync(path.join(outDir, 'icon.png'), png);

// ---- Wrap PNG into an ICO (256x256) ----
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry[0] = 0;   // width 256
entry[1] = 0;   // height 256
entry[2] = 0;
entry[3] = 0;
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(png.length, 8);
entry.writeUInt32LE(22, 12);
fs.writeFileSync(path.join(outDir, 'icon.ico'), Buffer.concat([header, entry, png]));

console.log('Generated build-resources/icon.png and build-resources/icon.ico');