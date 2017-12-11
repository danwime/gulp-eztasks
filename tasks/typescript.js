/**
 * TypeScript 构建任务
 * Created by demon on 17/12/11.
 */
var gulp = require('gulp');
var typescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');
var watch = require('gulp-watch');
var clean = require('gulp-clean');
var print = require('gulp-print');

var nodeUtil = require('util');

/**
 * TypeScript 编译任务 - 目前尚不完善
 * @param src           源
 * @param dist          目标
 * @param config        tsconfig
 * @param isWatch       是否监听和持续编译
 * @returns {Function}  gulp任务(Task
 */
module.exports = function (src, dist, config, isWatch) {
    //参数初始化
    if (nodeUtil.isBoolean(config)) {
        util.log('[TS] 启动用默认ts配置');
        isWatch = config;
        config = undefined;
    }

    config = config || 'tsconfig.json';

    return function () {
        var task = gulp.src(src, {base: './'})
            .pipe(sourcemaps.init())
            .pipe(typescript(config, typescript.reporter.fullReporter(true)))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(dist));

        if (isWatch) {
            util.log('[TS] 开始持续编译监听...');
            watch(src, function (obj) {
                if (obj.event === 'change' || obj.event === 'add') {
                    util.log('[TS] 文件: ' + obj.path.replace(obj.base, '') + ' 正在编译...');
                    return gulp.src(obj.path, {base: './'})
                        .pipe(sourcemaps.init())
                        .pipe(typescript(config, typescript.reporter.fullReporter(true)))
                        .once('error', function (err) {
                            util.log('[TS] 文件: ' + obj.path.replace(obj.base, '') + ' 编译错误,错误如下:\n' + err);
                        })
                        .pipe(sourcemaps.write())
                        .pipe(gulp.dest(dist))
                        .once('end', function () {
                            util.log('[TS] 文件: ' + obj.path.replace(obj.base, '') + ' 编译成功!');
                        });
                } else if (obj.event === 'unlink') {
                    var distFilePath = obj.path.replace(obj.cwd, obj.cwd + '/' + dist).replace(/(.*)(\..{1,6}$)/, '$1.ts');
                    return gulp.src(distFilePath)
                        .pipe(clean())
                        .pipe(print(function () {
                            return '[TS] 文件: ' + obj.path.replace(obj.base, '') + ' 删除成功!';
                        }));
                }
            });
        }

        return task;
    }
};
