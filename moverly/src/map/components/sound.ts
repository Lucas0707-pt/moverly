import { Scene, PositionalAudio, Vector3, AudioLoader, CircleGeometry, MeshBasicMaterial, Mesh, AudioListener } from "three";

export class Sound {
    private sound : PositionalAudio;
    private position : Vector3;
    private playDistance : number;
    private mute : boolean;

    constructor(scene : Scene, listener : AudioListener, soundInfo : any) {
        
        // create the PositionalAudio object (passing in the listener)
        const sound = new PositionalAudio( listener );

        // load a sound and set it as the PositionalAudio object's buffer
        const audioLoader = new AudioLoader();
        audioLoader.load( soundInfo.url, function( buffer ) {
            sound.setBuffer( buffer );
            sound.setRefDistance( 0.075 );
            sound.setLoop(true);
            sound.setVolume(0.8);
        });

        this.sound = sound;
        this.mute = false;
        this.playDistance = soundInfo.distance;

        const geometry = new CircleGeometry(0.003, 32);
        const material = new MeshBasicMaterial({
            transparent : true,
            opacity : 0
        });
        const mesh = new Mesh( geometry, material );
        scene.add( mesh );
        mesh.position.set(soundInfo.x,soundInfo.y,soundInfo.z);
        this.position = mesh.position;
    // finally add the sound to the mesh
        mesh.add( sound );
    }

    update(cameraPosition: Vector3) {
        const distance = this.position.distanceTo(cameraPosition);
        if (distance <= this.playDistance) {
            if(!this.sound.isPlaying && !this.mute){
                this.sound.play();
            }
        } else {
            this.sound.pause();
        }
    }

    muteSound(){
        this.sound.pause();
        this.mute = true;
    }
}
