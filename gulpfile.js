/*jslint node: true */
(function () {
    'use strict';

    var gulp = require('gulp'),
        del = require('del'),
        plugins = require('gulp-load-plugins')(),
        src_file = 'src/deferred.modal.bootstrap.js';

    gulp.task('clean:js', function () {
        return del(['src/deferred.modal.bootstrap.min.js']);
    });

    gulp.task('lint:js', function () {
        return gulp.src(src_file)
            .pipe(plugins.jslint())
            .pipe(plugins.jslint.reporter('default'));
    });

    gulp.task('js', ['lint:js'], function () {
        return gulp
            .src(src_file)
            .pipe(plugins.rename({
                basename: "deferred.modal.bootstrap.min",
                extname: ".js"
            }))
            .pipe(plugins.uglify())
            .pipe(gulp.dest('src/'));
     });

    gulp.task('watch', function () {
        gulp.watch(src_file, ['js']);
    });

    gulp.task('build', ['clean:js', 'js']);
    gulp.task('default', ['build', 'watch']);
}());