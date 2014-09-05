
// include the gulp library.
var gulp       = require('gulp');

// include gulp plugin libraries we'll be using.
var bowerFiles = require('main-bower-files'),
	buildApp   = require('./gulp/build-app'),
    clean      = require('gulp-clean'),
	concat     = require('gulp-concat'),
	filter     = require('gulp-filter'),
	flatten    = require('gulp-flatten'),
	jshint     = require('gulp-jshint'),
	rename     = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify     = require('gulp-uglify'),
	util       = require('gulp-util');

const 	PATH_BOWER     = 'bower_components', // path to our Bower files.
		PATH_APP       = 'app',
		PATH_BUILD     = 'build',
		PATH_BUILD_LIB = 'build/lib',
		PATH_PKG       = 'dist',
		PATH_PKG_LIB   = 'dist/lib';

// Cleans the build directory before running the build.
gulp.task('clean', function () {
    return gulp.src('build', {read: false})
        .pipe(clean());
});

// Applies linting to the app source code.
gulp.task('lint', function () {
    return gulp.src(PATH_APP + '/*.js')
		.pipe(jshint({esnext: true}))
	    .pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});

// Copies html file to the build.
gulp.task('build-files', ['clean'], function () {
	return gulp.src('index.html')
		.pipe(gulp.dest(PATH_BUILD));
});

// Select and concatenate our runtime dependencies.
gulp.task('build-runtime', ['clean'], function () {
	return gulp.src(bowerFiles({ env: 'dev-runtime' }), { base: PATH_BOWER })
		.pipe(sourcemaps.init())
		.pipe(concat('runtime.js'))
        .pipe(sourcemaps.write())
		.pipe(gulp.dest(PATH_BUILD));
});

// Copy our library dependencies into the /lib folder.
gulp.task('build-lib', ['clean'], function () {
	return gulp.src(bowerFiles({ env: 'dev' }), { base: PATH_BOWER })
		.pipe(flatten())
		.pipe(gulp.dest(PATH_BUILD_LIB));
});

// Transpile our app's ES6 source code into a single JS file.
gulp.task('build-app', ['clean'], function () {
    return gulp.src(PATH_APP + '/*.js', {base: PATH_APP})
		.pipe(sourcemaps.init())
		.pipe(buildApp())
		.pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATH_BUILD));
});

// Runs the entire build.
gulp.task('build', [
	'lint', 
	'build-files', 
	'build-runtime', 
	'build-lib', 
	'build-app']);

// Cleans the packaging directory before running the build.
gulp.task('package-clean', ['build'], function () {
    return gulp.src(PATH_PKG, {read: false})
        .pipe(clean());
});

// Copy js files out of the build.
gulp.task('package-files', ['package-clean'], function () {
	return gulp.src('index.html')
		.pipe(gulp.dest(PATH_PKG));
});

// Build the runtime file using the production (minified) files.
gulp.task('package-runtime', ['package-clean'], function () {
	return gulp.src(bowerFiles({ env: 'prod-runtime' }), { base: PATH_BOWER })
		.pipe(concat('runtime.js'))
		.pipe(gulp.dest(PATH_PKG));
});

// Copy the dependencies using the production (minified) files.
gulp.task('package-lib', ['package-clean'], function () {
	return gulp.src(bowerFiles({ env: 'prod' }), { base: PATH_BOWER })
		.pipe(flatten())
		.pipe(rename(function (path) {
        	path.basename = path.basename.replace('.min', '');
		}))
		.pipe(gulp.dest(PATH_PKG_LIB));
});

// Minify the app code.
gulp.task('package-app', ['package-clean'], function () {
	return gulp.src(PATH_BUILD + '/app.js')
		.pipe(uglify())
		.pipe(gulp.dest(PATH_PKG));
});

// Runs the entire build and package.
gulp.task('package', [
	'package-files',
	'package-runtime',
	'package-lib',
	'package-app']);

// The default task: build.
gulp.task('default', ['build']);