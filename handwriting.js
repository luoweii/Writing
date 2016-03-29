/**
 * Created by luowei on 2016/3/28.
 */
var canvasWidth = Math.min(600, $(window).width() - 20);
var canvasHeight = canvasWidth;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var strokeColor = "black";
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var isMouseDown = false;
var lastloc = {x: 0, y: 0};
var lastTimestamp = 0;
var lastLineWidth = -1;

$("#controller").css("width", canvasWidth + "px");
drawGrid();

$("#clear_btn").click(
    function (e) {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        drawGrid();
    });

$(".color_btn").click(
    function (e) {
        $(".color_btn").removeClass("color_btn_selected");
        $(this).addClass("color_btn_selected");
        strokeColor = $(this).css("background-color");
    });

function beginStroke(point) {
    isMouseDown = true;
    lastloc = windowToCanvas(point.x, point.y);
    lastTimestamp = new Date().getTime();
}

function endStroke() {
    isMouseDown = false;
}

function moveStroke(point) {
    var curloc = windowToCanvas(point.x, point.y);
    var curTimestamp = new Date().getTime();
    //两点长度
    var s = calcDistance(curloc, lastloc);
    var t = curTimestamp - lastTimestamp;
    var lineWidth = calcLineWidth(t, s);

    ctx.beginPath();
    ctx.moveTo(lastloc.x, lastloc.y);
    ctx.lineTo(curloc.x, curloc.y);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastloc = curloc;
    lastTimestamp = curTimestamp;
    lastLineWidth = lineWidth;
}

//鼠标事件
canvas.onmousedown = function (e) {
    e.preventDefault();
    beginStroke({x: e.clientX, y: e.clientY});
};
canvas.onmouseup = function (e) {
    e.preventDefault();
    endStroke();
};
canvas.onmouseout = function (e) {
    e.preventDefault();
    endStroke();
};
canvas.onmousemove = function (e) {
    e.preventDefault();
    if (isMouseDown) moveStroke({x: e.clientX, y: e.clientY});
};

//触控事件
canvas.addEventListener("touchstart", function (e) {
    e.preventDefault();
    var touch = e.touches[0];
    beginStroke({x: touch.pageX, y: touch.pageY});
});
canvas.addEventListener("touchmove", function (e) {
    e.preventDefault();
    if (isMouseDown) {
        var touch = e.touches[0];
        moveStroke({x: touch.pageX, y: touch.pageY});
    }
});
canvas.addEventListener("touchend", function (e) {
    e.preventDefault();
    endStroke();
});

//计算线条宽度
function calcLineWidth(t, s) {
    var minV = 0.01;
    var maxV = 4;
    var minW = 1;
    var maxW = 15;

    var v = s / t;
    var resultLineWidth;
    if (v <= minV) resultLineWidth = maxW;
    else if (v >= maxV) resultLineWidth = minW;
    else resultLineWidth = maxW - (v - minV) / (maxV - minV) * (maxW - minW);
    if (lastLineWidth == -1) return resultLineWidth;
    return lastLineWidth * 2 / 3 + resultLineWidth / 3;
}

//计算两点的长度
function calcDistance(loc1, loc2) {
    return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));
}

function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {x: Math.round(x - bbox.left), y: Math.round(y - bbox.top)};
}

//画方格
function drawGrid() {
    ctx.save();
    ctx.strokeStyle = "rgb(230,11,9)";
    ctx.beginPath();
    ctx.moveTo(3, 3);
    ctx.lineTo(canvasWidth - 3, 3);
    ctx.lineTo(canvasWidth - 3, canvasHeight - 3);
    ctx.lineTo(3, canvasHeight - 3);
    ctx.closePath();
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.beginPath();
    drawDashline(0, 0, canvasWidth, canvasHeight, 10);
    drawDashline(canvasWidth, 0, 0, canvasHeight, 10);
    // drawDashline(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight,5);
    // drawDashline(0, canvasHeight / 2,canvasWidth, canvasHeight / 2,5);
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}

//画虚线
function drawDashline(sx, sy, ex, ey, gap) {
    var numDashes = Math.floor(Math.sqrt(sx * sx + ex * ey) / gap);
    var xpos = ex - sx; //得到横向的宽度;
    var ypos = ey - sy;//得到纵向的高度;
    for (var i = 0; i < numDashes; i++) {
        if (i % 2 === 0) {
            //有了横向宽度和多少段，得出每一段是多长，起点 + 每段长度 * i = 要绘制的起点；
            ctx.moveTo(sx + (xpos / numDashes) * i, sy + (ypos / numDashes) * i);
        } else {
            ctx.lineTo(sx + (xpos / numDashes) * i, sy + (ypos / numDashes) * i);
        }
    }
}