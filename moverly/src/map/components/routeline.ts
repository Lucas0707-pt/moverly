import * as THREE from 'three';

export class RouteLine extends THREE.Line {
  constructor(start: THREE.Vector3, end: THREE.Vector3, lineColor: number) {
    const curve = new THREE.CatmullRomCurve3(
      [start, end],
      false,
      'catmullrom',
      0.5
    );
    const points = curve.getPoints(1000);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineDashedMaterial({
      color: lineColor,
      linewidth: 10,
      dashSize: 0.01,
      gapSize: 0.01,
      opacity: 0,
      transparent: true,
    });

    super(geometry, material);

    this.computeLineDistances();
  }
}