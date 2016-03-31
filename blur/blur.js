/**
 * Created by luowei on 2016/3/29.
 */
var canvasw = 500;
var canvash = 750;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var raduis = 50;
canvas.width = canvasw;
canvas.height = canvash;
var image = new Image();
var clipping = {x: 100, y: 200, r: raduis};
image.src = "lss.jpg";

image.onload = function (e) {
    initCanvas();
};

function initCanvas() {
    clipping = {
        x: Math.random() * (canvas.width - raduis * 2) + raduis,
        y: Math.random() * (canvas.height - raduis * 2) + raduis,
        r: 1000
    };
    var anim = setInterval(function () {
        clipping.r -= 30;
        if (clipping.r < raduis) {
            clipping.r = raduis;
            clearInterval(anim);
        }
        draw(image, clipping);
    }, 20);
}

function draw(image, clipping) {
    ctx.clearRect(0, 0, canvasw, canvash);
    ctx.save();
    setClipping(clipping);
    ctx.drawImage(image, 0, 0);
    ctx.restore();
}

function setClipping(clipping) {
    ctx.beginPath();
    ctx.arc(clipping.x, clipping.y, clipping.r, 0, Math.PI * 2, false);
    ctx.clip();
}

function show() {
    var anim = setInterval(function () {
        clipping.r += 20;
        if (clipping.r > 1000) {
            clearInterval(anim);
        }
        draw(image, clipping);
    }, 30);
}

function reset() {
    initCanvas();
}

canvas.addEventListener("touchtart", function (e) {
    e.preventDefault();
});