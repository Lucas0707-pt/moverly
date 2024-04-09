import { Camera, Clock, Mesh, Scene, WebGLRenderer } from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";

class Loop {
  public updatables: Mesh[];
  private clock: Clock;

  constructor(
    private camera: Camera,
    private scene: Scene,
    private renderer: WebGLRenderer,
    private cssrenderer: CSS2DRenderer
  ) {
    this.updatables = [];
    this.clock = new Clock();
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      this.tick();

      this.renderer.render(this.scene, this.camera);
      this.cssrenderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    const delta = this.clock.getDelta();
    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
}

export { Loop };
