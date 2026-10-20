/** Shared GLSL: hash, value noise, fbm and the dusk→night horizon palette. */
export const noiseGLSL = /* glsl */ `
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash12(i), b = hash12(i + vec2(1.,0.)), c = hash12(i + vec2(0.,1.)), d = hash12(i + vec2(1.,1.));
  vec2 u = f*f*(3.-2.*f);
  return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y;
}
float fbm(vec2 p){ float v = 0.; float a = .5; for(int i=0;i<5;i++){ v += a*vnoise(p); p *= 2.03; a *= .5; } return v; }
`;

export const skyPaletteGLSL = /* glsl */ `
vec3 horizonColor(float night){ return mix(vec3(1.0, 0.52, 0.26), vec3(0.32, 0.10, 0.34), night); }
vec3 midColor(float night){ return mix(vec3(0.62, 0.22, 0.48), vec3(0.09, 0.05, 0.22), night); }
vec3 zenithColor(float night){ return mix(vec3(0.12, 0.06, 0.24), vec3(0.015, 0.015, 0.05), night); }
`;
