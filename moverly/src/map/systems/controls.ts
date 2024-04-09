import { Camera, MOUSE, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function createControls(camera: Camera, canvas: HTMLElement) {
  const controls = new OrbitControls(camera, canvas);

  controls.enableRotate = false;

  controls.minDistance = 0.115;
  controls.maxDistance = 0.88;

  controls.mouseButtons = {
    LEFT: MOUSE.PAN,
    MIDDLE: MOUSE.DOLLY,
  };

  const minPan = new Vector3( - 0.50, - 0.20, - 0.25 );
  const maxPan = new Vector3( 0.50, 0.20, 0.25 );
  const _v = new Vector3();

  controls.addEventListener("change", function() {
    _v.copy(controls.target);
    controls.target.clamp(minPan, maxPan);
    _v.sub(controls.target);
    camera.position.sub(_v);
  })

  controls.tick = () => controls.update();

  return controls;
}

export { createControls };
