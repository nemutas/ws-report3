import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { gl } from '../core/WebGL'
import * as THREE from 'three'
import { PlaneColorPass } from './PlaneColorPass'
import { BloomPass } from './BloomPass'
import { BlendScenePass } from './BlendScenePass'

class Effects {
  private composer!: EffectComposer
  private planeRenderTarget!: THREE.WebGLRenderTarget
  private planeComposer!: EffectComposer

  constructor() {
    this.init()
  }

  private init() {
    this.planeRenderTarget = new THREE.WebGLRenderTarget(gl.size.width, gl.size.height, { samples: 10 })
    this.planeComposer = new EffectComposer(gl.renderer, this.planeRenderTarget)
    this.planeComposer.renderToScreen = false
    this.planeComposer.addPass(new RenderPass(gl.scene, gl.camera))
    this.planeComposer.addPass(new PlaneColorPass())

    this.composer = new EffectComposer(gl.renderer)
    this.composer.addPass(new RenderPass(gl.scene, gl.camera))
    this.composer.addPass(new BlendScenePass(this.planeRenderTarget.texture))
    this.composer.addPass(new BloomPass())
  }

  resize() {
    const { width, height } = gl.size
    this.composer.setSize(width, height)
    this.planeComposer.setSize(width, height)
  }

  render() {
    gl.camera.layers.set(gl.PLANE_LAYER)
    this.planeComposer.render()

    gl.camera.layers.set(gl.EARTH_LAYER)
    this.composer.render()
  }

  dispose() {
    this.composer.passes.forEach((pass) => pass.dispose())
    this.planeComposer.passes.forEach((pass) => pass.dispose())
    this.planeRenderTarget.dispose()
    this.composer.dispose()
    this.planeComposer.dispose()
  }
}

export const effects = new Effects()
