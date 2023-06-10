import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { gl } from '../core/WebGL'
import { gui } from '../utils/Gui'

export class BloomPass extends UnrealBloomPass {
  constructor(needsSwap = true) {
    super(new THREE.Vector2(gl.size.width, gl.size.height), 1.8, 0.75, 0.13)
    this.needsSwap = needsSwap
    // this.setControls()
  }

  private setControls() {
    const folder = gui.addFolder('unreal bloom')
    folder.add(this, 'enabled')
    folder.add(this, 'threshold', 0, 1, 0.01)
    folder.add(this, 'strength', 1, 2, 0.01)
    folder.add(this, 'radius', 0, 1, 0.01)
    folder.add(this, 'threshold', 0, 1, 0.01)
  }
}
