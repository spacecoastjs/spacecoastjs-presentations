var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat');
    nodeunit = require('gulp-nodeunit');

gulp.task('test', function () {
    gulp.src('tests/**.js')
        .pipe(nodeunit({
        }));
});

gulp.task('jshint', function () {
   gulp.src("src/**.js")
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
});

gulp.task('build', ['jshint'], function () {
    gulp.src(['src/calculator.js', 'src/ui.js'])
      .pipe(concat('client.js'))
      .pipe(gulp.dest('./build/'));
});

gulp.task('default', ['build', 'test']);