const gulp = require('gulp');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
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
const debug = require('gulp-debug');

const stagePath = 'dist/stage/';
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
    .pipe(gulp.dest(`${stagePath}js`))
);

gulp.task('js-vendor', () =>
  gulp.src([
    'node_modules/govuk_frontend_toolkit/javascripts/govuk/selection-buttons.js',
    'node_modules/jquery/dist/jquery.min.js',
  ]).pipe(gulp.dest(`${stagePath}js`))
);

gulp.task('js', ['browserify', 'js-vendor']);

gulp.task('fonts', () =>
  gulp.src('node_modules/font-awesome/fonts/*').pipe(gulp.dest(`${stagePath}fonts`))
);

gulp.task('css', ['fonts'], () =>
  gulp.src('app/assets/stylesheets/*.scss')
    .pipe(plumber())
    .pipe(
      sass({
        includePaths: [
          'src/assets/stylesheets',
          'node_modules/govuk_frontend_toolkit/stylesheets',
          'node_modules/govuk-elements-sass/public/sass',
          'node_modules/font-awesome/scss/',
        ],
      }))
    .pipe(gulp.dest(`${stagePath}stylesheets/`))
);

gulp.task('clean', () =>
  gulp.src('dist/public', { read: false, allowEmpty: true })
    .pipe(clean())
);

gulp.task('revision:rename', () =>
  gulp.src([
    `${stagePath}**/*.html`,
    `${stagePath}**/*.css`,
    `${stagePath}**/*.js`,
    `${stagePath}**/*.{jpg,png,jpeg,gif,svg,otf,eot,ttf,woff,woff2}`])
    .pipe(debug())
    .pipe(rev())
    .pipe(gulp.dest('./dist/public'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./dist/public'))
);

gulp.task('revision:steps', (callback) =>
  runSequence('clean', 'js', 'css', 'revision:rename', callback)
);

gulp.task('compile', ['revision:steps']);


gulp.task('server', () => {
  if (node) node.kill();
  node = spawn('node', ['bin/www'], { stdio: 'inherit' });
  node.on('close', (code) => {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

gulp.task('compile-server', (callback) => runSequence('compile', 'server', callback));

gulp.task('watch', () => {
  runSequence('compile', 'server', 'watch-steps');
});

gulp.task('watch-steps', () => {
  gulp.watch(['app/**/*.js', 'bin/www'], ['server']);
  gulp.watch('app/assets/stylesheets/**/*.scss', ['compile-server']);
  gulp.watch('app/assets/js/**/*.js', ['browserify']);
});


// clean up if an error goes unhandled.
process.on('exit', () => {
  if (node) node.kill();
});

