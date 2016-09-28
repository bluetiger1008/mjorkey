'use strict';
 
var gulp = require('gulp');
var scss = require('gulp-scss');
 

var paths = {
  scss: ['./scss/*.scss']
};

gulp.task('default', ['scss', 'watch']);


gulp.task('scss', function(done) {
  gulp.src(['./scss/style.scss'])
    .pipe(scss({
      
    }))
    .pipe(gulp.dest('./css/'))
    .on('end', done);
});
gulp.task('watch', function() {
  gulp.watch(paths.scss, ['scss']);
});