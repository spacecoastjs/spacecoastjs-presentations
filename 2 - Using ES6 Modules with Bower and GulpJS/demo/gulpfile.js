
// include the gulp library.
var gulp       = require('gulp');

// include gulp plugin libraries we'll be using.
var bowerFiles = require('main-bower-files'),
    clean      = require('gulp-clean'),
	concat     = require('gulp-concat'),
	flatten    = require('gulp-flatten'),
	jshint     = require('gulp-jshint'),
	rename     = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify     = require('gulp-uglify');

// include custom gulp components.
var	buildApp   = require('./gulp/build-app');

// include libraries for serving http content.
var browserSync = require('browser-sync');

// build system paths.
const 	PATH_BOWER           = 'bower_components', // path to our Bower files.
		PATH_APP             = 'app',
		PATH_BUILD     	     = 'build',
		PATH_BUILD_RESOURCES = 'build/resources'
		PATH_BUILD_LIB       = 'build/lib',
		PATH_PKG             = 'dist',
		PATH_PKG_LIB         = 'dist/lib';

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
gulp.task('build-files', function () {
	return gulp.src('index.html')
		.pipe(gulp.dest(PATH_BUILD));
});

// Select and concatenate our runtime dependencies.
gulp.task('build-runtime', function () {
	return gulp.src(bowerFiles({ env: 'runtime:dev' }), { base: PATH_BOWER })
		.pipe(sourcemaps.init())
		.pipe(concat('runtime.js'))
        .pipe(sourcemaps.write())
		.pipe(gulp.dest(PATH_BUILD));
});

gulp.task('build-resources', function () {
	return gulp.src(bowerFiles({ env: 'resource:dev' }), { base: PATH_BOWER })
		.pipe(gulp.dest(PATH_BUILD_RESOURCES));
});

// Copy our library dependencies into the /lib folder.
gulp.task('build-lib', function () {
	return gulp.src(bowerFiles({ env: 'library:dev' }), { base: PATH_BOWER })
		.pipe(flatten())
		.pipe(gulp.dest(PATH_BUILD_LIB));
});

// Transpile our app's ES6 source code into a single JS file.
gulp.task('build-app', function () {
    return gulp.src(PATH_APP + '/**/*.js', {base: PATH_APP})
		.pipe(sourcemaps.init())
		.pipe(buildApp())
		.pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATH_BUILD));
});

// Runs the entire build.
gulp.task('build', ['clean', 'lint'], function () {

	/* we need to "start" here because all target dependencies are run in parallel.
	 * we do not want these to start running until "clean" and "lint" are really done.
	 * another option would be to make all of these targets depend on those other targets,
	 * however that messes up using watch() for automatic recompiling. */
	gulp.start([
	'build-files', 
	'build-runtime',
	'build-resources',
	'build-lib', 
	'build-app']);
});

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
	return gulp.src(bowerFiles({ env: 'runtime:prod' }), { base: PATH_BOWER })
		.pipe(concat('runtime.js'))
		.pipe(gulp.dest(PATH_PKG));
});

// Copy the dependencies using the production (minified) files.
gulp.task('package-lib', ['package-clean'], function () {
	return gulp.src(bowerFiles({ env: 'prod' }), { base: PATH_BOWER })
		.pipe(flatten())
		.pipe(rename(function (path) {
			// remove min from filename so that file names patch expected names.
        	path.basename = path.basename
        		.replace('.min', '')
        		.replace('-min', '');
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

gulp.task('start', function () {

	browserSync({
        server: {
            baseDir: "./" + PATH_BUILD
        }
    });
	
	gulp.watch('app/**/*.js', ['build-app', browserSync.reload]);
	gulp.watch('index.html', ['build-files', browserSync.reload]);
});

// The default task: build, then run start.
gulp.task('default', ['build'], function () {
	// we don't run to run "start" until "build" is done.
	//gulp.start('start');
});