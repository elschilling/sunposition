import { Mesh, MeshBasicMaterial, SphereGeometry } from "three"

function createSunSphere() {
  const sunSphere = new Mesh(
    new SphereGeometry(),
    new MeshBasicMaterial({ color: 'yellow' })
  )
  sunSphere.visible = true
  return sunSphere
}

export { createSunSphere }