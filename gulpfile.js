const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const purgecss = require('gulp-purgecss')
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')

function buildStyles() {
 return src('sass/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(purgecss({ content: ['*.html'] }))
    .pipe(dest('css'))
}

function minifyCSS() {
 return src('classless/classless.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename('sqky-classless.min.css'))
    .pipe(dest('classless'));
}

function watchTask() {
 watch('classless/classless.css', minifyCSS)
}

exports.buildStyles = buildStyles;
exports.minifyCSS = minifyCSS;
exports.default = series(buildStyles, watchTask)