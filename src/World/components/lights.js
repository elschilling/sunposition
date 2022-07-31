import { AmbientLight, DirectionalLight } from 'three';

function createLights() {
  const ambientLight = new AmbientLight('white', 1.7)
  const sunLight = new DirectionalLight('white', 8);
  sunLight.castShadow = true
  sunLight.shadow.bias = -0.005
  let mapSize = 1
  sunLight.shadow.mapSize.set(1024 * mapSize, 1024 * mapSize)

  // move the light right, up, and towards us
  // sunLight.position.set(30, 30, 30);

  return { ambientLight, sunLight }
}

export { createLights }