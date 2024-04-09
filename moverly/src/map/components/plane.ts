import { Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader } from "three";

function createPlane() {
  const geometry = new PlaneGeometry(2.18, 2.20);

  const texture = new TextureLoader().load("/assets/layers/Tudo.jpg", (tex) => {
  tex.needsUpdate = true;
  geometry.scale(1.0, tex.image.height / tex.image.width, 1.0);
  });
  const material = new MeshBasicMaterial({ map: texture });

  const plane = new Mesh(geometry, material);
  plane.position.set(0, 0.017, 0);

  return plane;
}

export { createPlane };
