const gulp = require('gulp');
const path = require('path');
const jade = require('gulp-jade');
const less = require('gulp-less');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const stripCssComments = require('gulp-strip-css-comments');
const del = require('del');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyjs');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const browserSync = require('browser-sync').create();

const config = {
  jade: './src/jade',
  less: './src/less',
  js: './src/js',
  img: './src/img',
  svg: './src/svg',
  fonts: './src/fonts',
  build: './build'
};

gulp.task('clean', () => del.sync([config.build]));

gulp.task('jade', () =>
  gulp
    .src(`${config.jade}/pages/*.jade`)
    .pipe(jade({
      pretty: true,
    }))
    .pipe(gulp.dest(config.build)));

gulp.task('less', () =>
  gulp
    .src(`${config.less}/styles.less`)
    .pipe(sourcemaps.init())
    .pipe(less({
      rootpath: '/',
    }))
    .pipe(autoprefixer())
    .pipe(stripCssComments({
      preserve: false,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${config.build}/css`))
    .pipe(gulp.dest(`${config.theme}/css`)));

gulp.task('js', () =>
  gulp
    .src(`${config.js}/**`)
    // .pipe(concat('build.min.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(`${config.build}/js`))
    .pipe(gulp.dest(`${config.theme}/js`)));

gulp.task('img', () =>
  gulp
    .src(`${config.img}/**`)
    .pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
    })))
    .pipe(gulp.dest(`${config.build}/img`))
    .pipe(gulp.dest(`${config.theme}/img`)));

gulp.task('fonts', () =>
  gulp
    .src(`${config.fonts}/**`)
    .pipe(gulp.dest(`${config.build}/fonts`))
    .pipe(gulp.dest(`${config.theme}/fonts`)));

gulp.task('watch', () => {
  gulp.watch(`${config.less}/**`, ['less']);
  gulp.watch(`${config.js}/**`, ['js']);
  gulp.watch(`${config.img}/**`, ['img']);
  gulp.watch(`${config.svg}/**`, ['img']);
  gulp.watch(`${config.fonts}/**`, ['fonts']);
  gulp.watch(`${config.jade}/**`, ['jade']);
});

gulp.task('serve', ['clean', 'less', 'jade', 'js', 'img', 'fonts'], () => {
  browserSync.init({
    server: './build',
  });

  gulp.watch(`${config.less}/**/*`, ['less']).on('change', browserSync.reload);
  gulp.watch(`${config.js}/**`, ['js']).on('change', browserSync.reload);
  gulp.watch(`${config.img}/**/*`, ['img']).on('change', browserSync.reload);
  gulp.watch(`${config.svg}/**/*`, ['svg']).on('change', browserSync.reload);
  gulp.watch(`${config.fonts}/**/*`, ['fonts']).on('change', browserSync.reload);
  gulp.watch(`${config.jade}/**/*`, ['jade']).on('change', browserSync.reload);
});

gulp.task('build', ['clean', 'jade', 'less', 'js', 'img', 'fonts']);
gulp.task('watch', ['watch']);
gulp.task('default', ['serve']);
