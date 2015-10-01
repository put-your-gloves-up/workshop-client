/**
 * Created by jerek0 on 30/09/15.
 */

import $ from 'jquery';

export default class WebcamCanvas {
    constructor(canvas, video) {
        this.canvas = canvas;
        this.video = video;

        this.init();
    }

    init() {
        this.updateSize();
    }

    updateSize() {
        this.canvas.style.width = this.video.clientWidth+'px';
        this.canvas.style.height = this.video.clientHeight+'px';

        this.canvas.width = this.video.clientWidth;
        this.canvas.height = this.video.clientHeight;

        this.canvasContext = this.canvas.getContext('2d');

        console.log(this.canvas.width, this.canvas.height);
    }

    resetCanvas() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    onDetectedColor(rect) {
        var overlay = {};
        overlay.color = rect.color;
        overlay.x = (rect.x * 100 / workshop.webCamDimensions.width) * this.canvas.width / 100;
        overlay.y = (rect.y * 100 / workshop.webCamDimensions.height) * this.canvas.height / 100;
        overlay.width = (rect.width * 100 / workshop.webCamDimensions.width) * this.canvas.width / 100;
        overlay.height = (rect.height * 100 / workshop.webCamDimensions.height) * this.canvas.height / 100;

        this.canvasContext.strokeStyle = overlay.color;
        this.canvasContext.strokeRect(overlay.x, overlay.y, overlay.width, overlay.height);
        this.canvasContext.font = '11px Helvetica';
        this.canvasContext.fillStyle = "#fff";
        this.canvasContext.fillText('x: ' + overlay.x + 'px', overlay.x + overlay.width + 5, overlay.y + 11);
        this.canvasContext.fillText('y: ' + overlay.y + 'px', overlay.x + overlay.width + 5, overlay.y + 22);
    }

}