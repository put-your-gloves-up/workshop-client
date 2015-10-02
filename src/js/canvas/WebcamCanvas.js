/**
 * Created by jerek0 on 30/09/15.
 */
import * as util from '../misc/util';
import ParticlesEmitter from './entities/ParticlesEmitter';
import $ from 'jquery';

export default class WebcamCanvas {
    constructor(canvas, video, detectedColors) {
        this.canvas = canvas;
        this.video = video;
        this.detectedColors = detectedColors;
        this.emitters = {};
        this.updateSize();
        this.debug = false;

        this.init();
    }

    init() {
        this.fillEmitters();
        this.updateSize();
        
        this.render();
    }
    
    fillEmitters() {
        for(var key in this.detectedColors) {
            this.emitters[key] = new ParticlesEmitter(this.detectedColors[key]);
        }
    }
    
    render() {
        this.resetCanvas();

        for(var key in this.emitters) {
            if(this.debug) {
                this.onDetectedColor(this.emitters[key].detectedColor.detection);
            } else {
                this.emitters[key].updatePos();
                this.emitters[key].render(this.canvasContext);
            }
        }

        window.requestAnimationFrame(this.render.bind(this));
    }

    updateSize() {
        this.canvas.style.width = this.video.clientWidth+'px';
        this.canvas.style.height = this.video.clientHeight+'px';

        this.canvas.width = this.video.clientWidth;
        this.canvas.height = this.video.clientHeight;
        
        this.canvasContext = this.canvas.getContext('2d');
    }

    resetCanvas() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    onDetectedColor(rect) {
        if(rect.width > 0 && rect.height > 0) {
            this.canvasContext.strokeStyle = rect.color;
            this.canvasContext.strokeRect(rect.x, rect.y, rect.width, rect.height);
            this.canvasContext.font = '11px Helvetica';
            this.canvasContext.fillStyle = "#fff";
            this.canvasContext.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            this.canvasContext.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        }
    }

}