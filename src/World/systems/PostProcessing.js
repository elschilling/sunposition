import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

function createPostProcessing(scene, camera, renderer) {
    const composer = new EffectComposer(renderer)

    // Base render pass
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // SSAO (Screen Space Ambient Occlusion) pass
    const ssaoPass = new SSAOPass(scene, camera, renderer.domElement.width, renderer.domElement.height)
    ssaoPass.kernelRadius = 16
    ssaoPass.minDistance = 0.005
    ssaoPass.maxDistance = 0.1
    ssaoPass.output = SSAOPass.OUTPUT.Default
    composer.addPass(ssaoPass)

    // Output pass for color space handling
    const outputPass = new OutputPass()
    composer.addPass(outputPass)

    return {
        composer,
        ssaoPass,
        renderPass,
        outputPass,
        updateSize(width, height) {
            composer.setSize(width, height)
            ssaoPass.setSize(width, height)
        },
        setCamera(camera) {
            renderPass.camera = camera
            ssaoPass.camera = camera
        }
    }
}

export { createPostProcessing }
