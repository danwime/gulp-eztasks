/**
 * 等待文件存在,然后启动gulp任务
 * Created by demon on 16/5/14.
 */
var run = require('run-sequence');
var watch = require('gulp-watch');
var path = require('path');
var fs = require('fs');

/**
 * 等待文件存在,然后启动gulp任务
 * @param filesToWait   需要等待的文件列表(非glob)
 * @param tasks         任务列表,run-sequence形式
 * @returns {Function}  gulp任务(Task)
 */
module.exports = function () {
    var args = Array.prototype.slice.call(arguments);
    var filesToWait = args[0];
    args.splice(0, 1);
    var tasks = args;

    return function (done) {
        var remainingFiles = [];
        for (var i = 0; i < filesToWait.length; i++) {
            var file = filesToWait[i];
            var filePath = path.isAbsolute(file) ? file : path.join(process.cwd(), file);
            //如果文件不存在,则添加等待
            try {
                fs.accessSync(filePath)
            } catch (e) {
                remainingFiles.push(path.join(process.cwd(), file))
            }
        }

        var watcher = watch(filesToWait, function (file) {
            if (file.event === 'add') {
                if (remainingFiles.indexOf(file.path) >= 0) {
                    remainingFiles.splice(remainingFiles.indexOf(file.path), 1)
                }

                if (remainingFiles.length <= 0) {
                    tasks.push(done);
                    run.apply(this, tasks);
                    watcher.close()
                }
            }
        });
    }
};
