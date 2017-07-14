/**
 * Created by roots on 2017/7/5.
 */
var http= require('http');
var fs = require('fs');
fs.readdir('./html',function (err , files) {
    if (err) {
        throw err;
    }
    /*console.log(files.length);
    process.exit();*/
    var folder = [];
    var filesAll = [];
    (function iterator(i) {
        if (i==files.length) {
            writePath('folder.txt',folder);
            writePath('file.txt',filesAll);
            console.log('路径获取文件夹完毕!');
            process.exit();
        }
        fs.stat('./html/'+files[i], function (err, stats) {
            if (stats.isDirectory()) {
              folder.push(files[i]);
            }else if (stats.isFile()) {
                filesAll.push(files[i]);
            }
            iterator(i+1);
        })
    })(0);
})

function writePath(file,folder) {
    fs.writeFileSync(file,folder,function (err) {
        if (err) {
            throw err;
        }
    })
}
/*
var server = http.createServer(function (req,res) {
    fs.readdir('./html',function (err , files) {
        if (err) {
          throw err;
        }
        var folder;
        (function iterator(i) {
            if (i==files.length) {
              process.exit();
            }
        })
    })
    folder = JSON.stringify(folder);
    fs.writeFile('./path.txt',folder,function (err) {
        if (err) {
            throw err;
        }
    })
    res.end();
}).listen(8080,'127.0.0.1');
*/
