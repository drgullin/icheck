'use strict';

/* --------------------------------------------------------------------------
 *  Gulp libs
 * --------------------------------------------------------------------------
 */
var gulp       = require('gulp'),
    concat     = require('gulp-concat'),
    less       = require('gulp-less'),
    minifyCss  = require('gulp-minify-css'),
    rename     = require('gulp-rename'),
    uglify     = require('gulp-uglify');

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
