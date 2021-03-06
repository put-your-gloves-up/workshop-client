/**
 * Created by jerek0 on 06/05/2015.
 */

/* Notes:
 - gulp/tasks/browserify.js handles js recompiling with watchify
 - gulp/tasks/browserSync.js watches and reloads compiled files
 */

var gulp     = require('gulp');
var config   = require('../config');

gulp.task('watch', ['watchify'], function() {
    gulp.watch(config.less.src,   ['less']);
    gulp.watch(config.images.src, ['images']);
    gulp.watch(config.markup.src, ['markup']);
    gulp.watch(config.markup.src, ['vendor']);
    gulp.watch(config.markup.src, ['audio']);
    // Watchify will watch and recompile our JS, so no need to gulp.watch it
});
