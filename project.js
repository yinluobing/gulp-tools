// 引用
require('colors');
const readLine = require('readline'),
    fs = require('fs-extra'),
    spawn = require('cross-spawn');

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 配置项目
let config = JSON.parse(fs.readFileSync('config.json'));
let name = '',
    path = '';

/**
 * 编辑配置文件
 * @param params
 * @param opreat add|edit|delete
 */
let editConfig = function (params = {name: "", path: ""}, opreat) {
    let run = true;
    switch (opreat) {
        case 'add':
            config.name = params.name;
            config.list[params.name] = {'path': config.path + params.path + '/'};
            fs.open("config.json", "w+", function (err, fd) {

                if (err) return console.error(err);

                fs.write(fd, JSON.stringify(config), 'utf-8', function (err) {
                    if (err) throw err
                });

                console.log("你的项目路径是".green, (config.path + params.path).magenta);

                // 项目文件夹是否存在
                fs.exists(config.path + params.path, function (exists) {
                    if (!exists) {
                        fs.copy(config.path + config.template, config.path + params.path, err => {
                            if (err) return console.error(err);
                            console.log('success!'.blue)
                        })
                    }
                });

                fs.close(fd)
            });
            break;

        case 'edit':
            config.name = params.name;
            fs.open("config.json", "w+", function (err, fd) {
                if (err) console.error(err);
                fs.write(fd, JSON.stringify(config), 'utf-8', function (err) {
                    if (err) throw err
                });
                console.log('切换项目成功'.blue);
                console.log("你的项目路径是".green, config.list[config.name].path.magenta);
                fs.close(fd)
            });
            break;

        case 'delete':

            // 是否为当前项目
            if (params.name === config.name) {
                for (i in config.list) {
                    if (params.name !== i) {
                        config.name = i;
                        break;
                    }
                }
            }

            // 删除项目属性
            delete config.list[params.name];

            // 保存项目文件
            fs.open("config.json", "w+", function (err, fd) {
                if (err) console.error(err);
                fs.write(fd, JSON.stringify(config), 'utf-8', function (err) {
                    if (err) throw err
                });
                console.log(('删除 “ ' + params.name + ' ” 项目成功').red);
                fs.close(fd)
            });
            run = false;
            break;
    }
    rlClose(run)
};

/**
 * 添加项目
 */
let add = () => {

    // 项目路径
    rl.setPrompt('请输入项目名称:'.cyan);
    rl.prompt();
    rl.on('line', (param) => {
        if (undefined !== config.list[param] && !name) {
            console.log('项目列表中已经存在:' + param.red);
            rl.prompt()
        } else {
            if (name) {
                let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");

                // 中文
                if (reg.test(param)) {
                    console.log('项目路径不能包含中文'.red);
                    rl.prompt()
                } else {
                    if (!path) {
                        path = param;
                        // 存在
                        fs.exists(config.path + param + '/', function (exists) {
                            if (exists) {
                                console.log('项目路径:'.yellow + (config.path + param + '/已经存在').red);
                                rl.setPrompt('项目路径操作:1、确认 2、修改 '.green);
                                rl.prompt()
                            } else {
                                editConfig({name: name, path: param}, 'add')
                            }

                        })
                    } else {
                        switch (param) {

                            // 存在路径
                            case '1':
                                editConfig({name: name, path: path}, 'add');
                                break;

                            // 修改路径
                            case '2':
                                path = '';
                                rl.setPrompt('请输入项目路径:'.cyan);
                                rl.prompt();
                                break;

                            default:
                                rl.prompt();
                                break
                        }
                    }
                }
            } else {
                name = param;
                console.log('你的项目名称是:'.green, param.magenta);
                rl.setPrompt('请输入项目路径:'.cyan);
                rl.prompt()
            }

        }
    })
};

/**
 * 项目列表
 */
let list = () => {
    let j = 1,
        change = true,
        operas = null;

    console.log(('当前项目是:'.green + config.name.magenta));

    for (i in config.list) {
        i === config.name ? console.log((j + '.' + i).magenta) : console.log((j + '.' + i).blue);
        j++
    }

    rl.setPrompt('操作:'.cyan + '1、切换项目,2、删除项目,3、关闭 '.green);
    rl.prompt();

    rl.on('line', (param) => {
        if ((param === '' || param === '1') && change && !operas) {
            rl.setPrompt('请输入项目名称:'.cyan);
            rl.prompt();
            change = false;
            operas = 1
        } else if (param === '3' && change && !operas) {
            rlClose()
        } else if (param === '2') {
            rl.setPrompt('请输入项目名称:'.cyan);
            rl.prompt();
            operas = 2
        } else {
            switch (operas) {
                case 1:
                    if (undefined === config.list[param]) {
                        console.log(('没有' + param + '项目').red);
                        rl.setPrompt('请输入项目名称:'.cyan);
                        rl.prompt()
                    } else {
                        editConfig({name: param}, 'edit')
                    }
                    break;
                case 2:
                    if (undefined === config.list[param]) {
                        console.log(('没有' + param + '项目').red);
                        rl.setPrompt('请输入删除项目名称:'.cyan);
                        rl.prompt()
                    } else {
                        editConfig({name: param}, 'delete')
                    }
                    break
            }
        }
    })

};

/**
 * 清理
 */
let clear = () => {
    for (let i in config.list) {
        fs.exists(config.list[i].path, function (exists) {
            if (!exists) {
                editConfig({name: i}, 'delete')
            }
        })
    }
};

/**
 * 初始化依赖
 */
let init = () => {
    spawn('bower', ['install'], {stdio: 'inherit'});
    rlClose(false)
}

/**
 * 关闭可读流
 */
let rlClose = function (run = true) {
    if (run) {
        spawn('gulp', ['default'], {stdio: 'inherit'});
    }
    rl.close()
};

/**
 * 提示
 */
let tips = () => {
    console.log('Usage: node project');
    console.log('   where project is one of:');
    console.log('   add,list(edit|delete)'.green)
};

/**
 * 主函数
 */
let main = () => {
    tips();
    rl.setPrompt('请输入操作 1、添加 2、编辑或删除 3、运行项目 4、依赖初始化 5、清理项目 '.green);
    rl.prompt();
    rl.on('line', function (param) {
        // 任务列表
        switch (param) {
            case '1':
                add();
                break;
            case '2':
                list();
                break;
            case '3':
                rlClose();
                break;
            case '4':
                init();
                break;
            case  '5':
                clear();
                break;
        }
    })
};

main();
