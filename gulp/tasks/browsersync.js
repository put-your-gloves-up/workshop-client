/**
 * Created by jerek0 on 06/05/2015.
 */
var browserSync = require('browser-sync');
var gulp        = require('gulp');
var config      = require('../config').browserSync;

gulp.task('browserSync', function() {
    browserSync(config);
});
