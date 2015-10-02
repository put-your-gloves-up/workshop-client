/**
 * Created by jerek0 on 01/10/15.
 */

import * as util from '../../misc/util';

export default class Particle {
    constructor(emitter) {
        this.emitter = emitter;
        this.size = (0.5+Math.random() * 0.5 * 100);
        this.life = 100;
        
        this.rebirth();
    }
    
    isDead() {
        return (this.life <= 0);
    }
    
    rebirth(x,y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random()*2-1)*2;
        this.vy = (Math.random()*2-1)*2;
        this.life = 0.5+(Math.random()*0.5);
    }
    
    update() {
        this.x+=this.vx;
        this.y+=this.vy;

        this.life-=0.04;
    }
    
    render(context) {
        context.beginPath();
        context.fillStyle = 'rgba('+util.colorsToRGB[this.emitter.detectedColor.color].r+','+util.colorsToRGB[this.emitter.detectedColor.color].g+','+util.colorsToRGB[this.emitter.detectedColor.color].b+','+this.life+')';
        context.arc(this.x, this.y, this.size/2, 0, Math.PI * 2, false);
        context.fill();
    }
    
}