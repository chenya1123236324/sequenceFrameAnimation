function initMain() {
    var fps = 60;
    var now;
    var then = Date.now();
    var aniRate = 12;
    var interval = 1000 / aniRate;
    var delta;

    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

    var sc = window.innerWidth / 750;
    var $main = $('#main');
    var desW = 750;
    var desH = 1206;
    var viewHeight = $(window).height();

    var isLoading = false; //用来记录是否预加载完成
    var isAnimate = false; //用来记录是否播放

    var loadManager;
    var anibg = $("#gif")[0];  //初始加载时的第一张图片
    var loadt = $('#progressArea');  //进度条
    var aniId = 0; //first    第一个序列帧图片
    var aniNum = 55; //last   最后一个序列帧图片
    var aniArr = [];

    init();

    function init() {
        $main.css('height',viewHeight);
//            function nowWidth(){
//                var w = desW/desH * viewHeight;
//                return w;
//            }
//$li.css('backgroundPosition',( (desW - nowWidth())/2 )+'px 0');
//         预加载
        initLoading();
    }
    function initLoading() {
        if (texture_LH) {    //texture_LH在texConfig.js中
            loadManager = new LoadManager_LH(texture_LH, "./images/");
            loadManager.onLoadProgress = loadProgress;
            loadManager.onLoadComplete = loadComplete;
            loadManager.load();
        }
        isLoading = true;
    }
    function loadProgress(per) {
        setLoading(per);
        // $('#loading span').html(parseInt(per*100) +'%');
    }
    function loadComplete(event) {
        // console.log(event.ani);
        aniArr = event.ani;
        initAni();
        $('#preLoadArea').remove();  //移除
    }
    function setLoading(per) {
        loadt.html(parseInt(per * 100) + '%');
    }
    function initAni() {
        isLoading = false;
        isAnimate = true;
    }

    //刷新场景
    requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
        function(callback) {
            setTimeout(callback, 1000 / fps);
        };

    function go() {
        if (planeAnimate()) {

            // loadt.remove();
            // return
        };
        requestAnimationFrame(go);
    }
    requestAnimationFrame(go);

    function planeAnimate() {
        now = Date.now();
        delta = now - then;
        if (delta > interval) {
            // 这里不能简单then=now，否则还会出现上边简单做法的细微时间差问题。例如fps=10，每帧100ms，而现在每16ms（60fps）执行一次draw。16*7=112>100，需要7次才实际绘制一次。这个情况下，实际10帧需要112*10=1120ms>1000ms才绘制完成。
            then = now - (delta % interval);

            if (isAnimate) {
                // console.log(aniId);
                //判读播完
                if (aniId >= aniNum) {
                    isAnimate = false;
                    console.log("--end--")




                    setTimeout(function () {
                        $("#page_loading").remove();
                        $('.icon_next').fadeIn().addClass('on');
                        $('#fullpage').fullpage({
                            scrollingSpeed: 700,
                            easing: 'easeInQuint',
                            afterLoad: function(anchorLink, index){
                                if(index == 2){
                                    $(".useCollocation").addClass("useCollocationBtn");
                                    $(".useCollocationBtn").bind("touchend", function(){
                                        console.log("第二页使用搭配");
                                    });
                                    //气泡序列帧
                                    $(".bubbleAnimation").addClass("bubble");
                                    page_4_water_move();

                                }
                            },
                            onLeave: function(index, direction){
                                if(index == '2'){
                                    $(".useCollocation").removeClass("useCollocationBtn");
                                }
                            }
                        });

                    }, 200);


                }
                anibg.src = aniArr[aniId].src;
                aniId = aniId + 1 <= aniNum ? aniId + 1 : 0; // 重复播发

            }
            // anibg.src = "plane_earth_000" + (bid<10?"0"+bid:bid) + " sprite";
            // var bid = parseInt(bb.attr('frameId'));
            // var bnum = parseInt(bb.attr('frameNum'));
            // var fstr = "plane_earth_000" + (bid<10?"0"+bid:bid) + " sprite";
            //
            // //console.log(bid);
            // bid = bid+1<=bnum?bid+1:0;
            // bb.attr("frameId",bid);
            // bb.removeClass().addClass(fstr);
        }
    }



    //气泡序列帧动画
    function page_4_water_move() {
        var i = 1;
        var t = setInterval(animate_page_4_water, 30);
        function animate_page_4_water() {
            $(".bubbleAnimation img").attr('src', "./images/b/b00" + (i < 10 ? '0' + i : i) + ".png");
            // console.log(i);
            i++;
            if (i > 79) {
                // clearInterval(t);
                i = 1;
            };
        }
    }




}

