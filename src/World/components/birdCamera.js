import { PerspectiveCamera } from 'three'

function createBirdCamera() {
  const camera = new PerspectiveCamera(
    40, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    500, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(50, 50, 50)
  camera.lookAt(0,0,0)

  return camera
}

export { createBirdCamera }