import { loadHouse } from './components/house/house.js'
import { loadBirds } from './components/birds/birds.js'
import { createBirdCamera } from './components/birdCamera.js'
import { createFirstPersonCamera } from './components/firstPersonCamera.js'
import { createBase } from './components/base.js'
import { createLights } from './components/lights.js'
import { createScene } from './components/scene.js'
import { createDirectionalLightHelper, createShadowCameraHelper, createAxesHelper } from './components/helpers.js'
import { createSunSphere } from './components/sunSphere.js'

import { createGUI } from './systems/gui.js'
import { createControls } from './systems/controls.js'
import { createRenderer } from './systems/renderer.js'
import { Resizer } from './systems/Resizer.js'
import { Loop } from './systems/Loop.js'
import { SunPath } from './systems/SunPath.js'
import { DynamicSky } from './systems/DynamicSky.js'
import { createPlayer } from './systems/player.js'

import gsap from 'gsap'

const params = {
  animateTime: true,
  showSunSurface: true,
  showAnalemmas: true,
  showSunDayPath: true,
  minute: new Date().getMinutes(),
  hour: new Date().getHours(),
  day: new Date().getDate(),
  month: new Date().getMonth() + 1,
  latitude: -23.029396,
  longitude: -46.974293,
  northOffset: 303,
  radius: 18,
  baseY: 0,
  timeSpeed: 100,
  shadowBias: -0.00086
}

const skyControl = {
  turbidity: 10,
  rayleigh: 0.425,
  mieCoefficient: 0.012,
  mieDirectionalG: 1,
  exposure: 6.99
}

const cameraControl = {
  firstPerson() {
    activeCamera = firstPersonCamera
    loop.camera = firstPersonCamera
    resizer.camera = firstPersonCamera
    resizer.onResize()
  },
  birdView() {
    activeCamera = birdCamera
    loop.camera = birdCamera
    resizer.camera = birdCamera
    resizer.onResize()
  }
}

let tl = gsap.timeline({ repeta: -1 })

let activeCamera, birdCamera, firstPersonCamera
let renderer
let scene
let loop
let controls
let resizer

class World {
  constructor(container) {
    birdCamera = createBirdCamera()
    firstPersonCamera = createFirstPersonCamera()
    activeCamera = birdCamera

    scene = createScene()
    renderer = createRenderer()
    loop = new Loop(activeCamera, scene, renderer)
    container.append(renderer.domElement)
    controls = createControls(activeCamera, renderer.domElement)

    const { ambientLight, sunLight } = createLights()
    sunLight.shadow.camera.top = params.radius
    sunLight.shadow.camera.bottom = - params.radius
    sunLight.shadow.camera.left = - params.radius
    sunLight.shadow.camera.right = params.radius
    sunLight.shadow.bias = params.shadowBias

    const sunSphere = createSunSphere()
    
    const base = createBase(params)
    const sunPath = new SunPath(params, sunSphere, sunLight, base)

    const sky = new DynamicSky(skyControl, sunPath.sphereLight, renderer)
        
    const sunHelper = createDirectionalLightHelper(sunLight)
    const sunShadowHelper = createShadowCameraHelper(sunLight)
    // const axesHelper = createAxesHelper(30)
    sunShadowHelper.visible = false
    
    loop.updatables.push(base, controls, sunPath, sky)
    
    scene.add(sky.sky, ambientLight, sunHelper, sunShadowHelper, sunPath.sunPathLight )

    this.gui = createGUI(params, ambientLight, sunLight, sunHelper, sunShadowHelper, sunPath, controls, skyControl, cameraControl)
    resizer = new Resizer(container, activeCamera, renderer)
  }

  async init() {
    const { house } = await loadHouse()
    const birds = await loadBirds()
    for (var b = 0; b < birds.children.length; b++) {
      loop.updatables.push(birds.children[b])
    }
    scene.add(house, birds)
    tl.to(birds.position, { duration: 60, delay: 1, x: 100, z: 120 })
    const player = createPlayer(firstPersonCamera, house)
    loop.updatables.push(player)
  }

  start() {
    loop.start()
  }
  
  stop() {
    loop.stop()
  }
}

export { World }
