'use strict';

/* --------------------------------------------------------------------------
 *  Gulp libs
 * --------------------------------------------------------------------------
 */
var gulp      = require('gulp'),
    batch     = require('gulp-batch'),
    concat    = require('gulp-concat'),
    less      = require('gulp-less'),
    minifyCss = require('gulp-minify-css'),
    rename    = require('gulp-rename'),
    uglify    = require('gulp-uglify'),
    watch     = require('gulp-watch');

/* --------------------------------------------------------------------------
 *  Directories
 * --------------------------------------------------------------------------
 */
var dirs       = {
  base: '.',
  src:  './src',
  dist: './dist'
};

/* --------------------------------------------------------------------------
 *  Tasks
 * --------------------------------------------------------------------------
 */
gulp.task('default', ['less', 'js']);

gulp.task('watch', function () {
  watch(dirs.src + '/js/**/*.js', batch(function (events, done) {
    gulp.start('js', done);
  }));
  watch(dirs.src + '/less/**/*.less', batch(function (events, done) {
    gulp.start('less', done);
  }));
});

gulp.task('less', function () {
  return gulp.src(dirs.src + '/less/icheck.less')
    .pipe(less())
    .pipe(gulp.dest(dirs.dist + '/css'))
    .pipe(minifyCss({
        keepSpecialComments: 1
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(dirs.dist + '/css/'));
});

gulp.task('js', function () {
  return gulp.src(dirs.src + '/js/icheck.js')
    // .pipe(gulp.dest(dirs.dist + '/js'))
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(dirs.dist + '/js'));
});
