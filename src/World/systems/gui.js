import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

function createGUI(params, ambientLight, sunLight, sunHelper, shadowCameraHelper, sunPath, controls, skyControl, cameraControl, postProcessing = null) {
  const gui = new GUI()
  gui.close()

  const skyFolder = gui.addFolder('Sky')
  skyFolder.add(skyControl, 'turbidity', 0.0, 20.0, 0.1)
  skyFolder.add(skyControl, 'rayleigh', 0.0, 4, 0.001)
  skyFolder.add(skyControl, 'mieCoefficient', 0.0, 0.1, 0.001)
  skyFolder.add(skyControl, 'mieDirectionalG', 0.0, 1, 0.001)
  skyFolder.add(skyControl, 'exposure', 0, 10, 0.001)
  skyFolder.close()

  const lightFolder = gui.addFolder('Light')
  lightFolder.add(sunLight, 'intensity').min(0).max(10).name('Sun Intensity')
  lightFolder.add(sunLight, 'castShadow').name('Sun shadows')
  lightFolder.add(sunLight.shadow, 'bias', -0.01, 0, 0.00001).name('Shadow bias')
  lightFolder.add(sunHelper, 'visible').name('Sun Helper')
  lightFolder.add(shadowCameraHelper, 'visible').name('Shadow Helper')
  lightFolder.add(ambientLight, 'intensity').min(0).max(10).name('Ambient Intensity')
  lightFolder.close()

  const locationFolder = gui.addFolder('Location')
  locationFolder.add(params, 'latitude').onChange(() => sunPath.updateLocation())
  locationFolder.add(params, 'longitude').onChange(() => sunPath.updateLocation())
  locationFolder.add(params, 'northOffset').onChange(() => sunPath.updateNorth())
  locationFolder.close()


  const cameraFolder = gui.addFolder('Camera')
  cameraFolder.add(controls, 'autoRotate')
  cameraFolder.add(cameraControl, 'firstPerson')
  cameraFolder.add(cameraControl, 'birdView')
  cameraFolder.close()

  const timeFolder = gui.addFolder('Time')
  timeFolder.add(params, 'minute', 0, 60, 1).onChange(() => sunPath.updateHour()).listen()
  timeFolder.add(params, 'hour', 0, 24, 1).onChange(() => sunPath.updateHour()).listen()
  timeFolder.add(params, 'day', 1, 30, 1).onChange(() => sunPath.updateMonth()).listen()
  timeFolder.add(params, 'month', 1, 12, 1).onChange(() => sunPath.updateMonth()).listen()
  timeFolder.add(params, 'animateTime')
  timeFolder.add(params, 'timeSpeed').min(0).max(10000).step(.1)
  timeFolder.close()

  const sunsurfaceFolder = gui.addFolder('Sun Surface')
  sunsurfaceFolder.add(params, 'showSunSurface').onChange(() => sunPath.updateLocation())
  sunsurfaceFolder.add(params, 'showAnalemmas').onChange(() => sunPath.updateLocation())
  sunsurfaceFolder.add(params, 'showSunDayPath').onChange(() => sunPath.updateLocation())
  sunsurfaceFolder.add(sunPath.sunPathLight.children[0].children[0], 'visible',).name('Sun Sphere')
  sunsurfaceFolder.add(sunPath.sunPathLight.children[1], 'visible',).name('Orientation')
  sunsurfaceFolder.close()

  // SSGI Controls
  if (postProcessing) {
    const ssgiFolder = gui.addFolder('SSGI (Screen Space GI)')
    const ssgiPass = postProcessing.ssgiPass || postProcessing.ssaoPass

    // Create a proxy object for SSGI parameters
    const ssgiParams = {
      enabled: ssgiPass ? ssgiPass.enabled : false,
      kernelRadius: ssgiPass ? (ssgiPass.kernelRadius || ssgiPass.radius) : 16,
      minDistance: ssgiPass ? (ssgiPass.minDistance || 0.005) : 0.005,
      maxDistance: ssgiPass ? (ssgiPass.maxDistance || 0.1) : 0.1
    }

    ssgiFolder.add(ssgiParams, 'enabled').name('Enabled').onChange((value) => {
      if (ssgiPass) ssgiPass.enabled = value
    })
    ssgiFolder.add(ssgiParams, 'kernelRadius').min(0).max(64).step(1).name('Kernel Radius').onChange((value) => {
      if (ssgiPass) {
        if (ssgiPass.kernelRadius !== undefined) ssgiPass.kernelRadius = value
        if (ssgiPass.radius !== undefined) ssgiPass.radius = value
      }
    })
    ssgiFolder.add(ssgiParams, 'minDistance').min(0.0001).max(0.01).step(0.0001).name('Min Distance').onChange((value) => {
      if (ssgiPass && ssgiPass.minDistance) ssgiPass.minDistance = value
    })
    ssgiFolder.add(ssgiParams, 'maxDistance').min(0.01).max(1).step(0.01).name('Max Distance').onChange((value) => {
      if (ssgiPass && ssgiPass.maxDistance) ssgiPass.maxDistance = value
    })
    ssgiFolder.close()
  }

  // skyFolder.hide()
  // lightFolder.hide()
  // locationFolder.hide()

  return gui
}

export { createGUI }