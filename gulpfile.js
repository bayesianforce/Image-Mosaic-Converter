/**
 * Created by Valerio Bartolini
 */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    babel = require('gulp-babel');

//Config
var jsDest = 'dist/js',
    cssDest = 'dist/css',
    cssFiles = [
        'css/mosaic.css'
    ],
    jsFiles = [
        'js/modules/conf/conf.js',
        'js/modules/MosaicRow.js',
        'js/modules/Mosaic.js',
        'js/client.js'
    ];
//tasks
gulp.task('js', function () {
    return gulp.src(jsFiles)
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(concat('js.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('js.min.js'))
        .pipe(gulp.dest(jsDest));
});

gulp.task('css', function () {
    return gulp.src(cssFiles)
        .pipe(sourcemaps.init())
        .pipe(concat('mosaic.css'))
        .pipe(gulp.dest(cssDest))
        .pipe(rename('mosaic.min.css'))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(cssDest));
});

gulp.task('watch', ['build'], function () {
    gulp.watch(['js/**/*.js', cssFiles], ['build']);
});

gulp.task('build', ['js', 'css']);

gulp.task('start', ['build', 'watch']);