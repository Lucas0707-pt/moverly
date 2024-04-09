import { Mesh, Material, PlaneGeometry, VideoTexture, LinearFilter, RGBAFormat, MeshBasicMaterial, Vector3 } from "three";

export class Animation extends Mesh {
  material: Material;
  geometry: PlaneGeometry;
  video: HTMLVideoElement;
  playDistance: number;

  constructor(element: any, playDistance: number) {
    super();

    this.video = document.createElement("video");
    this.video.src = element.url;
    this.video.loop = true;
    this.video.muted = true;
    this.video.autoplay = true;

    const texture = new VideoTexture(this.video);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.format = RGBAFormat;

    this.material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
    });

    this.geometry =
      element.scale == null
        ? new PlaneGeometry(1, 1)
        : new PlaneGeometry(element.scale, element.scale);

    this.position.set(element.x, element.y, element.z);
    this.playDistance = playDistance;
  }

  update(cameraPosition: Vector3) {
    const distance = this.position.distanceTo(cameraPosition);
    if (distance <= this.playDistance) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }
}
