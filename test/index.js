var fs = require('fs');
var path = require('path');
var glob = require('glob-all');
var expect = require('chai').expect;
var _ = require('lodash');
var chalk = require('chalk');

var projectRootPath = path.resolve(__dirname, '..');

var pkg = JSON.parse(fs.readFileSync(path.join(projectRootPath, 'package.json'), {encoding: 'utf8'}));
var files = glob.sync(pkg.programFiles || [], {
    cwd: projectRootPath,
    no_dir: true
}).sort();
/* jshint mocha: true */
describe('检测文件编码和换行符', function () {
    it('检测文件编码', function () {
        var errorFiles = _.filter(files, function (filename) {
            var content = fs.readFileSync(path.join(projectRootPath, filename));
            var str = content.toString('utf8');
            var newContent = new Buffer(str, 'utf8');
            return Buffer.compare(newContent, content) !== 0;
        });
        var errorMessage = '以下文件编码不是utf8\n' +
            chalk.red.bold(errorFiles.join('\n')) +
            '\n建议使用以下命令转换:\n' +
            chalk.blue.bold('yo syswin:test convert_file_to_utf8_encoding\n');
        expect(errorFiles).to.have.length(0, errorMessage);
    });
    it('检测文件换行符', function () {
        var errorFiles = _.filter(files, function (filename) {
            var content = fs.readFileSync(path.join(projectRootPath, filename));
            var str = content.toString('utf8');
            return str.indexOf('\r') >= 0;
        });
        var errorMessage = '以下文件换行符不是\\n\n' +
            chalk.red.bold(errorFiles.join('\n')) +
            '\n建议使用以下命令转换:\n' +
            chalk.blue.bold('yo syswin:test convert_file_to_unix_style_endings\n');
        expect(errorFiles).to.have.length(0, errorMessage);
    });
});