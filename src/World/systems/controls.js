import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas)

  // damping and auto rotation require
  // the controls to be updated each frame

  // this.controls.autoRotate = true;
  controls.enableDamping = true
  controls.autoRotate = true
  controls.minDistance = 30
  controls.maxDistance = 200
  // controls.maxPolarAngle = Math.PI / 2


  controls.tick = () => controls.update()

  return controls
}

export { createControls }
