
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
function floor(x, height) {
  this.x = x;
  this.width = 1000;
  this.height = height;
}

var world = {
  height: 720,
  width: 1280,
  gravity: 100,
  highestFloor: 240,
  speed: 5,
  distanceTravelled: 0,
  floorTiles: [
    new floor(0, 140)
  ],
  moveFloor: function() {
    for(index in this.floorTiles) {
      var tile = this.floorTiles[index];
      tile.x -= this.speed;
      this.distanceTravelled += this.speed;
    }
  },

  addFutureTiles: function() {
    if(this.floorTiles.length >= 3) {
      return;
    }
    var previousTile = this.floorTiles[this.floorTiles.length - 1];
    var randomHeight = Math.floor(Math.random() * this.highestFloor) + 20;
    var leftValue = (previousTile.x + previousTile.width);
    var next = new floor(leftValue, randomHeight);
    this.floorTiles.push(next);
  },

  cleanOldTiles: function() {
    for(index in this.floorTiles) {
      if(this.floorTiles[index].x <= -this.floorTiles[index].width) {
        this.floorTiles.splice(index, 1);
      }
    }
  },

  getDistanceToFloor: function(playerX) {
    for(index in this.floorTiles) {
      var tile = this.floorTiles[index];
      if(tile.x <= playerX && tile.x + tile.width >= playerX) {
        return tile.height;
      }
    }
    return -1;
  },

  tick: function() {
    this.cleanOldTiles();
    this.addFutureTiles();
    this.moveFloor();
  },

  draw: function() {
    ctx.fillStyle = "khaki";
    ctx.fillRect (0, 0, this.width, this.height);
    for(index in this.floorTiles) {
      var tile = this.floorTiles[index];
      var y = world.height - tile.height;
      ctx.fillStyle = "red";
      ctx.fillRect(tile.x, y, tile.width, tile.height);
    }
  }
};

var player = {
  x: 160,
  y: 340,
  height: 20,
  width: 20,
  applyGravity: function() {
    var platformBelow = world.getDistanceToFloor(this.x);
    this.currentDistanceAboveGround = world.height - this.y - platformBelow;
  },

  processGravity: function() {
    this.y += world.gravity;
    var floorHeight = world.getDistanceToFloor(this.x, this.width);
    var topYofPlatform = world.height - floorHeight;
    if(this.y > topYofPlatform) {
      this.y = topYofPlatform;
    }
  },

  tick: function() {
    this.processGravity();
    this.applyGravity();
  },

  draw: function() {
    ctx.fillStyle = "black";
    ctx.fillRect(player.x, player.y - player.height, this.height, this.width);
  }
};

function tick() {
  player.tick();
  world.tick();
  world.draw();
  player.draw();
  window.setTimeout("tick()", 1000/60);
}
tick();