// main.js
import { Obstacle } from "./obstacle.js";
import { Key } from "./key.js";
import { Door } from "./door.js";
import { Inventory } from "./inventory.js";

const WIDTH = 500;
const HEIGHT = 350;

const BG_COLOR = 0x50a0c8;

const playerRadius = 15;
const playerSpeed = 220;

let player;
let target;

let obstacles = [];
let key;
let door;
let inventory;

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: BG_COLOR,
  scene: { preload, create, update }
};

new Phaser.Game(config);

function preload() {
  // Load images (give them names we can use later)
  this.load.image("player", "assets/player.png");
  this.load.image("key", "assets/key.png");
  this.load.image("obstacle", "assets/obstacle.png");
  this.load.image("door", "assets/door.png");
}

function create() {
  // Player image (we use an image now!)
  player = this.add.image(WIDTH / 2, HEIGHT / 2, "player").setScale(0.6);

  // Click target starts at player
  target = new Phaser.Math.Vector2(player.x, player.y);

  // Obstacles (3 boxes)
  obstacles = [
    new Obstacle(this, WIDTH / 2, HEIGHT / 2, 180, 120, "obstacle"),
    new Obstacle(this, 105, 80, 90, 40, "obstacle"),
    new Obstacle(this, 410, 285, 100, 50, "obstacle"),
  ];

  // Key image
  key = new Key(this, 430, 80, "key");

  // Door (locked at start)
  door = new Door(this, 50, 245, 60, 90, "door");

  // Inventory
  inventory = new Inventory(this);
  inventory.setIcon("key", "key");

  // Click to move
  this.input.on("pointerdown", (pointer) => {
    target.x = pointer.x;
    target.y = pointer.y;
  });
}

function update(time, delta) {
  const dt = delta / 1000;

  // --- Move player toward target ---
  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const distance = Math.hypot(dx, dy);

  if (distance > 1) {
    const step = playerSpeed * dt;
    const dirX = dx / distance;
    const dirY = dy / distance;

    let nextX = player.x;
    let nextY = player.y;

    if (step >= distance) {
      nextX = target.x;
      nextY = target.y;
    } else {
      nextX += dirX * step;
      nextY += dirY * step;
    }

    const blockedByObstacle = obstacles.some(o => o.blocksCircle(nextX, nextY, playerRadius));
    const blockedByDoor = door.blocksCircle(nextX, nextY, playerRadius);

    if (!blockedByObstacle && !blockedByDoor) {
      player.x = nextX;
      player.y = nextY;
    } else {
      // Slide around
      const slideXBlocked =
        obstacles.some(o => o.blocksCircle(player.x + dirX * step, player.y, playerRadius)) ||
        door.blocksCircle(player.x + dirX * step, player.y, playerRadius);

      const slideYBlocked =
        obstacles.some(o => o.blocksCircle(player.x, player.y + dirY * step, playerRadius)) ||
        door.blocksCircle(player.x, player.y + dirY * step, playerRadius);

      if (!slideXBlocked) {
        player.x += dirX * step;
      } else if (!slideYBlocked) {
        player.y += dirY * step;
      }
    }
  }

  // --- Pick up the key ---
  if (!key.collected && key.touchesCircle(player.x, player.y, playerRadius)) {
    key.collect();
    inventory.addItem("key");
  }

  // --- Try opening the door ---
  door.tryOpen(player.x, player.y, playerRadius, inventory.hasItem("key"));
}