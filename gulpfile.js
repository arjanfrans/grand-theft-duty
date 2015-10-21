var gulp        = require('gulp');
var gutil       = require('gulp-util');
var streamify = require('gulp-streamify');
var source      = require('vinyl-source-stream');
var babelify    = require('babelify');
var watchify    = require('watchify');
var exorcist    = require('exorcist');
var browserify  = require('browserify');
var browserSync = require('browser-sync').create();
var uglify = require('gulp-uglify');
var gulpCopy = require('gulp-copy');

// Input file.
watchify.args.debug = true;
var bundler = watchify(browserify('./src/index.js', watchify.args));

// Babel transform
bundler.transform(babelify.configure({
    sourceMapRelative: 'src'
}));

// On updates recompile
bundler.on('update', bundle);

function bundle() {
    gutil.log('Compiling JS...');

    return bundler.bundle()
        .on('error', function (err) {
            gutil.log(err.message);
            browserSync.notify("Browserify Error!");
            this.emit('end');
        })
        .pipe(exorcist('build/js/bundle.js.map'))
        .pipe(source('bundle.js'))
        // .pipe(streamify(uglify()))
        .pipe(gulp.dest('./build/js'))
        .pipe(browserSync.stream({once: true}));
}

gulp.task('buildRelease', function () {
    return browserify('./src/index.js')
        .transform(babelify.configure({
            sourceMapRelative: 'src'
        })).bundle()
        .on('error', function (err) {
            gutil.log(err.message);
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest('./release/src/js'));
});

gulp.task('copyThreeJs', function () {
    return gulp.src('./node_modules/three/three.min.js')
        .pipe(gulp.dest('./release/src/js'));
});

gulp.task('copyAssets', function () {
    return gulp.src('./assets/spritesheets/*')
        .pipe(gulp.dest('./release/assets/spritesheets'));
});

/**
 * Gulp task alias
 */
gulp.task('bundle', function () {
    return bundle();
});

gulp.task('release', ['buildRelease', 'copyThreeJs', 'copyAssets'], function () {
});

/**
 * First bundle, then serve from the ./app directory
 */
gulp.task('default', ['bundle'], function () {
    browserSync.init({
        server: '.'
    });
});
