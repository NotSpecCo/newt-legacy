var gulp = require('gulp');
var concat = require('gulp-concat');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var gulpIf = require('gulp-if');
var babel = require('gulp-babel');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('hello', function() {
	console.log('Hello Garrett');
});

gulp.task('minimize', function() {
	return gulp.src('index.html')
		.pipe(useref())
		.pipe(gulpIf('*.js', babel({
		    presets: ['es2015']
		})))
		.pipe(gulpIf('*.js', uglify()))
		.pipe(gulpIf('*.css', cssnano()))
		.pipe(gulp.dest('deploy'))
});

gulp.task('minimizeBackground', function() {
    return gulp.src(['js/background.js'])
        .pipe(concat('background.js'))
        .pipe(gulpIf('*.js', babel({
		    presets: ['es2015']
		})))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('deploy/js'))
});

gulp.task('images', function() {
	return gulp.src('assets/**/*.+(png|jpg|gif|svg)')
		.pipe(imagemin({optimizationLevel: 3}))
		.pipe(gulp.dest('deploy/assets'))
});

gulp.task('copy', function() {
    gulp.src('assets/**')
        .pipe(gulp.dest('deploy/assets'));
    gulp.src('css/theme-*.css')
        .pipe(gulp.dest('deploy/css'));
    gulp.src('manifest.json')
        .pipe(gulp.dest('deploy'));
    gulp.src('node_modules/chrome-promise/chrome-promise.js')
        .pipe(gulp.dest('deploy/node_modules/chrome-promise'))
});

gulp.task('clean:deploy', function() {
	return del.sync('deploy');
});

gulp.task('build', function(callback) {
    runSequence('clean:deploy', ['minimize', 'minimizeBackground', 'copy'], callback);
});