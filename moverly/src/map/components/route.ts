import { POI } from './poi';
import { Map } from "../map";
import { RouteLine } from './routeline';
import { Pin } from './pin';


export class Route {
    name : string;
    routeList : Array<POI>;
    routeLines : Array<RouteLine>;
    pinList: Array<Pin>;
    scene : Map;
    color : number;
    pinUrl : string;

    constructor(name : string, color : string, scene : Map){
        this.name = name;
        this.scene = scene;
        this.routeList = [];
        this.routeLines = [];
        this.pinList = [];

        switch (color){
            case "red":
                this.color = 0x8b0000;
                this.pinUrl = "/assets/ui/pin_red.png";
                break;
            case "orange":
                this.color = 0xff7800;
                this.pinUrl = "/assets/ui/pin_orange.png";
                break;
            case "blue":
                this.color = 0x00008b;
                this.pinUrl = "/assets/ui/pin_blue.png";
                break;
            default:
                this.color = 0x8b0000;
                this.pinUrl = "/assets/ui/pin_red.png";
                break;
        }   


    }

    addPoi(poi : POI){
        this.routeList.push(poi);
    }

    createRoute(){
        for (let i = 0; i < this.routeList.length - 1; i++){
            const poi1 = this.routeList[i];
            const poi2 = this.routeList[i + 1];
            const routeLine = new RouteLine(poi1.position, poi2.position, this.color);
            this.routeLines.push(routeLine);
        }
    }

    addPins(){    
        for (const poi of this.routeList){
            const pin = new Pin(this.pinUrl);
            pin.position.set(poi.position.x, poi.position.y+0.015, poi.position.z);
            this.pinList.push(pin);
        }
    }

    showRoute(){
        this.scene.showRoute(this);
    }

    hideRoute(){
        this.scene.hideRoute(this);
    }


}