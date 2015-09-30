/**
 * Created by Vincent on 29/09/2015.
 */

export default class Sound {
    constructor(url, context) {
        this.url = url;
        this.context = context;

        this.init();
    }

    /**
     * Init
     * @return {void}
     */

    init() {
        this.loadSound(this.url);
    }

    /**
     * Set Volume
     * @param {Number} level
     * @return {void}
     */

    setVolume(level){
        if(this.volume){
            this.volume.gain.value = level;
        }
    }

    /**
     * Set Lowpass
     * @param {String} type
     * @param {Number} frequency
     * @return {void}
     */

    setBiQuad(type, frequency){
        if(this.biquad){
            this.biquad.frequency.value = frequency;
            this.biquad.type = type;
        }
    }

    /**
     * Set Lowpass
     * @param {Number} level
     * @return {void}
     */

    setQ(q){
        if(this.biquad){
            this.biquad.Q.value = q;
        }
    }

    /**
     * Connect filters and play sound
     * @param {Object} buffer
     * @return {void}
     */

    loadSound(url){
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        var self = this;

        request.onload = function() {
            self.context.decodeAudioData( request.response,
                function(buffer) {
                    self.playSound(buffer);
                }, function(){});
        }
        request.send();
    }

    /**
     * Connect filters and play sound
     * @param {Object} buffer
     * @return {void}
     */

    playSound(buffer){
        if(buffer){
            this.source = this.context.createBufferSource();
            this.source.buffer = buffer;

            // Define filters
            this.volume = this.context.createGain();
            this.volume.gain.value = 0;

            var analyser = this.context.createAnalyser();
            var distortion = this.context.createWaveShaper();
            distortion.curve = this.makeDistorsionCurve(0);

            this.biquad = this.context.createBiquadFilter();
            this.biquad.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
            this.biquad.frequency.value = 100; // Set cutoff to 440 HZ

            // Apply filters
            this.source.connect(analyser);
            analyser.connect(distortion);
            distortion.connect(this.biquad);
            this.biquad.connect(this.volume);
            this.volume.connect(this.context.destination);

            this.source.loop = true;
            this.source.start(0);
        }
    }

    /**
     * Generate a distorition curve
     * @param {number} amount
     * @return {array}
     */

    makeDistorsionCurve(amount){
        var k = typeof amount === 'number' ? amount : 50,
            n_samples = 44100,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180,
            i = 0,
            x;
        for ( ; i < n_samples; ++i ) {
            x = i * 2 / n_samples - 1;
            curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
        }
        return curve;
    }


}