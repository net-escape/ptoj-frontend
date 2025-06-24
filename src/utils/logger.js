// 故意略去时间: production 模式时会用另外的 package 将 log 输入文件，此时会附上时间戳
const process = require('node:process')
module.exports = require('tracer').colorConsole({
  format: process.env.NODE_ENV === 'test' ? '' : '<{{title}}> {{message}} (in {{file}}:{{line}})',
})
