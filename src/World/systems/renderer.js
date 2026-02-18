import { PCFSoftShadowMap, ReinhardToneMapping, SRGBColorSpace, WebGLRenderer } from 'three'

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  renderer.toneMapping = ReinhardToneMapping
  renderer.outputColorSpace = SRGBColorSpace

  return renderer
}

export { createRenderer }