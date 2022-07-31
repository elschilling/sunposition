import { loadHouse } from './components/house/house.js'
import { loadBirds } from './components/birds/birds.js'
import { createCamera } from './components/camera.js'
import { createBase } from './components/base.js'
import { createLights } from './components/lights.js'
import { createScene } from './components/scene.js'
import { createDirectionalLightHelper, createShadowCameraHelper } from './components/helpers.js'
import { createSunSphere } from './components/sunSphere.js'

import { createGUI } from './systems/gui.js'
import { createControls } from './systems/controls.js'
import { createRenderer } from './systems/renderer.js'
import { Resizer } from './systems/Resizer.js'
import { Loop } from './systems/Loop.js'
import { SunPath } from './systems/SunPath.js'
import { DynamicSky } from './systems/DynamicSky.js'

import gsap from 'gsap'

const params = {
  animateTime: false,
  minute: new Date().getMinutes(),
  hour: new Date().getHours(),
  day: new Date().getDate(),
  month: new Date().getMonth(),
  latitude: -22.863933,
  longitude: -47.012181,
  northOffset: 303,
  radius: 32,
  shadowBias: -0.00086
}

const skyControl = {
  turbidity: 10,
  rayleigh: 0.425,
  mieCoefficient: 0.012,
  mieDirectionalG: 1,
  exposure: 6.99
}

let tl = gsap.timeline({ repeta: -1 })


// These variables are module-scoped: we cannot access them
// from outside the module
let camera
let renderer
let scene
let loop
let controls

class World {
  constructor(container) {
    camera = createCamera()
    scene = createScene()
    renderer = createRenderer()
    loop = new Loop(camera, scene, renderer)
    container.append(renderer.domElement)
    controls = createControls(camera, renderer.domElement)

    const { ambientLight, sunLight } = createLights()
    sunLight.shadow.camera.top = params.radius
    sunLight.shadow.camera.bottom = - params.radius
    sunLight.shadow.camera.left = - params.radius
    sunLight.shadow.camera.right = params.radius
    sunLight.shadow.bias = params.shadowBias

    const sunSphere = createSunSphere()
    
    const base = createBase(params.radius)
    const sunPath = new SunPath(params, sunSphere, sunLight, base)

    const sky = new DynamicSky(skyControl, sunPath.sphereLight, renderer)
        
    const sunHelper = createDirectionalLightHelper(sunLight)
    const sunShadowHelper = createShadowCameraHelper(sunLight)
    sunShadowHelper.visible = false
    
    loop.updatables.push(base, controls, sunPath, sky)
    
    scene.add(sky.sky, ambientLight, sunHelper, sunShadowHelper, sunPath.sunPathLight )

    this.gui = createGUI(params, ambientLight, sunLight, sunHelper, sunShadowHelper, sunPath, controls, skyControl)
    const resizer = new Resizer(container, camera, renderer)
  }

  async init() {
    const { house, cobertura, pavSuperior, pavTerreo } = await loadHouse()
    const birds = await loadBirds()
    for (var b = 0; b < birds.children.length; b++) {
      loop.updatables.push(birds.children[b])
    }
    scene.add(house, birds)
    tl.to(birds.position, { duration: 60, delay: 1, x: 100, z: 120 })

    const houseFolder = this.gui.addFolder('Maquete')
    houseFolder.add(cobertura, 'visible').name('Cobertura')
    houseFolder.add(pavSuperior, 'visible').name('Pav. Superior')
    houseFolder.add(pavTerreo, 'visible').name('Pav. Térreo')
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera)
  }

  start() {
    loop.start()
  }
  
  stop() {
    loop.stop()
  }
}

export { World }
