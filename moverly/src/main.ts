import { currentLanguage } from "./languages";
import { Map } from "./map/map";
import scene_description from "./scene_description.json";
import { buttonBlue } from "./scripts/colors";
import { RouteUI } from "./scripts/uiClasses";
import {
  AudioListener,
  Audio,
  AudioLoader,
} from "three";

const container = document.querySelector("#scene") || new Element();
const map = new Map(container);

map.start();

const webDiv = document.getElementById("web-version")!;
const mobileDiv = document.getElementById("mobile-version")!;
let isMobile = false;

if(window.innerHeight > window.innerWidth){
  webDiv.style.display = "none";
  isMobile = true;
}else{
  mobileDiv.style.display = "none";
}




const uiOverlay = document.getElementById("ui-overlay")!;
const menuToggleButton = document.getElementById("ui-toggle-button")!;
const buttonsDiv = document.getElementById("buttons-div")!;
const uiOverlayMobile = document.getElementById("ui-overlay-mobile")!;
const menuToggleButtonMobile = document.getElementById("ui-toggle-button-mobile")!;
const buttonsDivMobile = document.getElementById("buttons-div-mobile")!;
let menuState = false;
const toggleMenu = () =>{
  menuState = !menuState;
  if (menuState){ // Open menu
      buttonsDiv.style.display = "block";
      buttonsDiv.style.opacity = "1";
      uiOverlay.style.width="13vw";
      buttonsDivMobile.style.height = "30vw";
  }else{ //Close menu
      buttonsDiv.style.display = "none";
      buttonsDiv.style.opacity = "0";
      uiOverlay.style.width="5vw";
      buttonsDivMobile.style.height = "0vw";
      isInfoOpen = false;
  }
}



//Info overlay
const infoOverlay = document.getElementById("info-overlay")!;
const infoButton = document.getElementById("info-button")!;
const infoCloseButton = document.getElementById("info-close-button")!;
const infoBackButton = document.getElementById("info-back-button")!;

const historyButton = document.getElementById("info-navbar-history-button")!;
const lifestyleButton = document.getElementById("info-navbar-lifestyle-button")!;
const faunaButton = document.getElementById("info-navbar-fauna-button")!;
const floraButton = document.getElementById("info-navbar-flora-button")!;
const startPage = document.getElementById("info-start-page")!;
const historyPage = document.getElementById("info-history-page")!;
const lifestylePage = document.getElementById("info-lifestyle-page")!;
const faunaPage = document.getElementById("info-fauna-page")!;
const floraPage = document.getElementById("info-flora-page")!;

const projectButton = document.getElementById("project-button")!;
const projectOverlay = document.getElementById("project-overlay")!;
const projectCloseButton = document.getElementById("project-close-button")!;

let isInfoOpen = false;

function setInfoPageOpen(setOpen :boolean){
  if(!setOpen){
    infoOverlay.style.display ="none";
    infoButton.style.backgroundColor="transparent";
    infoButton.style.color="#177F9B";
    setJojoUISound(null);

  }else{
    closeEveryMenu();
    closeAllInfoPages();
    startPage.style.display = "block";
    infoOverlay.style.display ="block";
    infoButton.style.backgroundColor="#177F9B";
    infoButton.style.color="white";
    setJojoUISound("information");
  }
}

infoButton?.addEventListener("click",()=>{
  if (!isInfoOpen){
    setInfoPageOpen(true);
  }else{
    setInfoPageOpen(false);
  }
  isInfoOpen = !isInfoOpen;
});
infoCloseButton?.addEventListener("click",()=>{
  setInfoPageOpen(false);
  setJojoUISound(null);
  toggleMenu();
})

menuToggleButton?.addEventListener("click",toggleMenu);

infoBackButton?.addEventListener("click",()=>{
  closeAllInfoPages();
  startPage.style.display = "block";
  setJojoUISound("information");
})

historyButton?.addEventListener("click",()=>{
  closeAllInfoPages();
  historyPage.style.display = "block";
  infoBackButton.style.display = "block";
  setJojoUISound("history");
})

lifestyleButton?.addEventListener("click",()=>{
  closeAllInfoPages();
  lifestylePage.style.display = "block";
  infoBackButton.style.display = "block";
  setJojoUISound("lifestyle");
})

faunaButton?.addEventListener("click",()=>{
  closeAllInfoPages();
  faunaPage.style.display = "block";
  infoBackButton.style.display = "block";
  setJojoUISound("fauna");
})

floraButton?.addEventListener("click",()=>{
  closeAllInfoPages();
  floraPage.style.display = "block";
  infoBackButton.style.display = "block";
  setJojoUISound("flora");
})


const closeAllInfoPages =()=>{
  startPage.style.display = "none";
  historyPage.style.display = "none";
  lifestylePage.style.display = "none";
  faunaPage.style.display = "none";
  floraPage.style.display = "none";
  infoBackButton.style.display = "none";
}




menuToggleButton?.addEventListener("click",toggleMenu);




//Routes
let routesOpen = false;
const routesButton = document.getElementById("routes-button")!;
const routesDiv = document.getElementById("routes-div")!;
const routesDivMobile = document.getElementById("routes-div-mobile")!;

const routesList: RouteUI[] = [];
function setRoutesDivOpen(setOpen:boolean){
  if(setOpen){
      closeEveryMenu();
      routesDiv.style.display ="block";
      routesButton.style.backgroundColor=buttonBlue;
      routesButton.style.color="white";
      setJojoUISound("routes");
      console.log("opening routes");
  }else{
      routesDiv.style.display ="none";
      routesButton.style.backgroundColor="transparent";
      routesButton.style.color=buttonBlue;
      for(let i = 0; i < routesList.length; i++){
        routesList[i].setRouteOpen(false);
      }
      setJojoUISound(null);
      console.log("closing routes");
  }
  routesOpen = setOpen;
}

routesButton?.addEventListener("click",()=>{
  setRoutesDivOpen(!routesOpen);
})

//Add routes
let i = 0;
for (const route of map.getMapScene().routesList){
  const button = document.createElement('button');
  button.textContent = route.name;
  button.classList.add('routes-button');
  button.id = 'routes-button-'+i;
  routesDiv.appendChild(button);
  const buttonMobile = document.createElement('button');
  buttonMobile.textContent = route.name;
  buttonMobile.classList.add('routes-button-mobile');
  buttonMobile.id = 'routes-button-mobile-'+i;
  routesDivMobile.appendChild(buttonMobile);
  routesList.push(new RouteUI(button,buttonMobile,route));
  i++;
}






//Project page
let isProjectOpen = false;
function setProjectPageOpen(setOpen:boolean){
  if(setOpen){
      closeEveryMenu();
      projectOverlay.style.display ="block";
      projectButton.style.backgroundColor=buttonBlue;
      projectButton.style.color="white";
      setJojoUISound("project");
  }else{
      projectOverlay.style.display ="none";
      projectButton.style.backgroundColor="transparent";
      projectButton.style.color=buttonBlue;
      setJojoUISound(null);
  }
  isProjectOpen = setOpen;
}

projectButton?.addEventListener("click",()=>{
  setProjectPageOpen(!isProjectOpen);
})
projectCloseButton?.addEventListener("click",()=>{
  setProjectPageOpen(false);
})


//Sound button
// let soundOn = true;
// function toggleSound(){
//   soundOn = !soundOn;
//   if (soundOn){
//     soundButton.style.backgroundImage="url(/assets/ui/sound-icon.png)";
//     soundButton.style.backgroundSize ="100% 100%";
//     soundButtonMobile.style.backgroundImage="url(/assets/ui/sound-icon.png)";
//     soundButtonMobile.style.backgroundSize ="100% 100%";
//   }else{
//     soundButton.style.backgroundImage="url(/assets/ui/mute-icon.png)";
//     soundButton.style.backgroundSize ="73% 100%";
//     soundButtonMobile.style.backgroundImage="url(/assets/ui/mute-icon.png)";
//     soundButtonMobile.style.backgroundSize ="73% 100%";
//   }
// }
// const soundButton = document.getElementById("sound-button")!;
// soundButton.addEventListener("click",toggleSound);
// const soundButtonMobile = document.getElementById("sound-button-mobile")!;
// soundButtonMobile.addEventListener("click",toggleSound);


//Landing page

const landingPage = document.getElementById("landing-page")!;

landingPage.addEventListener("click",()=>{
  landingPage.style.display ="none";
  
  //ACTIVATE SOUND
  map.playsound();

})


//Jojo

let isJojoOn = true;
let jojoAnim:HTMLVideoElement | HTMLImageElement = document.getElementById("jojo-video")! as HTMLVideoElement;
let jojoAnimMobile:HTMLVideoElement | HTMLImageElement = document.getElementById("jojo-video-mobile")! as HTMLVideoElement;
function openJojo(){
  jojoAnim.style.marginTop = "-10vw";
  jojoAnimMobile.style.marginTop = "-25vw";
}
function closeJojo(){
  jojoAnim.style.marginTop = "10vw";
  jojoAnimMobile.style.marginTop = "10vw";
}
const jojoButton = document.getElementById("jojo-button")!;
const jojoButtonMobile = document.getElementById("jojo-button-mobile")!;
function setJojoActive(setActive:boolean){
  isJojoOn = setActive;
  if(isJojoOn){
    jojoButton.style.backgroundImage = ("url(/assets/ui/jojo-icon.png)")
    jojoButtonMobile.style.backgroundImage = ("url(/assets/ui/jojo-icon.png)")
  }else{    
    jojoButton.style.backgroundImage = ("url(/assets/ui/jojo-mute-icon.png)")
    jojoButtonMobile.style.backgroundImage = ("url(/assets/ui/jojo-mute-icon.png)")
  }
}
jojoButton.addEventListener("click",()=>{
  setJojoActive(!isJojoOn)
  if(!isJojoOn){
    closeJojo();
  }
  if(uiSound != null){
    uiSound.stop();
    uiSound = null;
  }
});
jojoButtonMobile.addEventListener("click",()=>{
  setJojoActive(!isJojoOn)
  if(!isJojoOn){
    closeJojo();
  }
  if(uiSound != null){
    uiSound.stop();
    uiSound = null;
  }
});

let uiSound:Audio | null = null;
function setJojoUISound(soundName:string  | null){
  if(!isJojoOn){
    return
  }
  if(uiSound != null){
    uiSound?.stop()
    uiSound = null;
  }
  closeJojo();
  if(soundName == null){return}
  openJojo();
  const sound = new Audio(new AudioListener());
  const audioLoader = new AudioLoader();
  let soundUrlPt= "",soundUrlEn = "";
  if(soundName=="information"){
    soundUrlPt="/assets/sounds/informacao-pt.mp3"
    soundUrlEn="/assets/sounds/informacao-en.mp3"
  }else if(soundName=="history"){
    soundUrlPt="/assets/sounds/historia-pt.mp3"
    soundUrlEn="/assets/sounds/historia-en.mp3"
  }else if(soundName=="lifestyle"){
    soundUrlPt="/assets/sounds/estilo-de-vida-pt.mp3"
    soundUrlEn="/assets/sounds/estilo-de-vida-en.mp3"
  }else if(soundName=="fauna"){
    soundUrlPt="/assets/sounds/fauna-pt.mp3"
    soundUrlEn="/assets/sounds/fauna-en.mp3"
  }else if(soundName=="flora"){
    soundUrlPt="/assets/sounds/flora-pt.mp3"
    soundUrlEn="/assets/sounds/flora-en.mp3"
  }else if(soundName=="routes"){
    soundUrlPt="/assets/sounds/roteiros-pt.mp3"
    soundUrlEn="/assets/sounds/roteiros-en.mp3"
  }else if(soundName=="project"){
    soundUrlPt="/assets/sounds/sobre-pt.mp3"
    soundUrlEn="/assets/sounds/sobre-en.mp3"
  }else{return};
  if (currentLanguage == "pt"){
    audioLoader.load(soundUrlPt, function (buffer) {
      sound.setBuffer(buffer);
      sound.setVolume(0.80);
      sound.play();
      if(uiSound != null){
        uiSound?.stop()
        uiSound = null;
      }
      uiSound = sound;
    });
  }else{
    audioLoader.load(soundUrlEn, function (buffer) {
      sound.setBuffer(buffer);
      sound.setVolume(0.80);
      sound.play();
      if(uiSound != null){
        uiSound?.stop()
        uiSound = null;
      }
      uiSound = sound;
    });
  }
}

function isSafari(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('safari') && !userAgent.includes('chrome');
}

const jojoDiv = document.getElementById("jojo-div")!;
const jojoDivMobile = document.getElementById("jojo-div-mobile")!;

if(true){
  jojoAnim.remove();
  jojoAnimMobile.remove();
  jojoAnim = document.createElement('img') as HTMLImageElement;
  jojoAnimMobile = document.createElement('img') as HTMLImageElement;
  jojoAnim.src = "assets/ui/jojo.png"
  jojoAnimMobile.src = "assets/ui/jojo.png"
  jojoAnim.id = ("jojo-video");
  jojoAnimMobile.id = ("jojo-video");

  jojoDiv.appendChild(jojoAnim);
  jojoDivMobile.appendChild(jojoAnimMobile);
}



function closeEveryMenu(){
  setInfoPageOpen(false);
  setProjectPageOpen(false);
  setRoutesDivOpen(false);
}

const accessibilityButton = document.getElementById("accessibility-button")!;
const accessibilityButtonMobile = document.getElementById("accessibility-button-mobile")!;
accessibilityButton.addEventListener("click",()=>{
  if (currentLanguage == "pt"){
    alert("Esta funcionalidade ainda não está disponível na versão MVP. Pedimos desculpa pelo incómodo!")
  }else{
    alert("This feature is not yet available in the MVP version. We apologise for the inconvenience!");
  }
})
accessibilityButtonMobile.addEventListener("click",()=>{
  if (currentLanguage == "pt"){
    alert("Esta funcionalidade ainda não está disponível na versão MVP. Pedimos desculpa pelo incómodo!")
  }else{
    alert("This feature is not yet available in the MVP version. We apologise for the inconvenience!");
  }
})


export {routesList,isMobile, map, isJojoOn,openJojo,closeJojo,setJojoUISound}
