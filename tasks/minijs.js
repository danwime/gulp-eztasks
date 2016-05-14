/**
 * 压缩指定js文件任务
 * Created by demon on 16/5/14.
 */
var gulp = require('gulp');
var uglify = require('gulp-uglify');

/**
 * 压缩指定的js文件
 * @param src       js文件列表(glob)
 * @param option    压缩选项
 * @returns {Function}  gulp任务(Task)
 */
module.exports = function (src, option) {
  return function () {
    return gulp.src(src, {base: './'})
      .pipe(uglify(option))
      .pipe(gulp.dest('./'));
  }
};