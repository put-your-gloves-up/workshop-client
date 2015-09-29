/**
 * Created by jerek0 on 06/05/2015.
 */
var gulp = require('gulp');
var config = require('../config').vendor;
var browserSync  = require('browser-sync');

gulp.task('vendor', function() {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream:true}));
});
