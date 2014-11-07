var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat');

gulp.task('jshint', function () {
   gulp.src("src/**.js")
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
});

gulp.task('concat', function () {
    gulp.src(['src/calculator.js', 'src/ui.js'])
      .pipe(concat('client.js'))
      .pipe(gulp.dest('./build/'));
});