import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

function createGUI(params, ambientLight, sunLight, sunHelper, shadowCameraHelper, sunPath, controls, skyControl) {
  const gui = new GUI()

  const skyFolder = gui.addFolder('Sky')
  skyFolder.add( skyControl, 'turbidity', 0.0, 20.0, 0.1 )
  skyFolder.add( skyControl, 'rayleigh', 0.0, 4, 0.001 )
  skyFolder.add( skyControl, 'mieCoefficient', 0.0, 0.1, 0.001 )
  skyFolder.add( skyControl, 'mieDirectionalG', 0.0, 1, 0.001 )
  skyFolder.add( skyControl, 'exposure', 0, 10, 0.001 )
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
  cameraFolder.add(controls, 'autoRotate').name('Girar')

  const timeFolder = gui.addFolder('Tempo')
  timeFolder.add(params, 'hour', 0, 24, 1).onChange(() => sunPath.updateHour()).listen().name('Hora')
  timeFolder.add(params, 'month', 1, 12, 1).onChange(() => sunPath.updateMonth()).name('Mês')
  timeFolder.add(params, 'animateTime').name('Animar tempo')
  
  skyFolder.hide()
  lightFolder.hide()
  locationFolder.hide()



  return gui
}

export { createGUI }