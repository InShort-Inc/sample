'use strict';

const gulp = require('gulp');
var sass = require('gulp-sass');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');
const newer = require('gulp-newer');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

const opts = {
  errorHandler: notify.onError(err => ({
    title: 'Styles',
    message: err.message
  }))
};

gulp.task('styles', () => {
  return gulp.src('frontend/css/*.scss')
    .pipe(plumber(opts))
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(debug({title: 'styles'}))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('public/css'));
});

gulp.task('assets', () => {
  return gulp.src('frontend/assets/**', {since: gulp.lastRun('assets')})
    .pipe(newer('public'))
    .pipe(debug({title: 'assets'}))
    .pipe(gulp.dest('public'));
});

gulp.task('clean', () => {
  return del('public');
});


gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('styles', 'assets'))
);

gulp.task('watch', () => {
  gulp.watch('frontend/assets/**/*.*', gulp.series('assets'));
  gulp.watch('frontend/css/**/*.*', gulp.series('styles'));
});

gulp.task('serve', function () {
  browserSync.init({server: 'public'});
  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series(
  'build',
  gulp.parallel('watch', 'serve'))
);