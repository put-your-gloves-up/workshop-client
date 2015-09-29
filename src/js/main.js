/**
 * Created by jerek0 on 07/05/2015.
 */

import NetworkManager from "./network/NetworkManager";
import * as util from "./misc/util"
import $ from "jquery";
import Sound from "./audio/Sound";

var app = {
    init: function () {
        window.workshop = {};
        
        var scope = this;
        
        this.getLocalWebcam(function() {
            scope.initNetwork.bind(scope).call();
            scope.initSound.bind(scope, scope.initColorTracker.bind(scope)).call();
        });
        
        this.bindUIActions();
    },
    
    bindUIActions: function() {
        this.registerNetworkUI();
    },
    
    registerNetworkUI: function() {
        window.addEventListener('keydown', function(e) {
            switch(e.keyCode) {
                case 32: // SPACE
                    $('.network-ui').toggleClass('hidden');
                    break;
                
                default:
                    console.log(e.keyCode);
                    break;
            }
        });
    },
    
    getLocalWebcam: function (cb) {
        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        // Put user's video directly into #myVideo
        navigator.getUserMedia({video: true, audio: true}, function (localMediaStream) {
            var video = document.querySelector('#myVideo');
            video.src = window.URL.createObjectURL(localMediaStream);

            workshop.localWebcamStream = localMediaStream;

            // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
            // See crbug.com/110938.
            video.onloadedmetadata = function (e) {
                // Ready to go. Do some stuff.
                setTimeout(function () {
                    $('#myVideo').toggleClass('video-small', false);
                }, 1000);
            };

            cb && cb();

        }, util.log);
    },

    initNetwork: function () {
        this.networkManager = new NetworkManager();
    },

    initSound: function(cb) {
        // Define audio context
        window.AudioContext = window.AudioContext ||
        window.webkitAudioContext;

        this.audioContext = new AudioContext();
        // Define sounds
        this.bass = new Sound('audio/PO_DualBass120C-02.wav', this.audioContext);
        this.beats = new Sound('audio/PO_BeatAmpedA120-02.wav', this.audioContext);
        this.synth = new Sound('audio/PO_Massaw120E-02.wav', this.audioContext);

        cb && cb();
    },
    
    initColorTracker: function() {
        var scope = this;
        
        tracking.ColorTracker.registerColor('red', function(r, g, b) {
            if (r > 100 && g < 50 && b < 50) {
                return true;
            }
            return false;
        });
        
        var colors = new tracking.ColorTracker(['magenta', 'cyan', 'yellow', 'red']);
        colors.on('track', function(event) {
            if (event.data.length === 0) {

                scope.bass.setVolume(0);
                scope.beats.setVolume(0);
                scope.synth.setVolume(0);

            } else {

                scope.bass.setVolume(0);
                scope.beats.setVolume(0);
                scope.synth.setVolume(0);

                event.data.forEach(function(rect) {

                    switch(rect.color) {

                        case 'magenta' :
                            scope.bass.setVolume(1);
                            break;

                        case 'yellow' :
                            scope.beats.setVolume(0.6);
                            break;

                        case 'red' :
                            scope.synth.setVolume(0.2);
                            break;

                    }
                    //console.log(rect.x, rect.y, rect.height, rect.width, rect.color);
                });
            }
        });

        tracking.track('#myVideo', colors);
    }
};

app.init();
