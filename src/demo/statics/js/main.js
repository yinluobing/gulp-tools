/**
 * yinluobing 2018-10-28 16:13:31
 */
require.config({
    baseUrl: 'js',
    paths: {
        jquery: '/statics/library/jquery/dist/jquery.min',
        jquery_ui: '/statics/library/jquery-ui/jquery-ui',
        bootstrap: '/statics/library/bootstrap/dist/js/bootstrap.bundle',
        angular: '/statics/library/angular/angular',
        vue: '/statics/library/vue/dist/vue',
        lodash: '/statics/library/lodash/lodash',
        layui: '/statics/library/layui/dist/layui',
        zepto: '/statics/library/zepto/zepto'
    },
    map: {
        '*': {
            css: '/statics/library/require-css/css.js'
        }
    },
    shim: {
        jquery_ui: {deps: ['jquery', 'css!/statics/library/jquery-ui/themes/base/jquery-ui.css']},
        bootstrap: {deps: ['jquery', 'css!/statics/library/bootstrap/dist/css/bootstrap.min.css']},
        layui: {deps: ['css!/statics/library/layui/dist/css/layui.css']}
    }
});
require(['jquery', 'bootstrap', 'angular', 'vue', 'event', 'lodash', 'layui', 'zepto'], function () {
    console.log($.prototype);
});
