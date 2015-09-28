/**
 * Created by jerek0 on 07/05/2015.
 */
var gulp = require('gulp'),
    clean = require('gulp-clean')
    config = require('../config').global;

gulp.task('clean', function() {
    return gulp.src(config.dest, {read: false})
        .pipe(clean());
});