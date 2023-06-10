uniform sampler2D tDiffuse;
uniform sampler2D tAdd;
varying vec2 vUv;

void main() {
  vec4 tex = texture2D(tDiffuse, vUv);
  vec4 add = texture2D(tAdd, vUv);
  tex.rgb += add.rgb * smoothstep(-0.1, 0.1, tex.r);
  gl_FragColor = tex;
}