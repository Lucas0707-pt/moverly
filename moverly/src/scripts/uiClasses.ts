import { buttonBlue, secondaryButtonBlue } from "./colors";
import { Route } from "../map/components/route";
import { isJojoOn, isMobile, routesList } from "../main";


class RouteUI{

    isOpen:boolean = false;
    routeButton:HTMLElement | null;
    routeButtonMobile:HTMLElement | null;

    static routeDescriptionDiv = document.getElementById("routes-description-div")!;
    static routeDescriptionTitle = document.getElementById("routes-description-title")!;
    static routeDescriptionDivMobile = document.getElementById("routes-description-div-mobile")!;
    static routeDescriptionTitleMobile = document.getElementById("routes-description-title-mobile")!;
  
    route : Route;
  
    constructor(routeButton:HTMLElement | null, routeButtonMobile:HTMLElement | null, route:Route){
      if(routeButton == null || routeButtonMobile == null){
        this.routeButton = null;
        this.routeButtonMobile = null;
      }else{
        this.routeButton = routeButton;
        this.routeButtonMobile = routeButtonMobile;
        routeButton.addEventListener("click",()=>{
          this.setRouteOpen(!this.isOpen);
        })
        routeButtonMobile.addEventListener("click",()=>{
          this.setRouteOpen(!this.isOpen);
        })
      }
      this.route = route;
    }
  
    setRouteOpen(setOpen:boolean){
      if (this.routeButton == null || this.routeButtonMobile == null){return};
      if(setOpen){
        for(let i = 0; i < routesList.length; i++){
          routesList[i].setRouteOpen(false);
        }
        
        console.log("Opening route ")
        this.route.showRoute();

        this.routeButton.style.background = secondaryButtonBlue;
        this.routeButton.style.color = "white";
        this.routeButtonMobile.style.background = secondaryButtonBlue;
        this.routeButtonMobile.style.color = "white";

        RouteUI.routeDescriptionDiv.style.display ="block";
        if(isJojoOn){
          RouteUI.routeDescriptionDiv.style.bottom = "12vw";
          RouteUI.routeDescriptionDivMobile.style.bottom = "30vw";
        }else{
          RouteUI.routeDescriptionDiv.style.bottom = "1vw";
          RouteUI.routeDescriptionDivMobile.style.bottom = "5vw";
        }
        RouteUI.routeDescriptionTitle.innerHTML = this.route.name;
        RouteUI.routeDescriptionDivMobile.style.display ="block";
        RouteUI.routeDescriptionTitleMobile.innerHTML = this.route.name;
        const children = RouteUI.routeDescriptionDiv.children;
        const childrenMobile = RouteUI.routeDescriptionDivMobile.children;
        let childrenLenght = children.length;
        let childrenLenghtMobile = childrenMobile.length;
        if(isMobile){
          for(let i = 1; i < childrenLenghtMobile; i++){
            RouteUI.routeDescriptionDivMobile.removeChild(childrenMobile[1]);
          }
        }else{
          for(let i = 1; i < childrenLenght; i++){
            RouteUI.routeDescriptionDiv.removeChild(children[1]);
          }
        }
        for ( const poi of this.route.routeList){
          const poiElement = document.createElement('div');
          poiElement.textContent = poi.title;
          if(isMobile){
            poiElement.classList.add('routes-description-point-mobile');
            RouteUI.routeDescriptionDivMobile.appendChild(poiElement);
          }else{
            poiElement.classList.add('routes-description-point');
            RouteUI.routeDescriptionDiv.appendChild(poiElement);
          }
        }
  
        //OPEN RoUTE
  
      }else{
        this.route.hideRoute();
        this.routeButton.style.background = "transparent";
        this.routeButton.style.color = buttonBlue;
        console.log("Closing route from " + this.routeButtonMobile);
        this.routeButtonMobile.style.background = "transparent";
        this.routeButtonMobile.style.color = buttonBlue;
        RouteUI.routeDescriptionDiv.style.display ="none";
        RouteUI.routeDescriptionDivMobile.style.display ="none";
  
        //CLOSE ROUTE
  
      }
      
      this.isOpen = setOpen;
    }
  }

  export {RouteUI};