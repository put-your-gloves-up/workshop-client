/**
 * Created by Vincent on 30/09/2015.
 */

/**
 * Created by Vincent on 29/09/2015.
 */

export default class DetectedColor {
    constructor(color, sound, initialPosX, initialPosY) {
        this.color = color;
        this.sound = sound;
        this.initialPosX = initialPosX;
        this.initialPosY = initialPosY;
        this.posX = 0;
        this.posY = 0;

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
     * Set the X and Y osition of color detected
     * @param {number} posY
     * @return {void}
     */

    setPos(posX, posY) {
        this.posX = posX;
        this.posY = posY;
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

        if(this.posY != 0 && this.posY > workshop.webCamDimensions.height/2) {
            var value = workshop.webCamDimensions.height - this.posY;
            this.sound.setBiQuad('lowpass', value * 30);
        }
        if(this.posY != 0 && this.posY < workshop.webCamDimensions.height/2) {
            var value = workshop.webCamDimensions.height/2 - this.posY;
            this.sound.setBiQuad('highpass', value * 10);
        }
        if(this.posX != 0) {
            this.sound.setQ(this.posX /20);
        }
    }

}