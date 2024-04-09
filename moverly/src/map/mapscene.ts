import { MapLayer } from "./components/layer";
import { MeshBasicMaterial } from "three";
import { POI } from "./components/poi";
import { Animation } from "./components/animation";
import { Route } from "./components/route";
import { Map } from "./map";
import { Sound } from "./components/sound";
import { closeJojo } from "../main";

interface Event {
  name: string;
  description: string;
  price: number;
  date: Date;
  xCoord: number;
  yCoord: number;
}

async function getEvents(): Promise<POI[]> {
  const base = "https://lgp-moverly-events.vercel.app";
  const res = await fetch(`${base}/api/events`);
  const data: { events: Event[] } = await res.json();
  const events = data.events;
  const newPOIs: POI[] = [];

  for (const event of events) {
    const poi = convertEventToPOI(event);
    newPOIs.push(poi);
  }

  return newPOIs;
}

function convertEventToPOI(event: Event): POI {
  const poi = new POI({}, null);
  poi.title = event.name;
  poi.titulo = event.name;
  poi.texto = event.name;
  poi.text = event.description;
  poi.street = `${event.price}$`;
  poi.material = new MeshBasicMaterial({
    color: 0xffac1c,
    transparent: true,
    opacity: 1,
  });
  poi.imageUrl = "";
  poi.position.set(event.xCoord, event.yCoord, 0.01);

  return poi;
}

interface Event {
  name: string;
  description: string;
  price: number;
  date: Date;
  xCoord: number;
  yCoord: number;
}

export class MapScene {
  layerList: Array<MapLayer>;
  poiList: Array<POI>;
  animationList: Array<Animation>;
  eventsList: POI[];
  routesList: Array<Route>;
  soundsList: Array<Sound>;
  scene: THREE.Scene;
  map: Map;

  constructor(scene: THREE.Scene, map: Map) {
    this.scene = scene;
    this.map = map;
    this.layerList = [];
    this.poiList = [];
    this.animationList = [];
    this.routesList = [];
    this.soundsList = [];
    this.eventsList = [];
  }

  parse(data: any) {
    const layers = data.layers;
    const isSafari = this.isSafari();

    for (const layer of layers) {
      if (layer.url == "assets/layers/3D_static.png" && !isSafari){
        continue;
      }
      if (layer.url == "assets/layers/3D.png" && isSafari){
        continue;
      }
      const mapLayer = new MapLayer(layer);
      this.layerList.push(mapLayer);
      this.scene.add(mapLayer);
    }

    const animations = data.animations;
    for (const animation of animations) {
      const mapAnimation = new Animation(animation, 0.35);
      this.animationList.push(mapAnimation);
      this.scene.add(mapAnimation);
    }

    const pois = data.poi;
    for (const poi of pois) {
      const mapPoi = new POI(poi, this.map);
      this.poiList.push(mapPoi);
      this.scene.add(mapPoi);
    }

    getEvents().then((data) => {
      this.eventsList = data;

      for (const event of this.eventsList) {
        event.scene = this.map;
        this.scene.add(event);
      }
    });

    const sounds = data.sounds;
    for (const sound of sounds) {
      const mapSound = new Sound(this.scene, this.map.getListener(), sound);
      this.soundsList.push(mapSound);
    }

    const routes = data.routes;
    for (const route of routes) {
      const mapRoute = new Route(route.name, route.color, this.map);
      for (const poi of route.poi) {
        for (const mapPoi of this.poiList) {
          if (mapPoi.title == poi.name) {
            mapRoute.addPoi(mapPoi);
          }
        }
      }
      mapRoute.createRoute();
      mapRoute.addPins();
      this.routesList.push(mapRoute);
    }

    getEvents().then((data) => {
      this.eventsList = data;

      for (const event of this.eventsList) {
        event.scene = this.map;
        this.scene.add(event);
      }
    });
  }

  updateAnimations(cameraPosition: THREE.Vector3) {
    for (const animation of this.animationList) {
      animation.update(cameraPosition);
    }

    for (const sound of this.soundsList) {
      sound.update(cameraPosition);
    }
  }

  isSafari() {
    return (
      navigator.userAgent.indexOf("Safari") != -1 &&
      navigator.userAgent.indexOf("Chrome") == -1
    );
  }

  muteSounds() {
    for (const sound of this.soundsList) {
      sound.muteSound();
    }
    closeJojo();
  }
}
