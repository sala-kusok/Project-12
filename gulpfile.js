const gulp = require('gulp'); // gulp - сборщик
const less = require('gulp-less'); // gulp-sass - преобразовывает less в CSS
const sourcemaps = require('gulp-sourcemaps'); // gulp-sourcemaps - отслеживает строки в SASS
const autoprefixer = require('gulp-autoprefixer'); // gulp-autoprefixer - автоматические префиксы
const concat = require('gulp-concat'); // gulp-concat - соединяет все SCSS файлы в один
const cleanCss = require('gulp-clean-css'); // gulp-clean-css - минифицырует наш Css фаил
const gulpIf = require('gulp-if'); // gulp-if - добавляем условия if else в Gulp
const browserSync = require('browser-sync').create(); // browser-sync - автоматицеская перезагрузка браузера

const config = {
    paths: {
        less: './src/less/**/*.less',
        main: './src/less/main.less',
        html: './public/index.html'
    },
    output: {
        cssName: 'bundle.min.css',
        path: './public'
    },
    isDevelop: true
}

gulp.task('less', function () {
    return gulp.src(config.paths.main)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(less())
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer())
        .pipe(gulpIf(!config.isDevelop, cleanCss()))
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
        .pipe(gulp.dest('public/css'))
        .pipe(browserSync.stream());
});

gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: config.output.path
        }
    });

    gulp.watch(config.paths.less, gulp.parallel("less"));
    gulp.watch(config.paths.html).on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel("less", "serve"));