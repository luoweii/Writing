/**
 * Created by luowei on 2016/4/7.
 */
var loopPlayerInit = (function () {
    var btnLeft, btnRight, btnPlay, imgList;
    var origin = ['125px', '600px'];
    var imgs = createImg([['img/1.jpg', 'img/2.jpg', 'img/3.jpg', 'img/4.jpg'],
        ['img/5.jpg', 'img/6.jpg', 'img/7.jpg', 'img/8.jpg'], ['img/9.jpg', 'img/10.jpg', 'img/11.jpg', 'img/12.jpg']]);
    var imgIndex = 0;
    var imgAng = 45;

    function init() {
        btnLeft = $(".btnLeft");
        btnRight = $(".btnRight");
        btnPlay = $(".btnPlay");
        imgList = $(".mainbox ul li");

        configer();
        setEvent();
    }

    function configer() {
        imgList.transform({origin: origin});
        imgList.each(function (i) {
            $(this).transform({rotate: (i * 8 - 12) + "deg"});
        });
    }

    function setEvent() {
        btnLeft.bind("click", function () {
            animgo(-1);
            return false;
        });
        btnRight.bind("click", function () {
            animgo(1);
            return false;
        });
        btnPlay.bind("click", function () {
            return false;
        });
    }

    function animgo(d) {
        imgIndex += d;
        if (imgIndex >= imgs.length)
            imgIndex = 0;
        imgList.each(function (i) {
            var newImg = $(imgs[imgIndex][i]);
            var thisImg = $(this).children("img");
            $(this).append(newImg);
            newImg.transform({origin: origin,rotate:(imgAng*-d)+"deg"});
            thisImg.transform({origin: origin});
            thisImg.animate({rotate:imgAng*d+"deg"},500,function () {
                
            });
            newImg.animate({rotate:"0deg"},500, function () {
                thisImg.remove();
            });
        });
    }

    function createImg(arr) {
        var imgs = [];
        for (var i in arr) {
            imgs[i] = [];
            for (var x in arr[i]) {
                imgs[i][x] = new Image();
                imgs[i][x].src = arr[i][x];
            }
        }
        return imgs;
    }

    return init;
})();

loopPlayerInit();