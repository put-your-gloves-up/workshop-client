/**
 * Created by jerek0 on 07/05/2015.
 */

import NetworkManager from "./network/NetworkManager";
import CanvasManager from "./canvas/CanvasManager";
import * as util from "./misc/util";
import $ from "jquery";
import Sound from "./audio/Sound";
import DetectedColor from "./DetectedColor";

var app = {
    init: function () {
        window.workshop = {};
        
        var scope = this;
        
        this.getLocalWebcam(function() {
            scope.initNetwork.bind(scope).call();
            scope.initSound.bind(scope, scope.initColorTracker.bind(scope)).call();
            scope.loadSounds.bind(scope).call();
        });
        
        this.bindUIActions();
    },
    
    bindUIActions: function() {
        this.registerNetworkUI();
    },
    
    registerNetworkUI: function() {
        var $networkUI = $('.network-ui');
        
        $('.close', $networkUI).on('click', function(e) {
            $networkUI.toggleClass('hidden',true);
        });
        
        window.addEventListener('keydown', function(e) {
            switch(e.keyCode) {
                case 32: // SPACE
                    $networkUI.toggleClass('hidden');
                    break;
                
                default:
                    console.log(e.keyCode);
                    break;
            }
        });
    },
    
    getLocalWebcam: function (cb) {
        var scope = this;
        
        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        // Put user's video directly into #myVideo
        navigator.getUserMedia({video: true, audio: false}, function (localMediaStream) {
            var video = document.querySelector('#myVideo');
            video.src = window.URL.createObjectURL(localMediaStream);

            workshop.localWebcamStream = localMediaStream;
            // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
            // See crbug.com/110938.
            video.onloadedmetadata = function (e) {
                // Ready to go. Do some stuff.
                setTimeout(function () {
                    workshop.webCamDimensions = { width: video.clientWidth, height: video.clientHeight };
                    $('#myVideo').toggleClass('video-small', false);
                    scope.initCanvas();
                }, 1000);
            };

            cb && cb();

        }, util.log);
    },

    initNetwork: function () {
        this.networkManager = new NetworkManager();
    },
    
    initCanvas: function() {
        this.canvasManager = new CanvasManager();
    },

    initSound: function(cb) {
        // Define audio context
        window.AudioContext = window.AudioContext ||
        window.webkitAudioContext;

        this.audioContext = new AudioContext();

        cb && cb();
    },

    initColorTracker: function() {

        var scope = this;

        scope.ColorsDetected = {};

        scope.ColorsDetected['red'] = new DetectedColor('magenta', new Sound('audio/PO_DualBass120C-02.wav', scope.audioContext), 100, 100);
        scope.ColorsDetected['yellow'] = new DetectedColor('yellow', new Sound('audio/PO_BeatAmpedA120-02.wav', scope.audioContext), 100, 100);
        scope.ColorsDetected['magenta'] = new DetectedColor('red', new Sound('audio/PO_Massaw120C-02.wav', scope.audioContext), 100, 100);
        
        tracking.ColorTracker.registerColor('red', function(r, g, b) {
            if (r > 100 && g < 50 && b < 50) {
                return true;
            }
            return false;
        });
        
        var colors = new tracking.ColorTracker(['magenta',  'yellow', 'red']);

        colors.on('track', function(event) {
            scope.canvasManager && scope.canvasManager.resetCanvas();
            if (event.data.length === 0) {

                for(var color in scope.ColorsDetected){
                    scope.ColorsDetected[color].removeEffects();
                }

            } else {

                for(var color in scope.ColorsDetected){
                    scope.ColorsDetected[color].removeEffects();
                }

                event.data.forEach(function(rect) {
                    for(var color in scope.ColorsDetected) {
                        if (rect.color == color) {
                            scope.ColorsDetected[rect.color].setPos(rect.x, rect.y);
                            scope.ColorsDetected[rect.color].updateEffects();
                        }
                    }
                    
                    scope.canvasManager && scope.canvasManager.onDetectedColor(rect);
                });
            }
        });

        tracking.track('#myVideo', colors);
    },

    /**
     * Load sample for each detected color
     * @return {void}
     */

    loadSounds: function(){
        var i = 0;
        var scope = this;
        for(var color in scope.ColorsDetected){
            scope.loadSound(scope.ColorsDetected[color], function(){
                i++;
                if(i == Object.keys(scope.ColorsDetected).length){
                    scope.isReady = true;
                    scope.playSound();
                }
            });
        }

    },

    /**
     * Load sound
     * @return {void}
     */

    loadSound: function(color, cb){
        var scope = this;
        color.sound.loadSound(function(){
            cb && cb();
        });

    },

    /**
     * Play all song in same time
     * @return {void}
     */

    playSound: function(){
        var scope = this;
        if(scope.isReady){
            for(var color in scope.ColorsDetected){
                scope.ColorsDetected[color].sound.playSound();
            }
        }
    }
};

app.init();
workshop.app = app;
