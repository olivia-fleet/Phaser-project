// main.js

const WIDTH = 500;
const HEIGHT = 350;

const BG_COLOR = 0x50a0c8;       // background
const OBSTACLE_COLOR = 0xf0dc78; // boxes
const PLAYER_COLOR = 0xc85050;   // player circle
const KEY_COLOR = 0x3cdc5a;      // key triangle

let player;
let target;

const playerRadius = 15;
const playerSpeed = 220; // pixels per second

let obstacles = [];
let key;

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: BG_COLOR,
  scene: { create, update }
};

new Phaser.Game(config);

function create() {
  // Obstacles (3 boxes) — create them first so we can find a safe start position
  obstacles = [
    new Obstacle(this, WIDTH / 2, HEIGHT / 2, 180, 120, OBSTACLE_COLOR), // middle
    new Obstacle(this, 105, 80, 90, 40, OBSTACLE_COLOR),                 // extra
    new Obstacle(this, 410, 285, 100, 50, OBSTACLE_COLOR),               // extra
  ];

  // Player (a circle) — find a non-blocking starting position
  function findSafeStart() {
    const margin = playerRadius + 5;
    const step = 10;
    for (let yy = margin; yy <= HEIGHT - margin; yy += step) {
      for (let xx = margin; xx <= WIDTH - margin; xx += step) {
        const blocked = obstacles.some(obs => obs.blocksCircle(xx, yy, playerRadius));
        if (!blocked) return { x: xx, y: yy };
      }
    }
    // fallback to top-left corner if no free spot found
    return { x: margin, y: margin };
  }

  const start = findSafeStart();
  player = this.add.circle(start.x, start.y, playerRadius, PLAYER_COLOR);

  // Click target starts at player
  target = new Phaser.Math.Vector2(player.x, player.y);

  // Key (triangle)
  key = new Key(this, 430, 80, 12, KEY_COLOR);

  // When you click, change the target
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

    // direction (normalized)
    const dirX = dx / distance;
    const dirY = dy / distance;

    // Try the next position
    let nextX = player.x;
    let nextY = player.y;

    if (step >= distance) {
      nextX = target.x;
      nextY = target.y;
    } else {
      nextX = player.x + dirX * step;
      nextY = player.y + dirY * step;
    }

    // Ask obstacles if they block the player
    const blocked = obstacles.some(obs => obs.blocksCircle(nextX, nextY, playerRadius));

    if (!blocked) {
      player.x = nextX;
      player.y = nextY;
    } else {
      // If blocked, try sliding around:
      // Try X-only movement, then Y-only movement
      const slideXBlocked = obstacles.some(obs => obs.blocksCircle(player.x + dirX * step, player.y, playerRadius));
      const slideYBlocked = obstacles.some(obs => obs.blocksCircle(player.x, player.y + dirY * step, playerRadius));

      if (!slideXBlocked) {
        player.x = player.x + dirX * step;
      } else if (!slideYBlocked) {
        player.y = player.y + dirY * step;
      }
      // else: stuck this frame
    }
  }

  // --- Pick up the key ---
  if (!key.collected && key.touchesCircle(player.x, player.y, playerRadius)) {
    key.collect();
  }
}