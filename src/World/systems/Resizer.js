const setSize = (container, camera, renderer) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
};

class Resizer {
  constructor(container, camera, renderer) {
    this.container = container
    this.camera = camera
    this.renderer = renderer
    // set initial size on load
    setSize(container, camera, renderer);

    window.addEventListener('resize', () => {
      // set the size again if a resize occurs
      // setSize(container, this.camera, renderer);
      // perform any custom actions
      this.onResize();
    });
  }

  onResize() {
    setSize(this.container, this.camera, this.renderer);
  }
}

export { Resizer };
