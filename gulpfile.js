const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const gulpRemoveHtml = require('gulp-remove-html');
const htmlmin = require('gulp-htmlmin');
// 标签清除
const removeEmptyLines = require('gulp-remove-empty-lines');
// 清除空白行
const minifycss = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const cache = require('gulp-cache');
const less = require('gulp-less');
const gutil = require('gulp-util');
const htmlImport = require('gulp-html-import');
const sequence = require('gulp-sequence');
const connect = require('gulp-connect');
const fs = require('fs');
const openurl = require('openurl');
const config = JSON.parse(fs.readFileSync('config.json'));
const path = config.list[config.name].path;

// 项目操作
// npm install gulp -g


// html压缩
gulp.task('html', function () {
    let options = {
        removeComments: true, // 清除HTML注释
        collapseWhitespace: false, // 压缩HTML
        collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, // 删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
        minifyJS: true, // 压缩页面JS
        minifyCSS: true // 压缩页面CSS
    };
    return gulp.src(path + '/*.html')
        .pipe(htmlImport(path + '/components/'))
        .pipe(gulpRemoveHtml()) // 清除特定标签
        .pipe(removeEmptyLines({removeComments: true})) // 清除空白行
        .pipe(htmlmin(options))
        .pipe(gulp.dest(path + '/dist/'))
        .pipe(connect.reload());
});

// 样式
gulp.task('css', function () {
    return gulp.src(path + '/statics/css/style.less')
        .pipe(less())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(path + '/dist/statics/css'))
        .pipe(gulp.dest(path + '/statics/css'))
        .pipe(connect.reload());
});

// 拷贝
gulp.task('copy', function () {
    if (fs.exists(path + '/dist/statics')) {
        return false;
    }
    return gulp.src('./statics/**/*')
        .pipe(gulp.dest(path + '/dist/statics/'));
});

// 脚本
gulp.task('js', function () {
    return gulp.src([path + '/statics/js/**/*.js', '!' + path + '/statics/js/**/*.min.js'])
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(concat('main.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest(path + '/dist/statics/js'))
        .pipe(gulp.dest(path + '/statics/js'))
        .pipe(connect.reload());
});

// 图片
gulp.task('img', function () {
    return gulp.src(path + '/statics/img/**/*')
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest(path + '/dist/statics/img'))
        .pipe(connect.reload());
});

// 清理
gulp.task('clean', function () {
    return gulp.src([path + '/dist/statics/css', path + '/dist/statics/js', path + '/dist/statics/img', path + '/dist/*.html'], {read: false})
        .pipe(clean());
});

// 看守
gulp.task('watch', function () {
    // 看守所有.less档
    gulp.watch(path + '/statics/css/**/*.less', ['css']);
    // 看守所有.js档
    gulp.watch(path + '/statics/js/**/*.js', ['js']);
    // 看守所有图片档
    gulp.watch(path + '/statics/img/**/*', ['img']);
    // 看守所有.html档
    gulp.watch(path + '/*.html', ['html']);

});

// 服务
gulp.task('server', function () {
    connect.server({
        root: [path + '/dist'], // 监控的目录
        port: config.port, // 端口
        livereload: true // 启用热加载
    });
});

// 默认
gulp.task('default', sequence('clean', 'copy', 'css', 'js', 'img', 'watch', 'server', 'html', function () {
    console.log('执行完成！');
    openurl.open('http://localhost:' + config.port);
}));

// 构建
gulp.task('build', ['clean'], function () {
    sequence('clean', 'css', 'js', 'img', function () {
        console.log('执行完成！');
    });
});
