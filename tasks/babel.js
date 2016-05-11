/**
 * Babel 构建任务
 * Created by demon on 16/5/11.
 */
var gulp = require('gulp');
var babel = require('gulp-babel');
var util = require('gulp-util');
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var print = require('gulp-print');

var nodeUtil = require('util');

/**
 * Babel转码器任务
 * @param src           源
 * @param dist          目标
 * @param isWatch       是否监听,并持续编译
 * @param option        babel选项
 * @returns {Function}  gulp任务(Task)
 */
module.exports = function (src, dist, isWatch, option) {

  //参数初始化
  if (nodeUtil.isObject(isWatch)) {
    option = isWatch;
    isWatch = false
  }

  return function () {
    var task = gulp.src(src, {base: './'})
      .pipe(babel(option))
      .pipe(gulp.dest(dist));

    if (isWatch) {
      util.log('[Babel] 开始持续编译监听...');
      watch(src, function (obj) {
        if (obj.event === 'change' || obj.event === 'add') {
          util.log('[Babel] 文件: ' + obj.path.replace(obj.base, '') + ' 正在编译...');
          return gulp.src(obj.path, {base: './'})
            .pipe(babel(option))
            .on('error', function (err) {
              util.log('[Babel] 文件: ' + obj.path.replace(obj.base, '') + ' 编译错误,错误如下:\n' + err);
            })
            .pipe(gulp.dest(dist))
            .on('end', function () {
              util.log('[Babel] 文件: ' + obj.path.replace(obj.base, '') + '编译成功!');
            });
        } else if (obj.event === 'unlink') {
          var distFilePath = obj.path.replace(obj.cwd, obj.cwd + '/' + dist).replace(/(.*)(\..{1,6}$)/, '$1.js');
          return gulp.src(distFilePath)
            .pipe(clean())
            .pipe(print(function () {
              return '[Babel] 文件: ' + obj.path.replace(obj.base, '') + '删除成功!';
            }));
        }
      });
    }

    return task;
  }
};