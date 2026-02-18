import { Clock } from 'three';

const clock = new Clock();

class Loop {
  constructor(camera, scene, renderer, composer = null) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.composer = composer;
    this.updatables = [];
    this.gtaoExcludeObjects = [];
  }

  setGTAOExcludeObjects(objects) {
    this.gtaoExcludeObjects = objects;
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();

      // render a frame
      if (this.composer) {
        this.renderWithGTAO();
      } else {
        this.renderer.render(this.scene, this.camera);
      }

    });
  }

  renderWithGTAO() {
    // Find GTAO pass
    const gtaoPass = this.composer.passes.find(p => p.isGTAOPass);

    if (!gtaoPass || !gtaoPass.enabled) {
      this.composer.render();
      return;
    }

    // Hide objects that should be excluded from GTAO
    const excludedVisibility = [];
    for (const obj of this.gtaoExcludeObjects) {
      excludedVisibility.push(obj.visible);
      obj.visible = false;
    }

    // Render GTAO pass
    gtaoPass.render(this.renderer);

    // Restore visibility
    for (let i = 0; i < this.gtaoExcludeObjects.length; i++) {
      this.gtaoExcludeObjects[i].visible = excludedVisibility[i];
    }

    // Render remaining passes (skip GTAO pass)
    for (const pass of this.composer.passes) {
      if (pass.isGTAOPass) continue;
      pass.render(this.renderer);
    }
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta();

    // console.log(
    //   `The last frame rendered in ${delta * 1000} milliseconds`,
    // );

    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
}

export { Loop }
