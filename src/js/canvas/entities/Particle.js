/**
 * Created by jerek0 on 01/10/15.
 */

export default class Particle {
    constructor(emitter) {
        this.emitter = emitter;
        this.size = 40;
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

        this.life-=0.1;
    }
    
    render(context) {
        var color = { r: 255, g: 255, b: 255 };
        switch(this.emitter.detectedColor.color) {
            case 'red':
                color = { r: 255, g: 0, b: 0};
                break;
            case 'yellow':
                color = { r: 255, g: 255, b: 0};
                break;
            case 'magenta':
                color = { r: 255, g: 0, b: 255};
                break;
            case 'cyan':
                color = { r: 0, g: 255, b: 255};
                break;
        }
        
        context.beginPath();
        context.fillStyle = 'rgba('+color.r+','+color.g+','+color.b+','+this.life+')';
        context.arc(this.x, this.y, this.size/2, 0, Math.PI * 2, false);
        context.fill();
    }
    
}