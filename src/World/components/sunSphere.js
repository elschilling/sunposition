import { Mesh, MeshBasicMaterial, SphereGeometry } from "three"

function createSunSphere() {
  const sunSphere = new Mesh(
    new SphereGeometry(),
    new MeshBasicMaterial({ color: 'yellow' })
  )
  sunSphere.visible = false
  return sunSphere
}

export { createSunSphere }