import * as THREE from "three";

export class MapElement {
  mesh: THREE.Mesh;

  constructor(url: string, xpos: number, ypos: number) {
    const texture = new THREE.TextureLoader().load(url, (tex) => {
      tex.needsUpdate = true;
      this.mesh.scale.set(1.0, tex.image.height / tex.image.width, 1.0);
    });

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    console.log(texture);
    const geometry = new THREE.PlaneGeometry(20, 13.7);

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(xpos, ypos, 0.5);
  }

  getMesh() {
    return this.mesh;
  }
}
