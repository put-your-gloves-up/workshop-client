/**
 * Created by Vincent on 29/09/2015.
 */
import gsap from 'gsap';

export default class Sound {
    constructor(url, context) {
        this.url = url;
        this.context = context;
        this.buffer;

        this.init();
    }

    /**
     * Init
     * @return {void}
     */

    init() {
        //this.loadSound(this.url);
    }

    /**
     * Set Volume
     * @param {Number} level
     * @return {void}
     */

    setVolume(level){
        if(this.volume){

            gsap.to(this.volume.gain, 1, {
                value: level,
                ease:Circ.easeOut
            });
        }
    }
    
    getVolume() {
        return this.volume.gain.value;
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
     * @return {void}
     */

    loadSound(cb){
        var request = new XMLHttpRequest();
        request.open('GET', this.url, true);
        request.responseType = 'arraybuffer';

        var scope = this;

        request.onload = function() {
            scope.context.decodeAudioData( request.response,
                function(buffer) {
                    scope.buffer = buffer;
                    cb && cb();
                }, function(){});
        }
        request.send();
    }

    /**
     * Connect filters and play sound
     * @return {void}
     */

    playSound(){
        if(this.buffer){
            this.source = this.context.createBufferSource();
            this.source.buffer = this.buffer;

            // Define filters
            this.volume = this.context.createGain();
            this.volume.gain.value = 0;

            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 64;
            //var distortion = this.context.createWaveShaper();
            //distortion.curve = this.makeDistorsionCurve(0);

            this.biquad = this.context.createBiquadFilter();
            this.biquad.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
            this.biquad.frequency.value = 100; // Set cutoff to 440 HZ

            // Apply filters
            this.source.connect(this.biquad);
            this.biquad.connect(this.analyser);
            this.analyser.connect(this.volume);
            this.volume.connect(this.context.destination);

            this.source.loop = true;
            this.source.start(0);

            // Start visualisation
            //this.initDraw();
        }
    }

    /**
     * Init drawing
     * @return {void}
     */

    initDraw(){
        this.visualizer = document.querySelector('#visualizer');
        this.visualizerCtx = this.visualizer.getContext("2d");

        this.bufferLength = this.analyser.fftSize;
        this.dataArray = new Uint8Array(this.bufferLength);

        console.log(this);

        this.draw();
    }

    /**
     * Render the spectrum in canvas
     * @return {void}
     */

    draw(){
        //console.log('enter drawing methods');
        this.width = this.visualizer.width;
        this.height = this.visualizer.height;

        this.analyser.getByteFrequencyData(this.dataArray);
        /*
        this.visualizerCtx.fillStyle = 'rgb(200, 200, 200)';
        this.visualizerCtx.fillRect(0, 0, this.width, this.height);

        this.visualizerCtx.lineWidth = 2;
        this.visualizerCtx.strokeStyle = 'rgb(0, 0, 0)';

        this.visualizerCtx.beginPath();

        var sliceWidth = this.width * 1.0 / this.bufferLength;
        var x = 0;

        for(var i = 0; i < this.bufferLength; i++) {

            var v = this.dataArray[i] / 128.0;
            var y = v * this.height/2;

            if(i === 0) {
                this.visualizerCtx.moveTo(x, y);
            } else {
                this.visualizerCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }*/

        this.visualizerCtx.clearRect(0, 0, this.width, this.height);

        var barWidth = (this.width / this.bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        for(var i = 0; i < this.bufferLength; i++) {
            barHeight = this.dataArray[i];

            this.visualizerCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            this.visualizerCtx.fillRect(x,this.height-barHeight/2,barWidth,barHeight/2);

            x += barWidth + 1;
        }

        this.drawVisual = requestAnimationFrame(this.draw.bind(this));
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