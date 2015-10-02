/**
 * Created by Vincent on 30/09/2015.
 */

/**
 * Created by Vincent on 29/09/2015.
 */
import DisplayZone from './canvas/DisplayZone';
import * as util from './misc/util';

/**
 * Instance of each color which can be detected *
 * Manages the color's sample, it's detected positions and applies sound effects *
 */
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

    /**
     * Set the X and Y position of color detected
     * @param {number} posY
     * @return {void}
     */

    setPos(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }

    /**
     * Sets detection property which allows to position our detectedColor relatively *
     * to the actual size of the canvas/video and not to the size wich tracking.js   *
     * uses to detect colors *
     * 
     * Basically converts all the tracking.js coords to our FO coords :) *
     * @param rect
     * @param canvas
     */
    setDetection(rect, canvas) {
        if(workshop.webCamDimensions) {
            this.detection.color = rect.color;
            this.detection.x = (rect.x * 100 / workshop.webCamDimensions.width) * canvas.width / 100;
            this.detection.y = (rect.y * 100 / workshop.webCamDimensions.height) * canvas.height / 100;
            this.detection.width = (rect.width * 100 / workshop.webCamDimensions.width) * canvas.width / 100;
            this.detection.height = (rect.height * 100 / workshop.webCamDimensions.height) * canvas.height / 100;
        } else { // If we do not have webcamDimensions yet, nevermind, use the given coords for now :)
            this.detection = rect;
        }
    }

    /**
     * Allows to disable current detection by setting it's size to 0 *
     */
    resetDetection() {
        this.detection.width = 0;
        this.detection.height = 0;
    }

    /**
     * Called each time this color is actually detected
     * @param {number} posY
     * @return {void}
     */
    updateEffects(){
        this.updateSounds();
    }

    /**
     * Called when color is not detected
     * @param {number} posY
     * @return {void}
     */
    removeEffects(){
        // On coupe le son ...
        this.sound.setVolume(0);
    }

    /**
     * Update about sound
     * @return {void}
     */

    updateSounds(){
        // ... et on remet le son !
        this.sound.setVolume(1);

        // If we have webcamDimensions, put some effects on this sound ;)
        if(workshop.webCamDimensions) {
            
            // LOW PASS Effect - Effective on the bottom half of the detection area
            // Keep only low frequencies of the sound (loud effect)
            if (this.posY != 0 && this.posY > workshop.webCamDimensions.height / 2) {
                var value = workshop.webCamDimensions.height - this.posY;
                this.sound.setBiQuad('lowpass', value * 30);
            }

            // HIGH PASS Effect - Effective on the top half of the detection area
            // Keep only high frequencies of the sound (cellphone effect)
            if (this.posY != 0 && this.posY < workshop.webCamDimensions.height / 2) {
                var value = workshop.webCamDimensions.height / 2 - this.posY;
                this.sound.setBiQuad('highpass', value * 10);
            }
            
            // QUALITY Effect - Reduces the quality when going on the right side of the detection area
            // Warning -> the detection area is reversed in FO (transform: scaleX(-1)), so you actually have to go on the left side of the screen to lower the quality...
            // Produces some weird but fun noises
            if (this.posX != 0) {
                this.sound.setQ(this.posX / 20);
            }
        }
    }

}