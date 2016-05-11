/**
 * 本地文件同步任务
 * Created by demon on 16/5/11.
 */
var gulp = require('gulp');
var util = require('gulp-util');
var watch = require('gulp-watch');
var print = require('gulp-print');
var clean = require('gulp-clean');

/**
 * 文件同步任务
 * @param src           源
 * @param dist          目标
 * @param isWatch       是否持续同步
 * @returns {Function}  返回gulp任务(Task)
 */
module.exports = function (src, dist, isWatch) {
  return function () {
    //同步文件
    var task = gulp.src(src, {base: './'})
      .pipe(gulp.dest(dist));

    //是否需要持续同步
    if (isWatch) {
      util.log('[Sync] 开始持续同步监听...');
      watch(src, function (obj) {
        //文件修改或者添加需要同步
        if (obj.event === 'change' || obj.event === 'add') {
          return gulp.src(obj.path, {base: './'})
            .pipe(gulp.dest(dist))
            .on('end', function () {
              util.log('[Sync] 文件: ' + obj.path.replace(obj.base, '') + ' 同步成功!')
            });
        }
        else if (obj.event === 'unlink') {
          var distFilePath = obj.path.replace(obj.cwd, obj.cwd + '/' + dist);
          return gulp.src(distFilePath)
            .pipe(clean())
            .pipe(print(function () {
              return '[Sync] 文件: ' + obj.path.replace(obj.base, '') + ' 删除成功!';
            }));
        }
      });
    }

    return task;
  }
};