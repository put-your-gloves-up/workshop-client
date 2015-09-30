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
        navigator.getUserMedia({
            video: true,
            audio: false,
            mandatory: {
                width: { min: 640, max: 640 },
                height: { min: 480, max: 480 }
            }
        }, function (localMediaStream) {
            var video = document.querySelector('#myVideo');
            video.src = window.URL.createObjectURL(localMediaStream);

            workshop.localWebcamStream = localMediaStream;
            // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
            // See crbug.com/110938.
            video.onloadedmetadata = function (e) {
                // Ready to go. Do some stuff.
                setTimeout(function () {
                    workshop.webCamDimensions = {
                        width: video.clientWidth,
                        height: video.clientHeight
                    };
                    $('#myVideo').toggleClass('video-small', false);
                    scope.initCanvas();

                    cb && cb();
                }, 1000);
            };

        }, util.log);
    },

    initNetwork: function () {
        this.networkManager = new NetworkManager();
    },

    initCanvas: function() {
        this.canvasManagers = {
            local: new CanvasManager($('#myCanvas')[0],$('#myVideo')[0]),
            distant: new CanvasManager($('#distCanvas')[0],$('#distVideo')[0])
        }
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

        // Define color
        this.ColorsDetected = {
            local: [],
            distant: []
        };

        for(var current in this.ColorsDetected) {
            this.ColorsDetected[current]['magenta'] = new DetectedColor('magenta', new Sound('audio/PO_DualBass120C-02.wav', this.audioContext), 100, 100);
            this.ColorsDetected[current]['yellow'] = new DetectedColor('yellow', new Sound('audio/PO_BeatAmpedA120-02.wav', this.audioContext), 100, 100);
            this.ColorsDetected[current]['red'] = new DetectedColor('red', new Sound('audio/PO_Massaw120C-02.wav', this.audioContext), 100, 100);
        }

        tracking.ColorTracker.registerColor('red', function(r, g, b) {
            if (r > 100 && g < 50 && b < 50) {
                return true;
            }
            return false;
        });

        var colors = new tracking.ColorTracker(['magenta',  'yellow', 'red']);
        tracking.track('#myVideo', colors);

        colors.on('track', function(e) {
            e.workshopData = "local";
            scope.onColorTrack.bind(scope, e).call();
            e.workshopData = "distant";
            scope.networkManager.sendData({ targetId: scope.networkManager.cid, type: 'colorsTrack', event: e });
        });
    },

    onColorTrack: function(event) {
        var scope = this;

        this.canvasManagers && this.canvasManagers[event.workshopData] && this.canvasManagers[event.workshopData].resetCanvas();

        for(var color in this.ColorsDetected[event.workshopData]){
            this.ColorsDetected[event.workshopData][color].removeEffects();
        }

        if (event.data.length != 0) {
            event.data.forEach(function(rect) {
                for(var color in scope.ColorsDetected[event.workshopData]) {
                    if (rect.color == color) {
                        scope.ColorsDetected[event.workshopData][rect.color].setPos(rect.x, rect.y);
                        scope.ColorsDetected[event.workshopData][rect.color].updateEffects();
                    }
                }

                scope.canvasManagers && scope.canvasManagers[event.workshopData] && scope.canvasManagers[event.workshopData].onDetectedColor(rect);
            });
        }
    }
};

app.init();
workshop.app = app;