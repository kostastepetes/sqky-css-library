const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const purgecss = require('gulp-purgecss');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');

function buildStyles() {
 return src('sass/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(purgecss({ content: ['*.html'] }))
    .pipe(dest('css'));
}

function minifyClasslessCSS() {
 return src('classless/classless.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename('sqky-classless.min.css'))
    .pipe(dest('classless'));
}

function minifyOtherCSS() {
 return src(['example/example.css', 'docs/styles.css'])
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename((path) => {
        if (path.dirname === 'example') {
            path.basename = 'example';
            path.extname = '.min.css';
        } else if (path.dirname === 'docs') {
            path.basename = 'styles';
            path.extname = '.min.css';
        }
    }))
    .pipe(dest((file) => {
        return file.base; // Keeps the directory structure
    }));
}

function watchTask() {
 watch([
    'sass/**/*.scss',
    '*.html',
    'classless/classless.css',
    'example/example.css',
    'docs/styles.css',
    'css/index.css' // Watch for changes in index.css
 ], series(buildStyles, minifyClasslessCSS, minifyOtherCSS));
}

exports.buildStyles = buildStyles;
exports.minifyClasslessCSS = minifyClasslessCSS;
exports.minifyOtherCSS = minifyOtherCSS;
exports.default = series(buildStyles, watchTask);