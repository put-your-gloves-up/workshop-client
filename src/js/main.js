/**
 * Created by jerek0 on 07/05/2015.
 */

import NetworkManager from "./network/NetworkManager";
import WebcamManager from "./WebcamManager";
import * as util from "./misc/util";
import $ from "jquery";
import Sound from "./audio/Sound";
import DetectedColor from "./DetectedColor";

var app = {
    
    webcamManagers: null,
    
    init: function () {
        window.workshop = {};

        var scope = this;
        
        this.initWebcamManagers();

        this.getLocalWebcam(function() {
            scope.initNetwork.bind(scope).call();
            scope.initSound.bind(scope, scope.initColorTracker.bind(scope)).call();
            scope.loadSounds.bind(scope).call();
        });

        this.bindUIActions();
    },

    /* #################
     *
     * INTERFACE RELATED
     *
     * ################# */

    bindUIActions: function() {
        this.registerNetworkUI();
        this.registerCityChoose();
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
    
    registerCityChoose() {
        var $b = $('body'),
            $networkUI = $('.network-ui'),
            $citiesChooseWrapper = $('.city-choose-wrapper ',$networkUI),
            cities = ['annecy','grenoble'];
        
        for(var i=0; i < cities.length; i++)
            $citiesChooseWrapper.append('<a href="#" class="btn">'+cities[i]+'</a> ');

        $citiesChooseWrapper.on('click','.btn', function() {
            // BTN toggle
            $('.btn', $citiesChooseWrapper).toggleClass('active',false);
            $(this).toggleClass('active',true);
            
            // BODY toggle
            for(var i=0; i < cities.length; i++)
                $b.toggleClass(cities[i]+'-active',false);
            $b.toggleClass($(this).text()+'-active',true);
        });
    },
    
    toggleIdle(value) {
        if(value === true || value === false)
            $('body').toggleClass('idle',value);
        else
            $('body').toggleClass('idle');
    },

    /* #################
     *
     * MATERIAL RELATED
     *
     * ################# */

    initWebcamManagers: function() {
        this.webcamManagers = {
            local: new WebcamManager('#myCanvas','#myVideo', '#myVisualizer'),
            distant: new WebcamManager('#distCanvas','#distVideo', '#distVisualizer')
        }
    },

    getLocalWebcam: function (cb) {
        var scope = this;

        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        // Put user's video directly into #myVideo
        navigator.getUserMedia({
                video: true,
                audio: false
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
                    console.log(workshop.webCamDimensions);
                    $('#myVideo').toggleClass('video-small', false);
                    for(var current in scope.webcamManagers) {
                        scope.webcamManagers[current].initCanvas();
                    }
                }, 1000);
            };

            cb && cb();

        }, util.log);
    },

    /* #################
     *
     * NETWORK RELATED
     *
     * ################# */
    
    initNetwork: function () {
        this.networkManager = new NetworkManager();
    },

    /* #################
     *
     * COLORS RELATED
     *
     * ################# */

    initColorTracker: function() {
        // Define local colors
        this.webcamManagers.local.addDetectedColor(new DetectedColor('magenta', new Sound('audio/PO_DualBass120C-02.wav', this.audioContext), 100, 100));
        this.webcamManagers.local.addDetectedColor(new DetectedColor('yellow', new Sound('audio/PO_BeatAmpedA120-02.wav', this.audioContext), 100, 100));
        this.webcamManagers.local.addDetectedColor(new DetectedColor('red', new Sound('audio/PO_Massaw120C-02.mp3', this.audioContext), 100, 100));
        this.webcamManagers.local.addDetectedColor(new DetectedColor('blue', new Sound('audio/PO_CymbalsA120-01.mp3', this.audioContext), 100, 100));

        // Define distant colors
        this.webcamManagers.distant.addDetectedColor(new DetectedColor('magenta', new Sound('audio/PO_DualBass120C-02.wav', this.audioContext), 100, 100));
        this.webcamManagers.distant.addDetectedColor(new DetectedColor('yellow', new Sound('audio/PO_BeatAmpedA120-02.wav', this.audioContext), 100, 100));
        this.webcamManagers.distant.addDetectedColor(new DetectedColor('red', new Sound('audio/PO_Massaw120C-02.mp3', this.audioContext), 100, 100));
        this.webcamManagers.distant.addDetectedColor(new DetectedColor('blue', new Sound('audio/PO_CymbalsA120-01.mp3', this.audioContext), 100, 100));

        // Add custom color trackers
        tracking.ColorTracker.registerColor('red', function(r, g, b) {
            if (r > 100 && g < 60 && b < 50) {
                return true;
            }
            return false;
        });

        tracking.ColorTracker.registerColor('blue', function(r, g, b) {
            if (r < 60 && g < 100 && b > 100) {
                return true;
            }
            return false;
        });
        
        // Track on local webcam only
        this.webcamManagers.local.trackColors();
    },
    
    onColorTrack() {
        if(this.webcamManagers.local.active || this.webcamManagers.distant.active) {
            window.reactivatingIdle && clearTimeout(window.reactivatingIdle);
            window.reactivatingIdle = false;
            if($('body').hasClass('idle')) this.toggleIdle(false);
        } else if(!this.webcamManagers.local.active || !this.webcamManagers.distant.active) {
            if(!window.reactivatingIdle)
                window.reactivatingIdle = setTimeout(this.toggleIdle.bind(this, true), 10000);
        }
    },

    /* #################
     *
     * SOUND RELATED
     *
     * ################# */
    
    initSound: function(cb) {
        // Define audio context
        window.AudioContext = window.AudioContext ||
        window.webkitAudioContext;

        this.audioContext = new AudioContext();

        cb && cb();
    },

    /**
     * Load sample for each detected color
     * @return {void}
     */

    loadSounds: function(){
        var i = 0,
            scope = this;
        
        for(var current in scope.webcamManagers){
            scope.webcamManagers[current].loadSounds(function() {
                i++;
                if (i == Object.keys(scope.webcamManagers).length) {
                    scope.isReady = true;
                    scope.playSound();
                }
            })
        }
    },

    /**
     * Play all song in same time
     * @return {void}
     */

    playSound: function() {
        var scope = this;
        if (scope.isReady) {
            for(var current in scope.webcamManagers) {
                for (var color in scope.webcamManagers[current].detectedColors) {
                    scope.webcamManagers[current].detectedColors[color].sound.playSound();
                }
                scope.webcamManagers[current].initSpectralCanvas();
            }
        }
    }
};

app.init();
workshop.app = app;
