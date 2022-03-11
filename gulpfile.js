var gulp = require('gulp');
var child = require('child_process');
var concat = require('gulp-concat');
var sass = require('gulp-sass')(require('sass'));
var uglify = require('gulp-uglify');
var log = require('fancy-log');
var postcss = require('gulp-postcss');
var uncss = require('uncss').postcssPlugin;
var cssnano = require('cssnano');

gulp.task('sass', function() {
  // Compile SASS.
  return gulp.src('./_css/style.scss')
    .pipe(sass({
      includePaths: [
        './_css',
      ],
      outputStyle: 'compressed'
    })
    .on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function() {
  gulp.watch('./_css/**/*.scss', ['sass']);
});

gulp.task('js', function() {
  // Compile JS.
  return gulp.src([
    './_js/script.js',
  ])
    .pipe(concat('script.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('js'));
});

gulp.task('js:watch', function() {
  gulp.watch('./_js/**/*.js', ['js']);
});


gulp.task('jekyll', function(gulpCallback) {
  const jekyll = child.spawn('jekyll', ['build']);

  jekyll.stdout.on('data', logger('Jekyll', 'info'));
  jekyll.stderr.on('data', logger('Jekyll', 'error'));

  return jekyll;
});

gulp.task('jekyll:serve', function() {
  const jekyll = child.spawn('bundle', ['exec', 'jekyll', 'serve']);

  jekyll.stdout.on('data', logger('Jekyll', 'info'));
  jekyll.stderr.on('data', logger('Jekyll', 'error'));

  return jekyll;
});

var logger = (id, level) => buffer => {
  buffer.toString()
    .split(/\n/)
    .forEach((message) => log[level](id + ': ' + message));
};

gulp.task('default', gulp.series('sass', 'js', 'jekyll:serve', 'sass:watch', 'js:watch'));

gulp.task('build', gulp.series('sass', 'js', 'jekyll'));
