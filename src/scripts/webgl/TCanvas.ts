import * as THREE from 'three'
import { gl } from './core/WebGL'
import { controls } from './utils/OrbitControls'
import { Assets, loadAssets } from './utils/assetLoader'
import { effects } from './effects/Effects'
import { gui } from './utils/Gui'

export class TCanvas {
  private raycaster = new THREE.Raycaster()
  private prevPlaneDirection = new THREE.Vector3(0, 1, 0).normalize()
  private debug = false

  private assets: Assets = {
    earth: { path: 'images/earth.png' },
    plane: { path: 'images/plane.jpg' },
  }

  constructor(private container: HTMLElement) {
    loadAssets(this.assets).then(() => {
      this.init()
      this.createLights()
      this.createObjects()
      this.setControls()
      gl.requestAnimationFrame(this.anime)
    })
  }

  private init() {
    gl.setup(this.container)
    gl.scene.background = new THREE.Color('#000')
    gl.camera.position.z = 5

    controls.primitive.enablePan = false
    controls.primitive.enableZoom = false
  }

  private createLights() {
    const ambientLight = new THREE.AmbientLight('#a70', 0.01)
    ambientLight.layers.set(gl.EARTH_LAYER)
    gl.scene.add(ambientLight)

    const pointLight = new THREE.PointLight()
    pointLight.color.set('#522009')
    pointLight.intensity = 8
    pointLight.castShadow = true
    pointLight.shadow.mapSize.set(2048, 2048)
    pointLight.distance = 13
    pointLight.layers.set(gl.EARTH_LAYER)
    gl.scene.add(pointLight)

    const pointLight2 = pointLight.clone()
    pointLight2.color.set('#fff')
    pointLight2.distance = 100
    pointLight2.layers.set(gl.PLANE_LAYER)
    gl.scene.add(pointLight2)
  }

  private createObjects() {
    this.createEarth()
    this.createPlane()
    this.createProjectionBox()
  }

  private createEarth() {
    const geometry = new THREE.SphereGeometry(1, 64, 32)
    const material = new THREE.MeshBasicMaterial({
      color: '#111',
      alphaMap: this.assets.earth.data as THREE.Texture,
      alphaTest: 0.5,
      side: THREE.DoubleSide,
      opacity: 0,
      transparent: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.rotation.y = Math.PI * (3 / 2)
    mesh.layers.set(gl.EARTH_LAYER)
    mesh.name = 'earth'
    gl.scene.add(mesh)
  }

  private createPlane() {
    const geometry = new THREE.BoxGeometry(1, 1, 0.001)
    const material = new THREE.MeshBasicMaterial({
      alphaMap: this.assets.plane.data as THREE.Texture,
      alphaTest: 0.5,
      opacity: 0,
      transparent: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.scale.multiplyScalar(0.15)
    mesh.castShadow = true
    mesh.position.y = -0.015
    mesh.layers.set(gl.PLANE_LAYER)
    mesh.userData.orbitRadius = 1.1
    mesh.name = 'plane'
    gl.scene.add(mesh)
  }

  private createProjectionBox() {
    const geometry = new THREE.BoxGeometry(16, 16, 16)
    const material = new THREE.MeshStandardMaterial({ side: THREE.BackSide })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.receiveShadow = true
    mesh.layers.set(gl.EARTH_LAYER)
    gl.scene.add(mesh)

    const mesh2 = mesh.clone()
    mesh2.layers.set(gl.PLANE_LAYER)
    gl.scene.add(mesh2)
  }

  private intersection() {
    const origin = gl.camera.position.clone().multiplyScalar(-1)
    const direction = gl.camera.position.clone().normalize()
    this.raycaster.set(origin, direction)

    const intersects = this.raycaster.intersectObject(gl.getMesh('earth'), false)

    if (0 < intersects.length) {
      const plane = gl.getMesh('plane')
      const subVec = new THREE.Vector3().subVectors(intersects[0].point, plane.position)

      if (intersects[0].point.normalize().sub(plane.position.clone().normalize()).length() < 0.01) return

      const orgPos = plane.position.clone()
      plane.position.add(subVec.multiplyScalar(0.03)).normalize().multiplyScalar(plane.userData.orbitRadius)
      const planeDirection = plane.position.clone().sub(orgPos).normalize()

      const cos = this.prevPlaneDirection.dot(planeDirection)
      const angle = Math.acos(cos)
      const rotateAxis = this.prevPlaneDirection.cross(planeDirection).normalize()
      const q = new THREE.Quaternion().setFromAxisAngle(rotateAxis, angle)
      plane.quaternion.premultiply(q)

      this.prevPlaneDirection.copy(planeDirection).normalize()
    }
  }

  private setControls() {
    gui.add(this, 'debug').onChange((v: boolean) => {
      const earth = gl.getMesh<THREE.MeshBasicMaterial>('earth')
      const plane = gl.getMesh<THREE.MeshBasicMaterial>('plane')
      if (v) {
        earth.material.opacity = 1
        plane.material.opacity = 1
        plane.layers.set(gl.EARTH_LAYER)
      } else {
        earth.material.opacity = 0
        plane.material.opacity = 0
        plane.layers.set(gl.PLANE_LAYER)
      }
    })
  }

  // ----------------------------------
  // animation
  private anime = () => {
    controls.update()
    this.intersection()

    gl.getMesh('earth').rotation.y -= gl.time.delta * 0.05

    if (this.debug) {
      gl.render()
    } else {
      effects.render()
    }
  }

  // ----------------------------------
  // dispose
  dispose() {
    gl.dispose()
  }
}
