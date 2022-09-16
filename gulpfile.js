import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

export const html = () => {
  return gulp.src('source/*.html')
  .pipe(gulp.dest('build'));
  }

// Scripts

export const scripts = () => {
  return gulp.src('sours/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'))
}

  // Images

 const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
.pipe(squoosh())
.pipe(gulp.dest('build/img'))
}

export  const copyImages = () => {
return gulp.src('source/img/**/*.{png,jpg}')
.pipe(gulp.dest('build/img'))
}


// WebP

export const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh({
  webp: {}
  }))
  .pipe(gulp.dest('build/img'))
  }

// Server

const server = (done) => {
  browser.init({
    server: {
    baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
    });
    done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}


export default gulp.series(
  copyImages, html, styles, scripts, server, watcher,
);
