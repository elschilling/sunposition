const setSize = (container, camera, renderer, postProcessing = null) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  if (postProcessing) {
    postProcessing.updateSize(container.clientWidth, container.clientHeight);
  }
};

class Resizer {
  constructor(container, camera, renderer, postProcessing = null) {
    this.container = container
    this.camera = camera
    this.renderer = renderer
    this.postProcessing = postProcessing
    // set initial size on load
    setSize(container, camera, renderer, postProcessing);

    window.addEventListener('resize', () => {
      // set the size again if a resize occurs
      // setSize(container, this.camera, renderer);
      // perform any custom actions
      this.onResize();
    });
  }

  onResize() {
    setSize(this.container, this.camera, this.renderer, this.postProcessing);
  }
}

export { Resizer };
