/**
 * Created by Administrator on 2016/10/25.
 */
require.config({
    baseUrl:'js',
    paths:{
        jquery:'lib/jquery-1.11.2.min',/*jquery lib*/
        TouchSlide:'lib/jquery/TouchSlide.1.1.source',
        SuperSlide:'lib/jquery/jquery.SuperSlide.2.1.1',
        slick:'lib/slick/slick.min',
        eraser:'lib/jquery/jquery.eraser',
        navLeft:'lib/jquery/jquery.nav',
        comfun:'function',
		Event:'Event',
        animation:'lib/animation/animation',
		layer:'lib/layer/layer',
		swiper:'lib/Swiper-3.4.2/dist/js/swiper',
    },
    map : {
        '*':{
            css:'lib/require-css/css',
        }
    },
    shim:{
        SuperSlide:['jquery'],
        TouchSlide:['jquery'],
        comfun:['jquery'],
        eraser:['jquery'],
        Event:['jquery'],
        navLeft:['jquery'],
        animation:{ deps:['jquery','css!lib/animation/animation.css']},
        layer:{ deps:['jquery','css!lib/layer/skin/layer.css']},
        slick:{ deps:['jquery','css!lib/slick/slick.css']},
    }
})

require(['TouchSlide','SuperSlide','Event','comfun','layer','animation'],function () {

	console.log($.prototype);
	console.log(layer);
    console.log(WOW.prototype);
    console.log(TouchSlide.prototype);

    //SuperSlide usage
    //jQuery(".doctor").slide({mainCell: ".bd ul",titCell: ".bd ul", prevCell: ".prev", nextCell: ".next", autoPage: false, effect: "left", autoPlay: true, vis: 1 });

    //animation WOW class="WOW bounce~ animatied"

    //TouchSlide usage
    //TouchSlide({slideCell: "#box6", mainCell: ".bd",prevCell: ".pre",nextCell: ".next", interTime: 5000, autoPage: false, effect: "left", autoPlay: true, vis: 1 });
})