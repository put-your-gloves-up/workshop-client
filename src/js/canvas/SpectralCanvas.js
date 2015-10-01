/**
 * Created by Vincent on 01/10/2015.
 */

import $ from 'jquery';
import * as util from '../misc/util';

export default class SpectralCanvas {
    constructor(canvas, detectedColors) {
        this.canvas = canvas;
        this.detectedColors = detectedColors;

        this.render();
    }

    render() {

        window.requestAnimationFrame(this.render);
    }
}