const HEIGHT_VERTEX = /* glsl */ `
uniform float uFloor;
uniform float uHeight;
varying float vHeight;
`;

export const HOLOGRAM_GLSL = {
  fillVertex: /* glsl */ `
${HEIGHT_VERTEX}
varying vec3 vNormal;
varying vec3 vView;

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vHeight = (world.y - uFloor) / uHeight;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,
  fillFragment: /* glsl */ `
uniform vec3 uFill;
uniform vec3 uLight;
uniform vec3 uAccent;
uniform vec3 uRim;
uniform float uReveal;
uniform float uScan;
uniform float uRimStrength;
uniform float uScanWidth;
uniform float uScanStrength;
uniform float uScanline;
varying float vHeight;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  if (vHeight > uReveal) discard;

  vec3 n = normalize(vNormal);
  n = gl_FrontFacing ? n : -n;

  float key = clamp(dot(n, normalize(vec3(0.45, 0.85, 0.3))), 0.0, 1.0);
  vec3 color = mix(uFill, uLight, key * 0.85);
  float fresnel = pow(1.0 - clamp(abs(dot(n, normalize(vView))), 0.0, 1.0), 3.0);
  color += uRim * fresnel * uRimStrength;

  float scan = 1.0 - smoothstep(0.0, uScanWidth, abs(vHeight - uScan));
  color = mix(color, uAccent, scan * uScanStrength * 0.35);

  float front = (1.0 - smoothstep(0.0, 0.025, uReveal - vHeight)) * step(uReveal, 0.999);
  color = mix(color, uAccent, front);

  color *= 1.0 - uScanline * step(2.0, mod(gl_FragCoord.y, 3.0));
  gl_FragColor = vec4(color, 1.0);

  #include <colorspace_fragment>
}
`,
  edgeVertex: /* glsl */ `
${HEIGHT_VERTEX}

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vHeight = (world.y - uFloor) / uHeight;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,
  edgeFragment: /* glsl */ `
uniform vec3 uEdge;
uniform vec3 uAccent;
uniform float uReveal;
uniform float uScan;
uniform float uScanWidth;
uniform float uAlpha;
varying float vHeight;

void main() {
  if (vHeight > uReveal) discard;

  float scan = 1.0 - smoothstep(0.0, uScanWidth, abs(vHeight - uScan));
  gl_FragColor = vec4(mix(uEdge, uAccent, scan), mix(uAlpha, 1.0, scan));

  #include <colorspace_fragment>
}
`,
  shadowVertex: /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
  shadowFragment: /* glsl */ `
uniform float uAlpha;
varying vec2 vUv;

void main() {
  float distance = length(vUv - 0.5) * 2.0;
  gl_FragColor = vec4(0.0, 0.0, 0.0, (1.0 - smoothstep(0.15, 1.0, distance)) * uAlpha);
}
`
} as const;
