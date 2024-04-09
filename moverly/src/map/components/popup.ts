import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { currentLanguage } from "../../languages";
import { isJojoOn, openJojo } from "../../main";

import {
  AudioListener,
  Audio,
  AudioLoader,
} from "three";

export class PopUp extends CSS2DObject {
  public sound : Audio | null = null;
  constructor(title, titulo, street, text, texto, imageUrl,soundUrlPt,soundUrlEn) {
    const element = createPopUp(title, titulo, street, text, texto, imageUrl,soundUrlPt,soundUrlEn);
    super(element);
    console.log("Jojo is " + isJojoOn);
    if(isJojoOn){
      const sound = new Audio(new AudioListener());
      const audioLoader = new AudioLoader();
      if (currentLanguage == "pt"){
        audioLoader.load(soundUrlPt, function (buffer) {
          sound.setBuffer(buffer);
          sound.setVolume(0.80);
          sound.play();
        });
      }else{
        audioLoader.load(soundUrlEn, function (buffer) {
          sound.setBuffer(buffer);
          sound.setVolume(0.80);
          sound.play();
        });
      }
      this.sound = sound;
      if (sound == null){
        console.error("The sound for" + soundUrlPt + "wasn't found! Perhaps the name is miss spelled...");
      }
      openJojo();
    }
  }
}

function createPopUp(title, titulo, street, text, texto, imageUrl,soundUrlPt,soundUrlEn) {
  const modalcontent = document.createElement('div');
  modalcontent.className = 'modal-content';

  const close = document.createElement('button');
  close.className = 'close';
  const closeImage = document.createElement('img');
  closeImage.src = '/assets/ui/close-button.png';
  close.appendChild(closeImage);
  modalcontent.appendChild(close);

  if (imageUrl) {
    const modalImage = document.createElement('img');
    modalImage.className = 'modal-image';
    modalImage.src = imageUrl;
    modalcontent.appendChild(modalImage);
  }
  
  const modalText = document.createElement('div');
  modalText.className = 'modal-text';

  const popupTitle = document.createElement('h2');
  if (currentLanguage === 'en') {
    popupTitle.textContent = title;
  } else {
    popupTitle.textContent = titulo;
  }
  modalText.appendChild(popupTitle);

  const popupStreet = document.createElement('p');
  popupStreet.className = 'street-text';
  popupStreet.textContent = street;
  popupStreet.style.marginBottom = '5px';
  modalText.appendChild(popupStreet);

  const popupText = document.createElement('p');
  if (currentLanguage === 'en') {
    popupText.textContent = text;
  } else {
    popupText.textContent = texto;
  }
  modalText.appendChild(popupText);
  modalcontent.appendChild(modalText);

  return modalcontent;
}