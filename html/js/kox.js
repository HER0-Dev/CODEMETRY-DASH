// function startGame() {

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function floor(x, height) {
    this.x = x;
    this.width = 900;
    this.height = height;
}

var points = 0;

 setInterval(function () {
    points += 100;
}, 1000);

document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        player.jump();
    }
});
   var textures = {
       player: new Image(40, 40) 
   }

   function render() {
       textures.player.src = "../Logo PROKJEKT KOCOWTY.svg";
   }

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
        var randomHeight = Math.floor(Math.random() * (this.highestFloor + 20 + 20)) + 40;
        var leftValue = previousTile.x + previousTile.width;
        var next = new floor(leftValue, randomHeight);
        this.floorTiles.push(next);
 
        var xLeftFace = next.x;
        var yLeftFace = world.height - next.height;
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
setInterval(function(){
var latestTile = world.floorTiles[world.floorTiles.length - 1];
var leftFaceX = latestTile.x + latestTile.width;
var leftFaceY = world.height - latestTile.height;
// console.log("X: " + leftFaceX);
// console.log("Y: " + leftFaceY);
})

var player = {
    x: 160,
    y: 360,
    height: 40,
    width: 40,
    textures: {player: textures.player},
    velocity: 0, // prędkość
    jumpHeight: 70, // wysokość
    jumpCount: 0, // liczba skoków
    maxJumps: 2, //max skoków pod rząd
    src: 'CODEMETRY-DASH\html\Logo PROKJEKT KOCOWTY.svg',
    applyGravity: function () {
        var platformBelow = world.getDistanceToFloor(this.x);
        this.currentDistanceAboveGround = world.height - this.y - platformBelow;
    },

    processGravity: function () {
        this.velocity += world.gravity; // zwiększenie prędkości
        this.y += this.velocity; // zmiana pozycji gracza
        var floorHeight = world.getDistanceToFloor(this.x, this.width);
        var topYofPlatform = world.height - floorHeight;
        if (this.y > topYofPlatform) {
            this.y = topYofPlatform;
            this.velocity = 0;
            this.jumpCount = 0;
        }
    },

    jump: function () {
        if (this.jumpCount < this.maxJumps) {
            var radians = (80 * Math.PI) / 180;
            var jumpVelocity = -this.jumpHeight * Math.sin(radians);
            this.velocity = jumpVelocity;
            this.jumpCount++;
        }
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
        ctx.fillRect(player.x, player.y - player.height, this.width, this.height);
        ctx.drawImage(textures.player, player.x, player.y - player.height, this.width, this.height)
    },    
};

function checkCollision(player, tile) {
    var leftSideOfPlayer = player.x;
    var rightSideOfPlayer = player.x + player.width;
    var topOfPlayer = player.y - player.height;
    var bottomOfPlayer = player.y;
    var leftSideOfTile = tile.x;
    var rightSideOfTile = tile.x + tile.width;
    var topOfTile = world.height - tile.height;
    var bottomOfTile = world.height;

    if (player.x <= 0) {
        cancelAnimationFrame(animationId);
        gameOver = true;
        ctx.font = "50px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Twój wynik to " + score, canvas.width / 2 - 200, canvas.height / 2);
        restartButton.style.display = "block";
    }

    if (
        rightSideOfPlayer > leftSideOfTile &&
        leftSideOfPlayer < rightSideOfTile &&
        bottomOfPlayer > topOfTile &&
        topOfPlayer < bottomOfTile &&
        leftSideOfPlayer < leftSideOfTile //lewej ściany
    ) {
        return true;
    }

    return false;
}

function checkLeftWall(player) {
    for (var i = 0; i < world.floorTiles.length; i++) {
        var tile = world.floorTiles[i];
        if (checkCollision(player, tile)) {
            return true;
        }
    }

    return false;
};

function tick() {
    player.tick();
    world.tick();
    world.draw();
    player.draw();

    ctx.font = "55px Bebas Neue";
    ctx.fillText("Punkty: " + points, 10, 50)

    var latestTile = world.floorTiles[world.floorTiles.length - 1];
    var leftFaceX = latestTile.x + latestTile.width;
    var leftFaceY = world.height - latestTile.height;
    ctx.font = "16px Bebas Neue";
    ctx.fillStyle = "white";
    ctx.fillText("X: " + leftFaceX, 1240, 20);
    ctx.fillText("Y: " + leftFaceY, 1240, 40);

    if (checkLeftWall(player)) {
        gameOver = true;
        ctx.font = "50px Bebas Neue";
        ctx.fillStyle = "white";
        ctx.fillText("Twój wynik to " + points, canvas.width / 2 - 200, canvas.height / 2);
        restartButton.style.display = "block";
        // dsaa
    }

    if (points >= 3000) {
        world.speed = 15; // zmiana prędkości gry
    }

    if (points >= 5000) {
        world.speed = 20;
    }
    
    if (points >= 7000) {
        world.speed = 25;
    }
    if (points >= 9000) {
        world.speed = 30;
    }
    var fps = window.setTimeout("tick()", 1000 / 60);
}
  
tick();
//    function gameLoop() {
//     tick();
//      if (!gameOver) {
//        animationId = requestAnimationFrame(gameLoop);
//      }
//   }   gameLoop();
  


// }
// var startButton = document.getElementById("start");
// startButton.addEventListener("click", startGame);