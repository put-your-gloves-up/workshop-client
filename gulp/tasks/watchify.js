/**
 * Created by jerek0 on 06/05/2015.
 */
var gulp           = require('gulp');
var browserifyTask = require('./browserify');
var clean          = require('gulp-clean');
var config         = require('../config').browserify;


gulp.task('cleanJs', function() {
    gulp.src(config.bundleConfigs[0].dest, {read: false})
        .pipe(clean());
});

gulp.task('watchify', ['cleanJs'], function() {
    // Start browserify task with devMode === true
    return browserifyTask(true);
});
