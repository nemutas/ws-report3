import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertexShader from '../shader/effectVs.glsl'
import fragmentShader from '../shader/blendSceneFs.glsl'

export class BlendScenePass extends ShaderPass {
  constructor(additiveTexture: THREE.Texture) {
    const shader: THREE.Shader = {
      uniforms: {
        tDiffuse: { value: null },
        tAdd: { value: null },
      },
      vertexShader,
      fragmentShader,
    }

    super(shader)
    this.uniforms.tAdd.value = additiveTexture
  }
}
