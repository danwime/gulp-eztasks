/**
 * 通用gulp任务集合
 * Created by demon on 16/5/11.
 */
module.exports = {
  babel: require('./tasks/babel'),
  clean: require('./tasks/clean'),
  sync: require('./tasks/sync'),
  minijs: require('./tasks/minijs'),
  minicss: require('./tasks/minicss'),
  typscript: require('./tasks/typescript')
};