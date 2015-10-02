/**
 * Created by jerek0 on 01/10/15.
 */

import Particle from './Particle';

export default class ParticlesEmitter {
    constructor(detectedColor) {
        this.detectedColor = detectedColor;
        this.updatePos();
        this.active = false;
        this.nbOfParticles = 100;
        this.particles = [];
        
        for(var i = 0; i<this.nbOfParticles;i++) {
            this.particles.push(new Particle(this));
        }
    }
    
    updatePos() {
        this.x = this.detectedColor.detection.x + this.detectedColor.detection.width/2;
        this.y = this.detectedColor.detection.y + this.detectedColor.detection.height/2;
    }
    
    render(context) {
        
        for(var i = 0; i < this.particles.length; i++) {
            
            this.particles[i].update();
            this.particles[i].render(context);
            
            if(this.particles[i].isDead() && this.detectedColor.sound.getVolume()>0.5) this.particles[i].rebirth(this.x,this.y);
            
        }
    }
    
}