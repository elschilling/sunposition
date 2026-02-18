import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GTAOPass } from 'three/examples/jsm/postprocessing/GTAOPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

// Layer number to exclude from AO (sun path elements)
export const AO_EXCLUDED_LAYER = 1

function createPostProcessing(scene, camera, renderer) {
    const composer = new EffectComposer(renderer)

    // Base render pass
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // GTAO (Ground Truth Ambient Occlusion) pass
    const gtaoPass = new GTAOPass(scene, camera, renderer.domElement.width, renderer.domElement.height)
    gtaoPass.output = GTAOPass.OUTPUT.Default
    gtaoPass.enabled = false
    composer.addPass(gtaoPass)

    // Output pass for color space handling
    const outputPass = new OutputPass()
    composer.addPass(outputPass)

    return {
        composer,
        gtaoPass,
        renderPass,
        outputPass,
        AO_EXCLUDED_LAYER,
        updateSize(width, height) {
            composer.setSize(width, height)
            gtaoPass.setSize(width, height)
        },
        setCamera(camera) {
            renderPass.camera = camera
            gtaoPass.camera = camera
        }
    }
}

export { createPostProcessing }
