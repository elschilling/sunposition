import { Clock } from 'three';

const clock = new Clock();

class Loop {
  constructor(camera, scene, renderer, composer = null) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.composer = composer;
    this.updatables = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();

      // render a frame
      if (this.composer) {
        this.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }

    });
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
