/**
 * Created by jerek0 on 01/10/15.
 */
import $ from 'jquery';
import WebcamCanvas from './canvas/WebcamCanvas';
import SpectralCanvas from './canvas/SpectralCanvas';

/**
 * Instance for each webcam used in FO (local and distant in our case) *
 */
export default class WebcamManager {

    constructor(canvas, video, spectralCanvas) {
        this.canvasId = canvas;
        this.canvas = $(this.canvasId)[0];
        this.videoId = video;
        this.video = $(this.videoId)[0];
        this.spectralCanvasId = spectralCanvas;
        this.spectralCanvas = $(spectralCanvas)[0];
        this.active = false;
        
        this.detectedColors = {};
    }
    
    // The WebcamManager's main canvas is used to show detected sounds' positions and colors
    initCanvas() {
        this.canvasManager = new WebcamCanvas(this.canvas,this.video, this.detectedColors);
    }

    // The WebcamManager's spectral canvas represents the spectral view of each sounds toggled
    initSpectralCanvas() {
        this.spectralCanvasManager = new SpectralCanvas(this.spectralCanvas, this.detectedColors);
    }

    /** ########################
     * COLOR TRACKING RELATEDS *
     * ####################### */

    /**
     * Adds a color which can be detected by tracking.js *
     * @param detectedColor
     */
    addDetectedColor(detectedColor) {
        this.detectedColors[detectedColor.color] = detectedColor;
    }

    /**
     * If asked, the WebcamManager's able to track colors on it's video *
     */
    trackColors() {
        var scope = this,
            colorsToTrack = [],
            colors;
        
        for(var key in this.detectedColors) {
            colorsToTrack.push(this.detectedColors[key].color);
        }
        
        colors = new tracking.ColorTracker(colorsToTrack);
        tracking.track(this.videoId, colors);
        
        colors.on('track', function(e) {
            e.workshopData = "local";
            scope.onColorTrack.bind(scope, e).call();
            e.workshopData = "distant";
            workshop.app.networkManager.cid && workshop.app.networkManager.sendData({ targetId: workshop.app.networkManager.cid, type: 'colorsTrack', event: e });
        });
    }

    /**
     * Launched on each completed tracking analysis on the WebcamManager's video *
     * @param event
     */
    onColorTrack (event) {
        var scope = this;

        this.canvasManager && this.canvasManager.resetCanvas();

        for(var color in this.detectedColors){
            this.detectedColors[color].removeEffects();
            this.detectedColors[color].resetDetection();
        }

        if (event.data.length != 0) {
            this.active = true;
            event.data.forEach(function(rect) {
                for(var color in scope.detectedColors) {
                    if (rect.color == color) {
                        scope.detectedColors[rect.color].setPos(rect.x, rect.y);
                        scope.detectedColors[rect.color].setDetection(rect, scope.canvas);
                        scope.detectedColors[rect.color].updateEffects();
                    }
                }
            });
        } else {
            this.active = false;
        }
        
        workshop.app.onColorTrack();
    }

    /** ###############
     * SOUND RELATEDS *
     * ############## */

    /**
     * Loads all sounds used by the WebcamManager *
     * @param cb
     */
    loadSounds(cb) {
        var scope = this,
            i = 0;
        
        for(var color in this.detectedColors) {
            scope.loadSound(scope.detectedColors[color], function () {
                i++;
                if (i == Object.keys(scope.detectedColors).length) {
                    cb && cb();
                }
            });
        }
    }

    /**
     * Load one given color's sound
     * @param color - The given detectedColor object *
     * @param cb - Function to call when sound's actually loaded *
     * @return {void}
     */
    loadSound (color, cb){
        color.sound.loadSound(function(){
            cb && cb();
        });
    }
    
}