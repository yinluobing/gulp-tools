var fs = require("fs"),
    path = require("path");
var obj = {
    mkdirs: function (dirname) {
        if (!fs.existsSync(dirname)) {
            if (obj.mkdirs(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        } else {
            return true;
        }
    },
    copy: function (src, dist) {
        paths = fs.readdirSync(src);
        paths.forEach(function (path) {
            var _src = src + '/' + path,
                _dst = dist + '/' + path,
                readable, writable;
            if (fs.statSync(_src).isFile()) {
                // 创建读取流
                readable = fs.createReadStream(_src);
                // 创建写入流
                writable = fs.createWriteStream(_dst);
                // 通过管道来传输流
                readable.pipe(writable);
            } else if (fs.statSync(_src).isDirectory()) {
                obj.exists(_src, _dst, obj.copy);
            }
        })
    },
    exists: function (src, dst) {
        //判断是否存在
        if (fs.existsSync(dst)) {
            obj.copy(src,dst);
        } else {
            if(!fs.mkdirSync(dst)){
                 obj.copy(src,dst);
            };
        }
    },
}
exports.mkdirs = obj.mkdirs;
exports.copy = obj.copy;