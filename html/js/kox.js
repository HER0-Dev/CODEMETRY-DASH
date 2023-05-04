var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
function floor(x, height) {
    this.x = x;
    this.width = 900;
    this.height = height;
}

var points = 0;
var displayPoints = document.createElement("p");
displayPoints.innerHTML = "Points: " + points;
document.body.appendChild(displayPoints);

setInterval(function () {
    points += 100;
    displayPoints.innerHTML = "Points: " + points;
}, 1000);

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        player.jump();
    }
});

var world = {
    height: 720,
    width: 1280,
    gravity: 9,
    highestFloor: 250,
    speed: 10,
    distanceTravelled: 0,
    floorTiles: [new floor(0, 140)],
    moveFloor: function () {
        for (index in this.floorTiles) {
            var tile = this.floorTiles[index];
            tile.x -= this.speed;
            this.distanceTravelled += this.speed;
        }
    },

    addFutureTiles: function () {
        if (this.floorTiles.length >= 4) {
            return;
        }
        var previousTile = this.floorTiles[this.floorTiles.length - 1];
        var randomHeight = Math.floor(Math.random() * this.highestFloor) + 30;
        var leftValue = previousTile.x + previousTile.width;
        var next = new floor(leftValue, randomHeight);
        this.floorTiles.push(next);
    },

    cleanOldTiles: function () {
        for (index in this.floorTiles) {
            if (this.floorTiles[index].x <= -this.floorTiles[index].width) {
                this.floorTiles.splice(index, 1);
            }
        }
    },

    getDistanceToFloor: function (playerX) {
        for (index in this.floorTiles) {
            var tile = this.floorTiles[index];
            if (tile.x <= playerX && tile.x + tile.width >= playerX) {
                return tile.height;
            }
        }
        return -1;
    },

    tick: function () {
        this.cleanOldTiles();
        this.addFutureTiles();
        this.moveFloor();
    },

    draw: function () {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.width, this.height);
        for (index in this.floorTiles) {
            var tile = this.floorTiles[index];
            var y = world.height - tile.height;
            ctx.fillStyle = "blue";
            ctx.fillRect(tile.x, y, tile.width, tile.height);
        }
    },
};

var player = {
    x: 160,
    y: 360,
    height: 40,
    width: 40,
    velocity: 0, // prędkość gracza
    jumpHeight: 80, // wysokość skoku
    applyGravity: function () {
        var platformBelow = world.getDistanceToFloor(this.x);
        this.currentDistanceAboveGround = world.height - this.y - platformBelow;
    },

    processGravity: function () {
        this.velocity += world.gravity; // zwiększenie prędkości gracza o grawitację
        this.y += this.velocity; // zmiana pozycji gracza o jego prędkość
        var floorHeight = world.getDistanceToFloor(this.x, this.width);
        var topYofPlatform = world.height - floorHeight;
        if (this.y > topYofPlatform) {
            this.y = topYofPlatform;
            this.velocity = 0; // zresetowanie prędkości gracza po dotknięciu podłoża
        }
    },

    jump: function () {
        var radians = (80 * Math.PI) / 180; // konwersja kąta z stopni na radiany
        var jumpVelocity = -this.jumpHeight * Math.sin(radians); // obliczenie prędkości skoku na podstawie kąta
        this.velocity = jumpVelocity; // ustawienie prędkości gracza na przeciwną do wysokości skoku
    },

    tick: function () {
        this.processGravity();
        this.applyGravity();
    },

    draw: function () {
        ctx.fillStyle = "white";
        ctx.lineWidth = "5";
        ctx.strokeStyle = "blue";
        ctx.stroke();
        ctx.fillRect(player.x, player.y - player.height, this.height, this.width);
    },
};

function tick() {
    player.tick();
    world.tick();
    world.draw();
    player.draw();
    var fps = window.setTimeout("tick()", 1000 / 60);
}
tick();
