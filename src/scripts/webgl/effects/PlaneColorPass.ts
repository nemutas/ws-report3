import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertexShader from '../shader/effectVs.glsl'
import fragmentShader from '../shader/planeColorFs.glsl'
import * as THREE from 'three'
import { gui } from '../utils/Gui'

export class PlaneColorPass extends ShaderPass {
  constructor() {
    const shader: THREE.Shader = {
      uniforms: {
        tDiffuse: { value: null },
        uColor: { value: new THREE.Color('#e1ab37') },
      },
      vertexShader,
      fragmentShader,
    }

    super(shader)
    this.needsSwap = false
    this.setControls()
  }

  private setControls() {
    const folder = gui.addFolder('plane')
    folder.addColor(this.uniforms.uColor, 'value').name('color')
  }
}
