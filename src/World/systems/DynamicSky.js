import { Vector3 } from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky'

class DynamicSky {
  constructor(skyControl, sphereLight, renderer) {
    this.skyControl = skyControl
    this.sky = new Sky()
    this.renderer = renderer
    this.sphereLight = sphereLight
    this.sky.scale.setScalar(450000)
  }
  tick() {
    let sunPosition = new Vector3().setFromMatrixPosition(this.sphereLight.matrixWorld)
    if (sunPosition.y < 0) {
      this.sphereLight.children[1].visible = false
    } else {
      this.sphereLight.children[1].visible = true
    }
    const uniforms = this.sky.material.uniforms
    uniforms[ 'turbidity' ].value = this.skyControl.turbidity;
    uniforms[ 'rayleigh' ].value = this.skyControl.rayleigh;
    uniforms[ 'mieCoefficient' ].value = this.skyControl.mieCoefficient;
    uniforms[ 'mieDirectionalG' ].value = this.skyControl.mieDirectionalG;
    uniforms['sunPosition'].value.copy(sunPosition)
    this.renderer.toneMappingExposure = this.skyControl.exposure
    // console.log(this.sphereLight.position)
  }
}

export { DynamicSky }