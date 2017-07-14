/**
 * Created by roots on 2017/7/4.
 */
var http =require('http');
var url = require('url');
var fs = require('fs');
var server = http.createServer(function (req,res) {
    var json = {
        'a':'123',
        'b':['b1','b2','b3'],
        'c':['cccc123131313']
    };
/*    for(var key in json){
        console.log(json[key]);
    };*/
    res.writeHeader(200,{
        'Content-Type':'text/html;charset=utf8',
    });
    if (req.url=="/favicon.ico") {
      return;
    }
    console.log(req.url);
    fs.readFile('./html/index.html', function (err, data) {
        if (err) {
          throw err;
        }
        res.write(data);
        res.end('大家好');
    });
    //console.log();
   //res.write(JSON.stringify(url.parse(req.url)));
    res.write(JSON.stringify(url.parse(req.url, true).query) + "<br/>");
    // console.log(typeof req.url);
    res.write(req.url + '<br/>');
    res.write(JSON.stringify(json));

}).listen(3000,'127.0.0.1');