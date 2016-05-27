const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const spawn = require('child_process').spawn;
const babel = require('gulp-babel');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');

let node;

gulp.task('browserify', () => {
  browserify('assets/js/main.js')
    .bundle()
    .on('error', function (err) {
      gutil.log(gutil.colors.red('Browserify compilation error:'));
      gutil.log(err);
      this.emit('end');
    })
    .pipe(plumber())
    .pipe(source('main.js'))
    .pipe(streamify(babel({ presets: ['es2015'] }))) // babel doesn't support streaming
    .pipe(streamify(uglify())) // uglify doesn't support streaming
    .pipe(gulp.dest('dist/public/js'));
});

gulp.task('css', () => {
  gulp.src('assets/stylesheets/*.scss')
    .pipe(plumber())
    .pipe(
      sass({
        includePaths: [
          'src/assets/stylesheets',
          'node_modules/govuk_frontend_toolkit/stylesheets',
          'node_modules/govuk-elements-sass/public/sass',
        ],
      }))
    .pipe(gulp.dest('dist/public/stylesheets/'));
});


gulp.task('server', () => {
  if (node) node.kill();
  node = spawn('node', ['bin/www'], { stdio: 'inherit' });
  node.on('close', (code) => {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('watch', ['browserify', 'css', 'server'], () => {
  gulp.watch(['routes/**/*.js', '*.js'], ['server']);
  gulp.watch('assets/stylesheets/*.scss', ['css']);
  gulp.watch('assets/js/**/*.js', ['browserify']);
});


// clean up if an error goes unhandled.
process.on('exit', () => {
  if (node) node.kill();
});

