/**
 * Created by yinluobing on 2018/08/29.
 */
require.config({
    baseUrl: 'js',
    paths: {
        jquery: '/dist/bower_components/jquery/dist/jquery.min',
        jquery_ui: '/dist/bower_components/jquery-ui/jquery-ui.min',
        bootstrap: '/dist/bower_components/bootstrap/dist/js/bootstrap.bundle.min',
        angular: '/dist/bower_components/angular/angular.min',
        vue: '/dist/bower_components/vue/dist/vue.min',
        lodash: '/dist/bower_components/lodash/dist/lodash.min',
        layui: '/dist/bower_components/layui/dist/layui',
        zepto: '/dist/bower_components/zepto/zepto',
    },
    map: {
        '*': {
            css: '/dist/bower_components/require-css/css.js',
        }
    },
    shim: {
        jquery_ui: {deps: ['jquery', 'css!/dist/bower_components/jquery-ui/themes/base/jquery-ui.css']},
        bootstrap: {deps: ['jquery', 'css!/dist/bower_components/bootstrap/dist/css/bootstrap.min.css']},
        layui: {deps: ['css!/dist/bower_components/layui/dist/css/layui.css']},
    }
})
require(['jquery', 'bootstrap', 'angular', 'vue', 'event', 'lodash', 'layui', 'zepto'], function () {
    console.log(_.prototype)
})
