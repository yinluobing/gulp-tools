/**
 * Created by roots on 2017/7/4.
 */
var http =require('http');
var server = http.createServer(function (req,res) {
    console.log(typeof req);
    res.writeHeader(200,{
        'typde-content':'text/html;charset=utf-8',
    })
    res.end('大家好');
}).listen(3000,'127.0.0.1');