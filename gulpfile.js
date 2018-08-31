const gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    gulpRemoveHtml = require('gulp-remove-html'),
    htmlmin = require('gulp-htmlmin'), //标签清除
    removeEmptyLines = require('gulp-remove-empty-lines'), //清除空白行
    minifycss = require('gulp-minify-css'),
    // jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    // notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    less = require('gulp-less'),
    gutil = require('gulp-util'),
    htmlImport = require('gulp-html-import'),
    sequence = require('gulp-sequence'),
    connect = require('gulp-connect'),
    replace = require('gulp-replace'),
    fs = require('fs'),
    bower = require('gulp-bower'),
    openurl = require('openurl'),
    argv = process.argv,
    // 项目操作
    readline = require('readline'),
    colors = require('colors');

//npm install gulp -g

//npm install openurl gulp-sequence gulp-bower gulp-connect gulp-htmlmin gulp-html-import gulp-util gulp-autoprefixer gulp-minify-css jshint gulp-jshint gulp-uglify gulp-imagemin gulp-rename gulp-clean gulp-concat gulp-notify gulp-cache gulp-less --save-dev

const config = JSON.parse(fs.readFileSync('config.json')),
    path = config.list[config.name].path;

// html压缩
gulp.task('html', function () {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: false, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    return gulp.src(path + '/*.html')
        .pipe(htmlImport(path + '/components/'))
        .pipe(replace(/"\/dist\//g, '"/'))
        .pipe(replace(/'\/dist\//g, '\'/'))
        .pipe(gulpRemoveHtml()) //清除特定标签
        .pipe(removeEmptyLines({removeComments: true})) //清除空白行
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/'))
        .pipe(connect.reload());
});

// 样式
gulp.task('styles', function () {
    return gulp.src(path + '/styles/style.less')
        .pipe(less())
        .pipe(replace(/"\/dist\//g, '"/'))
        .pipe(replace(/'\/dist\//g, '\'/'))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(connect.reload());
});


// 脚本
gulp.task('scripts', function () {
    return gulp.src([path + '/scripts/**/*.js'])
    // .pipe(jshint('.jshintrc'))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        // .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(replace(/"\/dist\//g, '/'))
        .pipe(replace(/'\/dist\//g, '\'/'))
        .pipe(replace(/!\/dist\//g, '!/'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist/scripts'))
        .pipe(connect.reload());
});

// 图片
gulp.task('images', function () {
    return gulp.src(path + '/images/**/*')
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist/images'))
        .pipe(connect.reload());
    // .pipe(notify({message: 'Images task complete'}));
});

// 清理
gulp.task('clean', function () {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images', 'dist/*.html'], {read: false})
        .pipe(clean());
});

// 看守
gulp.task('watch', function () {

    // 看守所有.less档
    gulp.watch(path + '/styles/**/*.less', ['styles']);

    // 看守所有.js档
    gulp.watch(path + '/scripts/**/*.js', ['scripts']);

    // 看守所有图片档
    gulp.watch(path + '/images/**/*', ['images']);

    // 看守所有.html档
    gulp.watch(path + '/*.html', ['html']);

});

// 服务
gulp.task('server', function () {
    connect.server({
        root: ['dist'],  // 监控的目录
        port: config.port,      // 端口
        livereload: true,   // 启用热加载
    });
});

// 依赖
gulp.task('bower', function () {
    return bower({directory: './bower_components', cwd: './dist', cmd: 'install'})
});

// 默认
gulp.task('default', sequence('clean', 'styles', 'scripts', 'images', 'watch', 'server', 'html', function () {
    console.log("执行完成！");
    openurl.open('http://localhost:' + config.port)
}))

// 构建
gulp.task('build', ['clean'], function () {
    sequence('clean', 'styles', 'scripts', 'images', function () {
        console.log("执行完成！");
    })
});
