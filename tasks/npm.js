var util = require('gulp-util');
var spawn = require('child_process').spawn;

/**
 * npm 脚本
 * @param scriptName    任务脚本名
 * @param workDir       工作目录
 * @param title         任务标题
 * @returns {Function}
 */
module.exports = function (scriptName, workDir, title) {
    //默认参数
    title = title || 'Npm[' + scriptName + ']';
    workDir = workDir || '.';

    return function (done) {
        util.log('启动进程: ' + title + ' in ' + workDir);
        if (scriptName) {
            var ps = spawn('npm', ['run', scriptName], {cwd: workDir});
            ps.stdout.pipe(process.stdout);
            ps.stderr.pipe(process.stderr);
            ps.on('close', function (code) {
                if (code === 0) {
                    util.log('进程 ' + title + ' 完成');
                    done();
                }
                else {
                    util.log('进程 ' + title + ' 异常退出, Code: ' + code);
                    done(new Error('exit code is non-zero'))
                }
            });
        } else {
            util.log('请指定npm script名');
            done(new Error('without script name'))
        }
    }
};