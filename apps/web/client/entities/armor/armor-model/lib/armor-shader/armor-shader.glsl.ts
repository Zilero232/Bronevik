export const ARMOR_SHADER = {
  vertex: `
attribute float aThickness;
attribute float aFlags;

varying float vThickness;
varying float vFlags;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);

  vWorldPosition = world.xyz;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vThickness = aThickness;
  vFlags = aFlags;

  gl_Position = projectionMatrix * viewMatrix * world;
}
`,
  fragment: `
uniform float uPenetration;
uniform float uCaliber;
uniform float uNormalization;
uniform float uRicochet;
uniform float uRandomness;
uniform float uCaliberRules;
uniform float uHighExplosive;
uniform float uTwoCaliberRatio;
uniform float uTwoCaliberFactor;
uniform float uOvermatchRatio;
uniform float uAmbient;
uniform float uDiffuse;
uniform float uHideSpaced;
uniform float uHeatmap;
uniform float uSigmaShare;
uniform float uErf[6];
uniform vec3 uPen;
uniform vec3 uChance;
uniform vec3 uNoPen;
uniform vec3 uRicochetColor;
uniform vec3 uSpaced;
uniform vec3 uModule;
uniform vec3 uHollow;

varying float vThickness;
varying float vFlags;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

bool hasFlag(float flags, float bit) {
  return mod(floor(flags / bit + 0.001), 2.0) > 0.5;
}

float erfApprox(float x) {
  float a = abs(x);
  float t = 1.0 / (1.0 + uErf[0] * a);
  float y = 1.0 - ((((uErf[5] * t + uErf[4]) * t + uErf[3]) * t + uErf[2]) * t + uErf[1]) * t * exp(-a * a);

  return x < 0.0 ? -y : y;
}

float normalCdf(float z) {
  return 0.5 * (1.0 + erfApprox(z * 0.70710678));
}

float penChance(float effective) {
  if (effective <= 0.0) {
    return 1.0;
  }

  if (uPenetration <= 0.0) {
    return 0.0;
  }

  float needed = effective / uPenetration - 1.0;

  if (needed <= -uRandomness) {
    return 1.0;
  }

  if (needed > uRandomness) {
    return 0.0;
  }

  float sigma = uRandomness * uSigmaShare;
  float low = normalCdf(-uRandomness / sigma);
  float high = normalCdf(uRandomness / sigma);

  return clamp((high - normalCdf(needed / sigma)) / (high - low), 0.0, 1.0);
}

vec3 heat(float chance) {
  return chance < 0.5 ? mix(uNoPen, uChance, chance * 2.0) : mix(uChance, uPen, (chance - 0.5) * 2.0);
}

vec3 band(float effective) {
  if (uHeatmap > 0.5) {
    return heat(penChance(effective));
  }

  if (uPenetration * (1.0 - uRandomness) >= effective) {
    return uPen;
  }

  return uPenetration * (1.0 + uRandomness) < effective ? uNoPen : uChance;
}

void main() {
  vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
  float cosine = clamp(abs(dot(normalize(vWorldNormal), viewDirection)), 0.0, 1.0);
  float angle = degrees(acos(cosine));
  vec3 color;

  if (uHideSpaced > 0.5 && hasFlag(vFlags, 1.0)) {
    discard;
  }

  if (hasFlag(vFlags, 8.0)) {
    color = uModule;
  } else if (vThickness <= 0.0 || hasFlag(vFlags, 16.0)) {
    color = uHollow;
  } else if (hasFlag(vFlags, 1.0) || hasFlag(vFlags, 2.0)) {
    color = uSpaced;
  } else if (uHighExplosive > 0.5) {
    color = band(vThickness);
  } else {
    bool overmatch = uCaliberRules > 0.5 && uCaliber > uOvermatchRatio * vThickness;
    bool twoCaliber = uCaliberRules > 0.5 && uCaliber > uTwoCaliberRatio * vThickness;
    float normalization = uNormalization * (twoCaliber ? uTwoCaliberFactor * uCaliber / (2.0 * vThickness) : 1.0);
    float normalized = max(0.0, angle - normalization);
    float effective = vThickness / max(cos(radians(normalized)), 0.0001);

    color = (!overmatch && angle >= uRicochet) ? uRicochetColor : band(effective);
  }

  gl_FragColor = vec4(color * (uAmbient + uDiffuse * cosine), 1.0);
}
`
} as const;
