import { Mesh, MeshBasicMaterial, SphereBufferGeometry } from "three"

function createSunSphere() {
  const sunSphere = new Mesh(
    new SphereBufferGeometry(),
    new MeshBasicMaterial({ color: 'yellow' })
  )
  // sunSphere.position.y = 30
  return sunSphere
}

export { createSunSphere }