import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Procedural coffee bean: a flattened ellipsoid with an S-shaped crease on
 * the flat side. Shared by background beans, orbit beans and process models.
 */
export function createBeanGeometry(detail = 24) {
  let g: THREE.BufferGeometry = new THREE.SphereGeometry(1, detail, Math.round(detail * 0.75));
  g.deleteAttribute('normal');
  g.deleteAttribute('uv');
  g = mergeVertices(g);

  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    if (v.z > 0) {
      v.z *= 0.55; // flat side
      const sx = v.x - 0.09 * Math.sin(v.y * 3.2); // S-curve
      v.z -= 0.32 * Math.exp(-(sx * sx) / 0.006) * v.z * 1.6; // crease
    }
    v.set(v.x * 0.72, v.y, v.z * 0.62);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

/** Soft radial sprite texture (steam / glow) generated on a canvas. */
export function createSoftTexture(size = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.45)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Coffee surface with crema ring + latte-art heart. */
export function createCremaTexture(size = 512) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const r = size / 2;
  const g = ctx.createRadialGradient(r, r, 0, r, r, r);
  g.addColorStop(0, '#5a3420');
  g.addColorStop(0.6, '#6e4027');
  g.addColorStop(0.86, '#a8703f');
  g.addColorStop(0.97, '#c68b59');
  g.addColorStop(1, '#8a5530');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  // latte-art heart
  ctx.save();
  ctx.translate(r, r * 1.02);
  ctx.filter = 'blur(3px)';
  ctx.fillStyle = 'rgba(239,224,200,0.92)';
  const s = size * 0.0024;
  ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 60);
  ctx.bezierCurveTo(-120, -20, -70, -110, 0, -50);
  ctx.bezierCurveTo(70, -110, 120, -20, 0, 60);
  ctx.fill();
  ctx.fillStyle = 'rgba(110,64,39,0.85)';
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.bezierCurveTo(-60, -5, -35, -60, 0, -28);
  ctx.bezierCurveTo(35, -60, 60, -5, 0, 40);
  ctx.fill();
  ctx.fillStyle = 'rgba(239,224,200,0.92)';
  ctx.beginPath();
  ctx.moveTo(0, 22);
  ctx.bezierCurveTo(-28, 0, -16, -30, 0, -14);
  ctx.bezierCurveTo(16, -30, 28, 0, 0, 22);
  ctx.fill();
  ctx.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}
