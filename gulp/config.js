/**
 * Created by jerek0 on 06/05/2015.
 */

var dest = "./build";
var src = './src';

module.exports = {
    global: {
        src: src,
        dest: dest
    },
    less : {
        main: src + '/css/main.less',
        src: src + '/css/**/*',
        dest: dest + '/css'
    },
    images: {
        src: src + "/images/**",
        dest: dest + "/images"
    },
    markup: {
        src: src + "/htdocs/**",
        dest: dest
    },
    browserify: {
        // A separate bundle will be generated for each
        // bundle config in the list below
        bundleConfigs: [{
            entries: src + '/js/main.js',
            dest: dest + '/js',
            outputName: 'min.js',
            // list of modules to make require-able externally
            require: ['jquery', 'backbone/node_modules/underscore']
        }]
    },
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: dest
        }
    }
};