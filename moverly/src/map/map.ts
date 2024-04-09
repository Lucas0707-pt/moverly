import {
  PerspectiveCamera,
  Raycaster,
  Scene,
  WebGLRenderer,
  Vector2,
  Vector3,
  AudioListener,
  Audio,
  AudioLoader,
} from "three";

import gsap from "gsap";
import { createCamera } from "./components/camera";
import { createPlane } from "./components/plane";
import { createScene } from "./components/scene";
import { POI } from "./components/poi";
import { Route } from "./components/route";
import { MapScene } from "./mapscene";
import { createControls } from "./systems/controls";
import { Loop } from "./systems/loop";
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/resizer";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import * as data from "../scene_description.json";

class Map {
  private camera: PerspectiveCamera;
  private scene: Scene;
  private renderer: WebGLRenderer;
  private cssrenderer: CSS2DRenderer;
  private loop: Loop;
  private mapScene: MapScene;
  private raycaster: Raycaster;
  private pointer: Vector2;
  private poi: POI | null;
  private listener: AudioListener;
  public soundOn: boolean = true;

  constructor(container: Element) {
    this.camera = createCamera();
    this.scene = createScene();
    this.renderer = createRenderer();
    container?.append(this.renderer.domElement);
    this.mapScene = new MapScene(this.scene, this);
    this.raycaster = new Raycaster();
    this.pointer = new Vector2();
    this.poi = null;

    this.cssrenderer = new CSS2DRenderer();
    this.cssrenderer.setSize(window.innerWidth, window.innerHeight);
    this.cssrenderer.domElement.style.position = "absolute";
    this.cssrenderer.domElement.style.top = "0px";
    container?.append(this.cssrenderer.domElement);

    this.loop = new Loop(
      this.camera,
      this.scene,
      this.renderer,
      this.cssrenderer
    );

    const controls = createControls(this.camera, this.cssrenderer.domElement);

    controls.addEventListener("change", () => {
      this.mapScene.updateAnimations(this.camera.position);
    });

    this.loop.updatables.push(controls);

    this.listener = new AudioListener();
    this.camera.add(this.listener);

    // create a global audio source
    const sound = new Audio(this.listener);
  
    // load a sound and set it as the Audio object's buffer
    const audioLoader = new AudioLoader();
    audioLoader.load("assets/sounds/theme.wav", function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.20);
    });
    
    this.mapScene.parse(data);

    const plane = createPlane();

    this.scene.add(plane);

    const resizer = new Resizer(container, this.camera, this.renderer);


    document.addEventListener( 'mousemove', (ev) => {
      this.pointer.set(
        (ev.clientX / window.innerWidth) * 2 - 1,
        -(ev.clientY / window.innerHeight) * 2 + 1
      );

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects(
        this.scene.children,
        false
      );
      const intersectsObj = intersects.map(intersect => intersect.object);
      for (const children of this.scene.children){
        if(children.hover){
          if(intersectsObj.includes(children)){
            children.hover();
          }else{
            children.dehover();
          }
        }
      }
    })

    document.addEventListener('pointerdown', (ev) => {
      const close = document.querySelector('.close');
      if (close) {
        const {from, target} = this.poi?.closePopup();
        gsap.to(this.camera.position, {
          x: from?.x,
          y: from?.y,
          z: from?.z,
          duration: 1,
          ease: "power2.inOut",
        });
        gsap.to(controls.target, {
          x: target?.x,
          y: target?.y,
          z: target?.z,
          duration: 1,
          ease: "power2.inOut",
        });
      }

      this.pointer.set(
        (ev.clientX / window.innerWidth) * 2 - 1,
        -(ev.clientY / window.innerHeight) * 2 + 1
      );
      this.raycaster.setFromCamera(this.pointer, this.camera);
      const intersects = this.raycaster.intersectObjects(
        this.scene.children,
        false
      );
      for (const intersect of intersects) {
        if (intersect.object.onClick) {
          intersect.object.onClick();
          const target = intersect.object.position.clone();
          target.z += 0.3;
          this.poi?.restorePosition(this.camera.position, controls.target) 

          gsap.to(this.camera.position, {
            x: target.x,
            y: target.y,
            z: target.z,
            duration: 1,
            ease: "power2.inOut",
          });

          gsap.to(controls.target, {
            x: target.x,
            y: target.y,
            z: target.z - 0.3,
            duration: 1,
            ease: "power2.inOut",
          });
        }
      }
    });
  }

  openPopUp(poi: POI) {
    if (this.poi != null) {
      this.poi.closePopup();
    } 
    this.poi = poi;
  }

  showRoute(route: Route) {
    for (const routeLine of route.routeLines) {
      this.scene.add(routeLine);
      gsap.killTweensOf(routeLine.material);
      gsap.to(routeLine.material, { opacity: 1, duration: 1.5 });
    }
    for (const pin of route.pinList) {
      this.scene.add(pin);
      gsap.killTweensOf(pin.material);
      gsap.to(pin.material, { opacity: 1, duration: 1.5 });
    }
  }
  
  hideRoute(route: Route) {
  
    const onComplete = () => {
      for (const routeLine of route.routeLines) {
        this.scene.remove(routeLine);
      }
      for (const pin of route.pinList) {
        this.scene.remove(pin);
      }
    };
  
    for (const routeLine of route.routeLines) {
      gsap.killTweensOf(routeLine.material);
      gsap.to(routeLine.material, { opacity: 0, duration: 1.5, onComplete });
    }
    for (const pin of route.pinList) {
      gsap.killTweensOf(pin.material);
      gsap.to(pin.material, { opacity: 0, duration: 1.5, onComplete });
    }
  }
  getMapScene(){
    return this.mapScene;
  }

  getListener(){
    return this.listener;
  }

  playsound(){
    // create a global audio source
    const sound = new Audio(this.listener);
  
    // load a sound and set it as the Audio object's buffer
    const audioLoader = new AudioLoader();
    audioLoader.load("assets/sounds/theme.wav", function (buffer) {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.20);
      sound.play();
    });

    this.soundOn = true;
    const soundButton = document.getElementById("sound-button")!;
    soundButton.addEventListener("click",() =>{
      this.soundOn = !this.soundOn;
      if (this.soundOn){
        soundButton.style.backgroundImage="url(assets/ui/sound-icon.png)";
        soundButton.style.backgroundSize ="100% 100%";
        soundButtonMobile.style.backgroundImage="url(assets/ui/sound-icon.png)";
        soundButtonMobile.style.backgroundSize ="100% 100%";
        sound.play();

      }else{
        soundButton.style.backgroundImage="url(assets/ui/mute-icon.png)";
        soundButton.style.backgroundSize ="73% 100%";
        soundButtonMobile.style.backgroundImage="url(assets/ui/mute-icon.png)";
        soundButtonMobile.style.backgroundSize ="73% 100%";
        sound.stop();
        this.mapScene.muteSounds();
      }
    });
    
    const soundButtonMobile = document.getElementById("sound-button-mobile")!;
    soundButtonMobile.addEventListener("click",() => {
      this.soundOn = !this.soundOn;
      if (this.soundOn){
        soundButton.style.backgroundImage="url(assets/ui/sound-icon.png)";
        soundButton.style.backgroundSize ="100% 100%";
        soundButtonMobile.style.backgroundImage="url(assets/ui/sound-icon.png)";
        soundButtonMobile.style.backgroundSize ="100% 100%";
        sound.play();

      }else{
        soundButton.style.backgroundImage="url(assets/ui/mute-icon.png)";
        soundButton.style.backgroundSize ="73% 100%";
        soundButtonMobile.style.backgroundImage="url(assets/ui/mute-icon.png)";
        soundButtonMobile.style.backgroundSize ="73% 100%";
        sound.pause();
        this.mapScene.muteSounds();
      }
    });
  }


  render() {
    this.renderer.render(this.scene, this.camera);
    this.cssrenderer.render(this.scene, this.camera);
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}

export { Map };