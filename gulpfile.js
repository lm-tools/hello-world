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
const { lintHtml } = require('lmt-utils');
const http = require('http');
const rev = require('gulp-rev');
const revDelOriginal = require('gulp-rev-delete-original');
const debug = require('gulp-debug');
let node;

gulp.task('lint-all-html', () => {
  process.env = process.env || 'TEST';
  const port = 3001;
  const serverStartPromise = new Promise(accept =>
    // eslint-disable-next-line global-require
    http.createServer(require('./app/app'))
      .listen(port, () => accept())
  );
  return serverStartPromise.then(() => lintHtml({
    url: `http://localhost:${port}`,
  }))
    .then(() => process.exit(0))
    .catch(e => gutil.log(gutil.colors.red(e)) && process.exit(1));
});

gulp.task('browserify', () =>
  browserify('app/assets/js/main.js')
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
    .pipe(gulp.dest('dist/public/js'))
);

gulp.task('js-vendor', () =>
  gulp.src([
    'node_modules/govuk_frontend_toolkit/javascripts/govuk/selection-buttons.js',
    'node_modules/jquery/dist/jquery.min.js',
  ]).pipe(gulp.dest('dist/public/js'))
);

gulp.task('js', ['browserify', 'js-vendor']);

gulp.task('css', () =>
  gulp.src('app/assets/stylesheets/*.scss')
    .pipe(plumber())
    .pipe(
      sass({
        includePaths: [
          'src/assets/stylesheets',
          'node_modules/govuk_frontend_toolkit/stylesheets',
          'node_modules/govuk-elements-sass/public/sass',
        ],
      }))
    .pipe(gulp.dest('dist/public/stylesheets/'))
);

gulp.task('revision:rename', ['js', 'css'], () =>
  gulp.src([
    'dist/public/**/*.html',
    'dist/public/**/*.css',
    'dist/public/**/*.js',
    'dist/public/**/*.{jpg,png,jpeg,gif,svg}'])
    .pipe(debug())
    .pipe(rev())
    .pipe(revDelOriginal())
    .pipe(gulp.dest('./dist/public'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/public'))
);

gulp.task('compile', ['revision:rename']);


gulp.task('server', () => {
  if (node) node.kill();
  node = spawn('node', ['bin/www'], { stdio: 'inherit' });
  node.on('close', (code) => {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('watch', ['compile', 'server'], () => {
  gulp.watch(['app/**/*.js', 'bin/www'], ['server']);
  gulp.watch('app/assets/stylesheets/*.scss', ['css']);
  gulp.watch('app/assets/js/**/*.js', ['browserify']);
});


// clean up if an error goes unhandled.
process.on('exit', () => {
  if (node) node.kill();
});

