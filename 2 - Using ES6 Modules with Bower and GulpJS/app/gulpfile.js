
var gulp       = require('gulp');

var clean      = require('gulp-clean'),
	concat     = require('gulp-concat'),
	filter     = require('gulp-filter'),
	flatten    = require('gulp-flatten'),
	jshint     = require('gulp-jshint'),
	sourcemaps = require('gulp-sourcemaps'),
	buildApp   = require('./gulp/build-app');

var bowerFiles = require('main-bower-files');

var env = 'dev'
	envRuntime = env + "-runtime";

const BOWER_PATH = 'bower_components';
/*[
			'bower_components/traceur-runtime/traceur-runtime.js',
			'bower_components/es6-module-loader/dist/es6-module-loader.js',
			'bower_components/system.js/dist/system.js'
		]*/

// Cleans the build directory before running the build.
gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

// Applies linting to the app source code.
gulp.task('lint', function () {
    return gulp.src('app/*.js')
		.pipe(jshint({ esnext: true }))
	    .pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('copy-files', ['clean'], function () {
	return gulp.src('index.html')
		.pipe(gulp.dest('build'));
});

// Select and concatenate our runtime dependencies.
gulp.task('build-runtime', ['clean'], function () {
	return gulp.src(bowerFiles({ env: envRuntime }), { base: BOWER_PATH })
		.pipe(concat('runtime.js'))
		.pipe(gulp.dest('build'));
});

// Copy our dependencies into the /lib folder.
gulp.task('build-lib', ['clean'], function () {
	return gulp.src(bowerFiles({ env: env }), { base: BOWER_PATH })
		.pipe(flatten())
		.pipe(gulp.dest('build/lib'));
});

// Transpiles our app's ES6 source code into a single JS file.
gulp.task('build-app', ['clean'], function () {
    return gulp.src('app/*.js', {base: 'app'})
		.pipe(sourcemaps.init())
		.pipe(buildApp())
		.pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build'));
});

// The master build task.
gulp.task('build', [
	'lint', 
	'copy-files', 
	'build-runtime', 
	'build-lib', 
	'build-app']);

// The default task AKA build.
gulp.task('default', ['build']);