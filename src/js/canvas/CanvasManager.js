/**
 * Created by jerek0 on 30/09/15.
 */

import $ from 'jquery';

export default class CanvasManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.myCanvas = $('#myCanvas')[0];
        var myVideo = $('#myVideo')[0];
        this.myCanvas.style.width = myVideo.clientWidth+'px';
        this.myCanvas.style.height = myVideo.clientHeight+'px';

        this.myCanvas.width = myVideo.clientWidth;
        this.myCanvas.height = myVideo.clientHeight;

        this.canvasContext = this.myCanvas.getContext('2d');
    }
    
    resetCanvas() {
        this.canvasContext.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
    }
    
    onDetectedColor(rect) {
        var overlay = {};
        overlay.color = rect.color;
        overlay.x = (rect.x * 100 / workshop.webCamDimensions.width) * this.myCanvas.width / 100;
        overlay.y = (rect.y * 100 / workshop.webCamDimensions.height) * this.myCanvas.height / 100;
        overlay.width = (rect.width * 100 / workshop.webCamDimensions.width) * this.myCanvas.width / 100;
        overlay.height = (rect.height * 100 / workshop.webCamDimensions.height) * this.myCanvas.height / 100;

        this.canvasContext.strokeStyle = overlay.color;
        this.canvasContext.strokeRect(overlay.x, overlay.y, overlay.width, overlay.height);
        this.canvasContext.font = '11px Helvetica';
        this.canvasContext.fillStyle = "#fff";
        this.canvasContext.fillText('x: ' + overlay.x + 'px', overlay.x + overlay.width + 5, overlay.y + 11);
        this.canvasContext.fillText('y: ' + overlay.y + 'px', overlay.x + overlay.width + 5, overlay.y + 22);
    }
    
}