/**
 * Created by jerek0 on 07/05/2015.
 */

import NetworkManager from "./managers/NetworkManager";
import WebcamManager from "./managers/WebcamManager";
import * as util from "./misc/util";
import $ from "jquery";
import Sound from "./audio/Sound";
import DetectedColor from "./misc/DetectedColor";

var app = {
    
    webcamManagers: null,

    /**
     * Launches the app *
     */
    init: function () {
        window.workshop = {};

        var scope = this;
        
        // Firstly, we fill our webcamManagers array
        this.initWebcamManagers();

        // Then, we ask for the user's camera
        this.getLocalWebcam(function() {
            // Once it's done, we launch the networkmanager
            scope.initNetwork.bind(scope).call();
            // Finally, we launch sounds and search for colors !
            scope.initSound.bind(scope).call();
            scope.initColorTracker.bind(scope).call();
            scope.loadSounds.bind(scope).call();
        });

        // Init interface
        this.bindUIActions();
    },

    /* #################
     *
     * INTERFACE RELATED
     *
     * ################# */

    /**
     * UI Actions global manager *
     */
    bindUIActions: function() {
        this.registerNetworkUI();
        this.registerCityChoose();
    },

    /**
     * UI Actions concerning the .network-ui pop-in *
     */
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

    /**
     * Allows the user to choose his current city *
     */
    registerCityChoose: function() {
        var $b = $('body'),
            $networkUI = $('.network-ui'),
            $citiesChooseWrapper = $('.city-choose-wrapper ',$networkUI),
            cities = ['annecy','grenoble']; // List of cities available
        
        // Append all the cities
        for(var i=0; i < cities.length; i++)
            $citiesChooseWrapper.append('<a href="#" class="btn">'+cities[i]+'</a> ');

        // Click listener, toggling the city chosen
        $citiesChooseWrapper.on('click','.btn', function() {
            // BTN toggle
            $('.btn', $citiesChooseWrapper).toggleClass('active',false);
            $(this).toggleClass('active',true);
            
            // BODY toggle
            for(var i=0; i < cities.length; i++)
                $b.toggleClass(cities[i]+'-active',false);
            $b.toggleClass($(this).text()+'-active',true);
        });
        
        // Choose the first city by default
        $($('.btn',$citiesChooseWrapper)[0]).trigger('click');
    },

    /**
     * Allows to toggle or not the IDLE state of the app *
     * @param value - (Optional) true or false
     */
    toggleIdle: function(value) {
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

    /**
     * Fills the webcamManagers array with their own canvases, videos and visualizers *
     */
    initWebcamManagers: function() {
        this.webcamManagers = {
            local: new WebcamManager('#myCanvas','#myVideo', '#myVisualizer'),
            distant: new WebcamManager('#distCanvas','#distVideo', '#distVisualizer')
        }
    },

    /**
     * Allows to get the local webcam stream and store it in our WORKSHOP global namespace *
     * In order to avoid multiple permissions' asks during the app's use *
     * Used only ONCE *
     * @param cb - function to load when stream has been stored
     */
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

            cb && cb();
            
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
        }, util.log);
    },

    /* #################
     *
     * NETWORK RELATED
     *
     * ################# */

    /**
     * Creates the app's networkManager *
     */
    initNetwork: function () {
        this.networkManager = new NetworkManager();
    },

    /* #################
     *
     * COLORS RELATED
     *
     * ################# */

    /**
     * Init color tracking for the app on local webcamManager *
     */
    initColorTracker: function() {
        // Define local colors to detected and their affected sounds
        this.webcamManagers.local.addDetectedColor(new DetectedColor('magenta', new Sound('audio/PO_DualBass120C-02.wav', this.audioContext)));
        this.webcamManagers.local.addDetectedColor(new DetectedColor('yellow', new Sound('audio/PO_BeatAmpedA120-02.wav', this.audioContext)));
        this.webcamManagers.local.addDetectedColor(new DetectedColor('red', new Sound('audio/PO_Massaw120C-02.mp3', this.audioContext)));
        this.webcamManagers.local.addDetectedColor(new DetectedColor('blue', new Sound('audio/PO_CymbalsA120-01.mp3', this.audioContext)));

        // Define distant colors to receive and their affected sounds
        this.webcamManagers.distant.addDetectedColor(new DetectedColor('magenta', new Sound('audio/PO_DualBass120C-02.wav', this.audioContext)));
        this.webcamManagers.distant.addDetectedColor(new DetectedColor('yellow', new Sound('audio/PO_BeatAmpedA120-02.wav', this.audioContext)));
        this.webcamManagers.distant.addDetectedColor(new DetectedColor('red', new Sound('audio/PO_Massaw120C-02.mp3', this.audioContext)));
        this.webcamManagers.distant.addDetectedColor(new DetectedColor('blue', new Sound('audio/PO_CymbalsA120-01.mp3', this.audioContext)));

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

    /**
     * Called on each color track event which is received *
     * from both local and distant webcamManagers *
     * Allows to switch between ACTIVE and IDLE state if there is or not *
     * activity since 10 last seconds *
     * 
     * TODO - Not so clean ^ *
     */
    onColorTrack: function() {
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
    
    /**
     * Allows to get AudioContext and to store it *
     */
    initSound: function() {
        // Define audio context
        window.AudioContext = window.AudioContext ||
        window.webkitAudioContext;

        this.audioContext = new AudioContext();
    },

    /**
     * Loads sample for each detected color
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
     * Launch all available sounds at the same time to be synced
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
