/**
 * Created by jerek0 on 07/05/2015.
 */

import NetworkManager from "./network/NetworkManager";

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

var networkManager = new NetworkManager();

/**
 * Created by Vincent on 29/09/2015.
 */

import Sound from "./classes/Sound";

tracking.ColorTracker.registerColor('red', function(r, g, b) {
    if (r > 100 && g < 50 && b < 50) {
        return true;
    }
    return false;
});

var colors = new tracking.ColorTracker(['magenta', 'cyan', 'yellow', 'red']);

// Define audio context
window.AudioContext = window.AudioContext ||
window.webkitAudioContext;

var context = new AudioContext();
// Define sounds
var bass = new Sound('audio/PO_DualBass120C-02.wav', context);
var beats = new Sound('audio/PO_BeatAmpedA120-02.wav', context);
var synth = new Sound('audio/PO_Massaw120E-02.wav', context);
//synth.startDistorsion();

colors.on('track', function(event) {
    if (event.data.length === 0) {

        bass.setVolume(0);
        beats.setVolume(0);
        synth.setVolume(0);

    } else {

        bass.setVolume(0);
        beats.setVolume(0);
        synth.setVolume(0);

        event.data.forEach(function(rect) {

            switch(rect.color) {

                case 'magenta' :
                    bass.setVolume(1);
                    break;

                case 'yellow' :
                    beats.setVolume(0.6);
                    break;

                case 'red' :
                    synth.setVolume(0.2);
                    break;

            }

            //console.log(rect.x, rect.y, rect.height, rect.width, rect.color);
        });
    }
});

tracking.track('#myVideo', colors, { camera: true });
