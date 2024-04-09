import {
  BoxGeometry,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
} from "three";

function createMaterial() {
  const texture = new TextureLoader().load("/assets/layers/bg.jpg");
  const material = new MeshBasicMaterial({ map: texture });

  return material;
}

function createCube() {
  const geometry = new BoxGeometry(20, 10, 1);
  const cube = new Mesh(geometry, createMaterial());

  const radiansPerSecond = MathUtils.degToRad(30);

  cube.tick = (delta: number) => {
    cube.rotation.x += radiansPerSecond * delta;
    cube.rotation.y += radiansPerSecond * delta;
    cube.rotation.z += radiansPerSecond * delta;
  };

  return cube;
}

export { createCube };
