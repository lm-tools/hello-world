const gulp = require('gulp');
const clean = require('gulp-clean');
const runSequence = require('gulp4-run-sequence');
const log = require('fancy-log');
const c = require('ansi-colors');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const spawn = require('child_process').spawn;
const babel = require('gulp-babel');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
const { lintHtml } = require('lmt-utils');
const rev = require('gulp-rev');
const debug = require('gulp-debug');
const request = require('request-promise');

const stagePath = 'dist/stage/';
let node;

gulp.task('lint-all-html', gulp.series(done => {
  const port = '3001';
    // this is a bit dirty. We are doing this because the http server cannot be closed
    // which means that the gulp process hangs forever. A process.exit(0) also causes
    // gulp to error... rock } | hard place
  const proc = spawn('node', ['./start-test-server.js'], { PORT: port });
  function requestRetry(url, wait = 1000, max = 20, i = 0) {
    return request.get(url)
            .then(() => log.info(`response received from ${url}`))
            .catch(() => new Promise((acc, rej) => {
              if (i > max) {
                log.error(`never connected to ${url}.. tried ${max} times`);
                rej(`never connected to ${url}.. tried ${max} times`);
              }
              setTimeout(() => {
                log.info('waiting for server to connect');
                acc(requestRetry(url, wait, max, i + 1));
              }, wait);
            }));
  }
  const url = `http://localhost:${port}`;
  return requestRetry(url)
        .then(() => lintHtml({ url }))
        .catch(e => {
          log(c.red(e));
          return 'lint-all-html failed';
        })
        .then(e => proc.kill('SIGINT') && done(e));
}));

gulp.task('browserify', gulp.series(() =>
    browserify('app/assets/js/main.js')
        .bundle()
        .on('error', function (err) {
          log(c.red('Browserify compilation error:'));
          log(err);
          this.emit('end');
        })
        .pipe(plumber())
        .pipe(source('main.js'))
        // babel doesn't support streaming
        .pipe(streamify(babel({ presets: ['@babel/preset-env'] })))
        .pipe(streamify(uglify())) // uglify doesn't support streaming
        .pipe(gulp.dest(`${stagePath}js`))
));

gulp.task('js-vendor', () =>
  gulp.src([
    'node_modules/govuk_frontend_toolkit/javascripts/govuk/selection-buttons.js',
    'node_modules/jquery/dist/jquery.min.js',
  ]).pipe(gulp.dest(`${stagePath}js`))
);

gulp.task('js', gulp.series('browserify', 'js-vendor'));

gulp.task('fonts', () =>
  gulp.src('node_modules/font-awesome/fonts/*').pipe(gulp.dest(`${stagePath}fonts`))
);

gulp.task('css', gulp.series('fonts', () =>
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
));

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

gulp.task('compile', gulp.series('revision:steps'));

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

