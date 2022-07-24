const { series, src, dest } = require('gulp');
const useref = require('gulp-useref');
const cssnano = require('gulp-cssnano');
const gulpIf = require('gulp-if');
const babel = require('gulp-babel');
const del = require('del');
const terser = require('gulp-terser');

function clean(cb) {
  del.sync('deploy');
  cb();
}

function build() {
  return src('src/index.html')
    .pipe(useref())
    .pipe(
      gulpIf(
        '*.js',
        babel({
          presets: ['@babel/env'],
        })
      )
    )
    .pipe(gulpIf('*.js', terser()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(dest('deploy'));
}

function buildBackground() {
  return src(['src/js/background.js'])
    .pipe(
      gulpIf(
        '*.js',
        babel({
          presets: ['@babel/env'],
        })
      )
    )
    .pipe(gulpIf('*.js', terser()))
    .pipe(dest('deploy/js'));
}

function copy(cb) {
  src('src/assets/**/*').pipe(dest('deploy/assets'));
  src('src/css/shared.css').pipe(dest('deploy/css'));
  src('src/manifest.json').pipe(dest('deploy'));
  src('node_modules/chrome-promise/chrome-promise.js').pipe(dest('deploy/js'));
  src('src/options_page/**').pipe(dest('deploy/options_page'));
  cb();
}

exports.build = series(clean, build, buildBackground, copy);
