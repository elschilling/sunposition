import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

function createPostProcessing(scene, camera, renderer) {
    const composer = new EffectComposer(renderer)

    // Base render pass
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // SSGI (Screen Space Global Illumination) pass
    const ssgiPass = new SSAOPass(scene, camera, renderer.domElement.width, renderer.domElement.height)
    ssgiPass.kernelRadius = 3
    ssgiPass.minDistance = 0.0008
    ssgiPass.maxDistance = 0.1
    ssgiPass.output = SSAOPass.OUTPUT.Default
    composer.addPass(ssgiPass)

    // Output pass for color space handling
    const outputPass = new OutputPass()
    composer.addPass(outputPass)

    return {
        composer,
        ssgiPass,
        renderPass,
        outputPass,
        updateSize(width, height) {
            composer.setSize(width, height)
            ssgiPass.setSize(width, height)
        },
        setCamera(camera) {
            renderPass.camera = camera
            ssgiPass.camera = camera
        }
    }
}

export { createPostProcessing }
