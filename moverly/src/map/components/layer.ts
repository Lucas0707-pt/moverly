import * as THREE from "three";

export class MapLayer extends THREE.Mesh {
  material: THREE.Material;
  geometry: THREE.PlaneGeometry;

  constructor(element: any) {
    super();
    const texture = new THREE.TextureLoader().load(element.url, (tex) => {
      tex.needsUpdate = true;
      this.scale.set(1.0, tex.image.height / tex.image.width, 1.0);
    });

    this.material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });

    this.geometry =
      element.scale == null
        ? new THREE.PlaneGeometry(1, 1)
        : new THREE.PlaneGeometry(element.scale, element.scale);

    this.position.set(element.x, element.y, element.z);
  }
}
