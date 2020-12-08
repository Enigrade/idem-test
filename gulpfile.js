let prod = 'dist';
let source = 'src';

let fs = require('fs');

let path = {
  build: {
    html: prod + '/',
    css: prod + '/css/',
    js: prod + '/js/',
    img: prod + '/img/',
    fonts: prod + '/fonts/'
  },
  src: {
    html: [source + '/*.html', '!' + source + '/_*.html'],
    css: source + '/scss/style.scss',
    js: source + '/js/script.js',
    img: source + '/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}',
    fonts: source + '/fonts/*.{eot,ttf,woff,woff2,otf}'
  },
  watch: {
    html: source + '/**/*.html',
    css: source + '/scss/**/*.scss',
    js: source + '/js/**/*.js',
    img: source + '/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}'
  },
  clean: "./" + prod + "/"

}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    fileinclude = require('gulp-file-include'),
    browsersync = require('browser-sync').create(),
    del = require('del'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter');

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + prod + "/"
    },
    port: 3000,
    notify: false
  })
}

function html() {
  return src(path.src.html)
      .pipe(fileinclude())
      .pipe(dest(path.build.html))
      .pipe(browsersync.stream())
}

function images() {
  return src(path.src.img)
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewbox: false}],
        interlaced: true,
        optimizationLevel: 3
      }))
      .pipe(dest(path.build.img))
      .pipe(browsersync.stream())
}

function fonts() {
  src(path.src.fonts)
      .pipe(ttf2woff())
      .pipe(dest(path.build.fonts))
  return src(path.src.fonts)
      .pipe(ttf2woff2())
      .pipe(dest(path.build.fonts))
}

gulp.task('otf2ttf', function () {
  return src([source + '/fonts/*.otf'])
      .pipe(fonter({
        formats: ['ttf']
      }))
      .pipe(dest(path.src.fonts));
});

function js() {
  return src(path.src.js)
      .pipe(fileinclude())
      .pipe(dest(path.build.js))
      .pipe(uglify())
      .pipe(rename({
        extname: '.min.js'
      }))
      .pipe(dest(path.build.js))
      .pipe(browsersync.stream())
}

function css() {
  return src(path.src.css)
      .pipe(scss())
      .pipe(group_media())
      .pipe(autoprefixer({
        overrideBrowserslist: ["last 5 versions"]
      }))
      .pipe(dest(path.build.css))
      .pipe(clean_css())
      .pipe(rename({
        extname: '.min.css'
      }))
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
}

async function fontsStyle() {
  let file_content = fs.readFileSync(source + '/scss/_fonts.scss');
  if (file_content == '') {
    fs.writeFile(source + '/scss/_fonts.scss', '', cb);
    return fs.readdir(path.build.fonts, function (err, items) {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];
          if (c_fontname != fontname) {
            fs.appendFile(source + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
        }
      }
    })
  }
}

function cb() { }

function watchFiles() {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean() {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, images, fonts, html), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle()
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;