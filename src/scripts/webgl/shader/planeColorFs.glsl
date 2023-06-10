uniform sampler2D tDiffuse;
uniform vec3 uColor;
varying vec2 vUv;

void main() {
  vec4 tex = texture2D(tDiffuse, vUv);
  tex.rgb = 1.0 - vec3(step(0.5, tex.r));
  tex.rgb *= uColor;
  gl_FragColor = tex;
}