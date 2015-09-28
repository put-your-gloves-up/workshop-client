/**
 * Created by jerek0 on 06/05/2015.
 */
var gulp = require('gulp'),
    config = require('../config').less,
    less = require('gulp-less'),
    clean = require('gulp-clean'),
    path = require('path'),
    plumber = require('gulp-plumber'),
    handleErrors = require('../util/handleErrors'),
    minifyCSS = require('gulp-minify-css'),
    concatCss = require('gulp-concat-css'),
    browserSync = require('browser-sync');

gulp.task('lessClean', function() {
    return gulp.src(config.dest, {read: false})
        .pipe(clean());
});

gulp.task('less', ['lessClean'], function() {
    return gulp.src(config.main)
        .pipe(plumber({
            errorHandler: handleErrors
        }))
        .pipe(less({
            paths: [ path.join(config.src, 'less', 'includes') ]
        }))
        .pipe(concatCss("min.css"))
        .pipe(minifyCSS("min.css"))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
});