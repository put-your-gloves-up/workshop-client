/**
 * Created by Vincent on 01/10/2015.
 */

import $ from 'jquery';
import * as util from '../misc/util';

export default class SpectralCanvas {
    constructor(canvas, detectedColors) {
        this.canvas = canvas;
        this.detectedColors = detectedColors;
        this.bufferLength = 256;
        this.init();
    }

    /**
     * Init canvas and analyser
     * @return {void}
     */

    init(){
        this.visualizer = this.canvas;
        this.visualizer.width = $('.spectral-canvas')[0].clientWidth;
        this.visualizer.height = $('.spectral-canvas')[0].clientHeight;
        this.visualizerCtx = this.canvas.getContext("2d");

        this.dataArray = new Uint8Array(this.bufferLength);

        this.render();
    }

    /**
     * Render the spectrum in canvas
     * @return {void}
     */

    render() {
        this.width = this.visualizer.width;
        this.height = this.visualizer.height;

        // clean
        this.visualizerCtx.clearRect(0, 0, this.width, this.height);
        this.j = 0;

        for(var color in this.detectedColors){

            // iterator
            this.j++;

            // get color
            this.color = this.detectedColors[color].color;
            this.colorRGB = util.colorsToRGB[this.detectedColors[color].color];

            // retrieve analyser and volume
            this.analyser = this.detectedColors[color].sound.getAnalyser();
            this.volume = this.detectedColors[color].sound.getVolume();

            // get data
            this.analyser.getByteFrequencyData(this.dataArray);

            // draw
            var barWidth = (this.width / this.bufferLength) * 2.5;
            var barHeight;
            var x = barWidth/2 * this.j - barWidth/2;

            for(var i = 0; i < this.bufferLength; i++) {
                barHeight = this.dataArray[i];

                this.visualizerCtx.fillStyle = 'rgba(' + this.colorRGB.r + ',' + this.colorRGB.g + ',' + this.colorRGB.b + ', 0.6 )';
                this.visualizerCtx.fillRect(x,(this.height-barHeight/2) * (1/this.volume), barWidth, (barHeight/2));

                x += barWidth * 1.5;
            }

        }

        this.drawVisual = requestAnimationFrame(this.render.bind(this));
    }
}