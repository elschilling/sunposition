import { CameraHelper, DirectionalLightHelper } from "three"

function createDirectionalLightHelper(light) {
  const directionalLightHelper = new DirectionalLightHelper(light)
  return directionalLightHelper
}

function createShadowCameraHelper(light) {
  const shadowCameraHelper = new CameraHelper(light.shadow.camera)
  return shadowCameraHelper
}
export { createDirectionalLightHelper, createShadowCameraHelper }