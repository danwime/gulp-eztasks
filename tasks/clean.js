/**
 * 清理任务
 * Created by demon on 16/5/11.
 */

var gulp = require('gulp');
var clean = require('gulp-clean');
var util = require('gulp-util');

/**
 * 生成清理任务
 * @param dist          需要清理的目录
 * @param containSelf   是否包含目录本身
 * @returns {Function}  清理任务(Task)
 */
module.exports = function (dist, containSelf) {
  //返回一个任务
  return function () {
    var path = containSelf ? dist : dist + '/*';
    return gulp.src(path, {read: false})
      .pipe(clean());
  }
};
