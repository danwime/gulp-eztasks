/**
 * 压缩指定的css文件任务
 * Created by demon on 16/5/14.
 */
var gulp = require('gulp');
var minicss = require('gulp-minify-css');

/**
 * 压缩指定的css文件
 * @param src   css文件列表(glob)
 * @returns {Function}  gulp任务(Task)
 */
module.exports = function (src) {
  return function () {
    return gulp.src(src, {base: './'})
      .pipe(minicss())
      .pipe(gulp.dest('./'));
  }
};