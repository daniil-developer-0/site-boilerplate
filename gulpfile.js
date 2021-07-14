const gulp = require("gulp");
const sass = require("gulp-sass")(require("node-sass"));
const include = require("gulp-include");
const source_maps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");

/**
 * @brief Paths for project
 */
const path = {
  src: {
    fonts: "./src/assets/fonts/**/*.{ttf,otf,md,svg,woff,woff2}",
    scss: "./src/vendors/sass/**/*.{sass,scss}",
    html: "./src/**/*.{html,htm}",
    partials: "./src/html/",
    images: "./src/assets/img/**/*.{png,jpg,jpeg,gif,svg}",
  },
  dist: {
    css: "./dist/css",
    fonts: "./dist/assets/fonts",
    html: "./dist",
    images: "./dist/assets/img/",
  },
};

// CSS Transformation
gulp.task("sass", function () {
  return gulp
    .src(path.src.scss)
    .pipe(source_maps.init({ loadMaps: true }))
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(source_maps.write())
    .pipe(gulp.dest(path.dist.css));
});

// HTML Transformation
gulp.task("html-include", () => {
  return gulp
    .src(path.src.html)
    .pipe(
      include({
        includePaths: path.src.partials,
      }).on("error", console.log)
    )
    .pipe(gulp.dest(path.dist.html));
});

// Javascript
gulp.task("move-js", () => {
  return gulp.src("./src/js/*.js").pipe(gulp.dest("./dist/js"));
});

// Images optimization
gulp.task("img-optimize", () => {
  return gulp
    .src(path.src.images)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(gulp.dest(path.dist.images));
});

// Fonts move
gulp.task("move-fonts", () => {
  return gulp.src(path.src.fonts).pipe(gulp.dest(path.dist.fonts));
});

// Watch
gulp.task("watch", (result) => {
  gulp.watch(path.src.scss, gulp.series("sass"));
  gulp.watch([path.src.partials, "./src"], gulp.series("html-include"));
  gulp.watch(path.src.images, gulp.series("img-optimize"));
  gulp.watch("./src/js/*.js", gulp.series("move-js"));
  result();
});

exports.build = gulp.parallel(
  "sass",
  "html-include",
  "img-optimize",
  "move-fonts"
); // Build
exports.default = gulp.parallel("html-include", "sass"); // Default
exports.watch = gulp.series("watch"); // Watch
