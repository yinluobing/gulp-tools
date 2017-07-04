/**
 * Created by roots on 2017/6/29.
 */
var gulp = require('gulp'),
    debug = require('gulp-debug'),
    cache = require('gulp-cache'),
    changed = require('gulp-changed'),
    copy = require('gulp-file-copy'),
    rename = require('gulp-rename'),
    inject = require('gulp-inject'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    cssver = require('gulp-make-css-url-version'),
    cssmin = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    fileinclude = require('gulp-file-include'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    pump = require('pump'),
    sourcemaps = require('gulp-sourcemaps');

/*********项目开发配置**********/
var _dev = {
    pkg: 'pro',
    version: '1.0',
    meta: {                             //                                              /
        devPath: 'build/',              // 开发路径                                      build/
        outPath: 'dist/',               // 输出路径                                      dist/
        imgPath: 'img/',                // 图片路径（相当于开发|输出路径）                  build/img/ | dist/img/
        lessPath: 'less/',              // less路径                                      build/less/
        cssPath: 'css/',                // css路径（相对于输出路径）                       build/css/ | dist/css/
        tplPath: 'tpl/',                // 模板路径                                      build/tpl/ | build/tpl/
        jsPath: 'js/',                  // js路径（相对于开发|输出路径）                   build/js/  | dist/js/
        libPath: 'lib/',                // 项目中使用到的库（相对于开发|输出路径）           build/lib/ | dist/lib/
        desktopImg: 'C:/Users/roots/Desktop/images'
    },
    devSuffix: '_',                      // 开发后缀
    outSuffix: '.min',                   // 输出后缀
    except: ['require', 'exports', 'module', '$', 'mui', 'Vue', 'VueMaterial'],    // 排除混淆关键字
    browsers: ['> 1%', 'last 5 versions', 'Android >= 4.0', 'ios 7'],              // 浏览器兼容性
    fileinclude: {                       // html文件合并
        prefix: '@@',                   // 变量前缀
        suffix: ''                      // 变量后缀
    },
    jsfileinclude: {                     // js文件合并
        prefix: '//{{',                 // 变量前缀
        suffix: '}}'                    // 变量后缀
    }
};

/*********自动构建配置**********/
var _config = {
    copy: [                                                     // 文件复制配置（不同的路径需要配置不同的对象）
        {                                                       // copy webapp/lib -> build/lib
            filePath: _dev.meta.devPath + _dev.meta.libPath,     // 待复制路径
            outPath: _dev.meta.outPath + _dev.meta.libPath,      // 目标路径
            fileName: '*'                                     // 文件
        },
        {                                                       // 字体文件
            filePath: _dev.meta.devPath + 'fonts/',
            outPath: _dev.meta.outPath + 'fonts/',
            fileName: '*.{ttf,eof,svg,woff}'
        },
        {                                                       // json文件
            filePath: _dev.meta.devPath + 'json/',
            outPath: _dev.meta.outPath + 'json/',
            fileName: '*.json'
        },
        {
            filePath: _dev.meta.desktopImg,
            outPath: _dev.meta.devPath + _dev.meta.imgPath,
            fileName: '*.{png,jpg,gif,ico}'
        },
    ],

    html: {
        filePath: _dev.meta.devPath,                           // html模版文件路径
        fileName: '**/*.html',                                  // 待处理的html文件
        outPath: _dev.meta.outPath,                            // 处理之后的文件输出路径
        abandon: '**/' + _dev.devSuffix + '*.html',                     // 不处理的文件
    },
    less: {
        filePath: _dev.meta.devPath + _dev.meta.lessPath,
        outPath: _dev.meta.outPath + _dev.meta.cssPath,
        fileName: 'style.less',
        abandon: _dev.devSuffix + '*.less'
    },

    css: {
        filePath: _dev.meta.devPath + _dev.meta.cssPath,
        outPath: _dev.meta.outPath + _dev.meta.cssPath,
        fileName: '*.css',
        abandon: _dev.devSuffix + '*.css'
    },

    img: {
        filePath: _dev.meta.devPath + _dev.meta.imgPath,
        outPath: _dev.meta.outPath + _dev.meta.imgPath,
        fileName: '**/*.{png,jpg,gif,ico}'
    },

    js: {
        filePath: _dev.meta.devPath + '_' + _dev.meta.jsPath,
        outPath: _dev.meta.outPath + _dev.meta.jsPath,
        compilePath: _dev.meta.devPath + _dev.meta.jsPath,
        contactPath: _dev.meta.devPath + '_' + _dev.meta.jsPath + 'contact/',
        fileName: '**/*.js',
        abandon: _dev.devSuffix + '*.js'
    }
};

var _watch = [
    _config.html.outPath + _config.html.fileName,
    _config.css.outPath + _config.css.fileName,
    _config.js.outPath + _config.js.fileName,
    _config.img.outPath + _config.img.fileName
];

/*********Html Inject contact模块合并**********/
gulp.task('html', function (cb) {
    pump([
        gulp.src([_config.html.filePath + _config.html.fileName, '!' + _config.html.filePath + _config.html.abandon]),
        changed(_config.html.outPath, {extension: 'html'}),
        debug({title: '正在进行inject：'}),
        inject(gulp.src([_config.js.compilePath + _config.js.fileName, _config.css.filePath + _config.css.fileName], {read: false}), {relative: true}),
        gulp.dest(_config.html.filePath),
        changed(_config.html.outPath, {extension: 'html'}),
        debug({title: '正在合并html：'}),
        fileinclude({
            prefix: _dev.fileinclude.prefix,
            suffix: _dev.fileinclude.suffix,
        }),
        gulp.dest(_config.html.outPath)
    ], cb)
});

/*********less编译 cssmin autoprefixer css文件MD5**********/
gulp.task('less', function (cb) {
    pump([
        gulp.src([_config.less.filePath + _config.less.fileName, '!' + _config.less.filePath + _config.less.abandon]), // 获取任务需要的文件
        changed(_config.less.outPath, {extension: _dev.outSuffix + '.css'}),  // .min.css  检测目标文件是否发生变化
        debug({title: '正在编译less：'}),
        less(),// 该任务调用的模块
        rename({suffix: _dev.outSuffix}),//rename压缩后的文件名     https://www.npmjs.com/package/gulp-rename
        cssver(), // 给css文件里引用文件加版本号（文件MD5）
        autoprefixer({
            browsers: _dev.browsers,
            cascade: true,
            remove: false //是否去掉不必要的前缀 默认：true
        }),
        cssmin({
            advanced: true, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: '', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false, //类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*' //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }),
        gulp.dest(_config.css.filePath),// 编译之后的css文件存放位置
        gulp.dest(_config.css.outPath)// 生产项目的css文件存放位置
    ], cb);
});

/*********js压缩**********/
gulp.task('js', function (cb) {
    pump([
        gulp.src([_config.js.filePath + _config.js.fileName, '!' + _config.js.filePath + _config.js.abandon, '!' + _config.js.contactPath + _config.js.fileName]), // 获取任务需要的文件
        changed(_config.js.compilePath, {extension: _dev.outSuffix + '.js'}),// .min.js 检测目标文件是否发送变化
        sourcemaps.init(),
        debug({title: '正在检测js语法：'}),
        jshint(),
        jshint.reporter(stylish),
        rename({                                  // rename压缩后的文件名
            suffix: _dev.outSuffix                // 追加后缀
        }),
        debug({title: '正在压缩js：'}),
        uglify(                                 //压缩
            {
                mangle: true,                   //类型：Boolean 默认：true 是否修改变量名
                compress: true,                 //类型：Boolean 默认：true 是否完全压缩
            }
        ),
        sourcemaps.write('./maps', {
            mapFile: function (mapFilePath) {
                return mapFilePath.replace('.js.map', '.map');
            }
        }),
        gulp.dest(_config.js.compilePath),         //输出到文件夹
        gulp.dest(_config.js.outPath),        //输出到目标文件
    ], cb);
});

/*********图片压缩（只压缩修改的图片，没有修改的图片直接从缓存文件读取）**********/
gulp.task('imgmin', function (cb) {
    pump([
        gulp.src([_config.img.filePath + _config.img.fileName]),
        changed(_config.img.outPath),
        debug({title: '正在进行图片压缩：'}),
        cache(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        })),
        gulp.dest(_config.img.outPath)
    ], cb)
});


/*********拷贝html css到目标文件**********/
_config.copy.push(_config.html);

/*********文件复制**********/
gulp.task('copy', function () {
    // ES6
    return _config.copy.map(item => gulp.src(item.filePath + item.fileName)
        .pipe(changed(item.outPath))
        .pipe(debug({title: '正在复制文件：'}))
        .pipe(gulp.dest(item.outPath))
    )
})

/*------------------------------- 监听 ----------------------------------------*/

/*********文件监听copy**********/
gulp.task('watchcopy', function () {
    // 监听img文件变化自动执行imgmin
    return _config.copy.map(item => gulp.watch(item.filePath + item.fileName, ['copy']))
});

/*********html文件监听**********/
gulp.task('watchhtml', function () {
    // 监听html文件变化自动执行html
    return gulp.watch(_config.html.filePath + _config.html.fileName, ['html'])
});

/*********less文件监听**********/
gulp.task('watchless', function () {
    // 监听less文件变化自动执行less
    return gulp.watch(_config.less.filePath + _config.less.fileName, ['less']);
});

/*********js文件监听**********/
gulp.task('watchjs', function () {
    // 监听js文件变化自动执行cleanjs和jsmin
    return gulp.watch(_config.js.filePath + _config.js.fileName, ['js']);
});

/*********img文件监听**********/
gulp.task('watchimg', function () {
    // 监听img文件变化自动执行imgmin
    return gulp.watch(_config.img.filePath + _config.img.fileName, ['imgmin']);
});


/*********自动刷新**********/
gulp.task('run', function () {
    browserSync({
        server: {
            file: '*',
            baseDir: "./dist",
        }
    });
    return gulp.watch(_watch, {readDelay: 300}).on('change', browserSync.reload);
})

/*------------------------------- end监听 ----------------------------------------*/

/*********gulp默认任务**********/
gulp.task('default', function (callback) {
    runSequence("watchless", "watchcopy", "watchimg", "watchjs", 'watchhtml', 'run', callback);
});