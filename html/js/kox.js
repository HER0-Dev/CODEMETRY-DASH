var canvas;
var ctx;

function canva(){
    addEventListener();
    canvas = document.getElementsByClassName("gameCanvas");
    canvas.width = 1280;
    canvas.height = 720;
    ctx = canvas.getContext("2d")
    ctx.fillStyle = "green"
    ctx.filRect(0, 0, canvas.width, canvas.height)
}

