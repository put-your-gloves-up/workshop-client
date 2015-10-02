/**
 * Created by Vincent on 30/09/2015.
 */

/**
 * Created by Vincent on 29/09/2015.
 */
import DisplayZone from './canvas/DisplayZone';
import * as util from './misc/util';

export default class DetectedColor {
    constructor(color, sound) {
        this.color = color;
        this.sound = sound;
        this.posX = 0;
        this.posY = 0;
        this.detection = { color: '', x: 0, y: 0, width: 0, height: 0 };
        this.resetDetection();

        this.init();
    }

    /**
     * Init
     * @return {void}
     */

    init() {
        // do something
    }
    
    render() {

        
        window.requestAnimationFrame(this.render.bind(this));
    }

    /**
     * Set the X and Y osition of color detected
     * @param {number} posY
     * @return {void}
     */

    setPos(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }
    
    setDetection(rect, canvas) {
        if(workshop.webCamDimensions) {
            this.detection.color = rect.color;
            this.detection.x = (rect.x * 100 / workshop.webCamDimensions.width) * canvas.width / 100;
            this.detection.y = (rect.y * 100 / workshop.webCamDimensions.height) * canvas.height / 100;
            this.detection.width = (rect.width * 100 / workshop.webCamDimensions.width) * canvas.width / 100;
            this.detection.height = (rect.height * 100 / workshop.webCamDimensions.height) * canvas.height / 100;
        } else {
            this.detection = rect;
        }
    }
    
    resetDetection() {
        this.detection.width = 0;
        this.detection.height = 0;
    }

    /**
     * Call when position changed
     * @param {number} posY
     * @return {void}
     */

    updateEffects(){

        this.updateSounds();
    }

    /**
     * Call when color leave the screen
     * @param {number} posY
     * @return {void}
     */

    removeEffects(){
        this.sound.setVolume(0);
    }

    /**
     * Update about sound
     * @return {void}
     */

    updateSounds(){
        this.sound.setVolume(1);

        if(workshop.webCamDimensions) {
            if (this.posY != 0 && this.posY > workshop.webCamDimensions.height / 2) {
                var value = workshop.webCamDimensions.height - this.posY;
                this.sound.setBiQuad('lowpass', value * 30);
            }
            if (this.posY != 0 && this.posY < workshop.webCamDimensions.height / 2) {
                var value = workshop.webCamDimensions.height / 2 - this.posY;
                this.sound.setBiQuad('highpass', value * 10);
            }
            if (this.posX != 0) {
                this.sound.setQ(this.posX / 20);
            }
        }
    }

}