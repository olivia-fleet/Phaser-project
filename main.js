// --- Game settings ---
const WIDTH = 500;
const HEIGHT = 350;

const BG_COLOR = 0x50a0c8;      // background
const BOX_COLOR = 0xf0dc78;     // middle box
const PLAYER_COLOR = 0xc85050;  // player circle

let player;
let target;
const speed = 220; // pixels per second

const config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: BG_COLOR,
  scene: {
    create,
    update
  }
};

new Phaser.Game(config);

function create() {
  // Middle box
  this.add.rectangle(WIDTH / 2, HEIGHT / 2, 180, 120, BOX_COLOR);

  // Player circle (named player)
  player = this.add.circle(WIDTH / 2, HEIGHT / 2, 15, PLAYER_COLOR);

  // Start target at player
  target = new Phaser.Math.Vector2(player.x, player.y);

  // When you click, set a new target
  this.input.on("pointerdown", (pointer) => {
    target.x = pointer.x;
    target.y = pointer.y;
  });
}

function update(time, delta) {
  // delta is how many milliseconds since last frame
  const dt = delta / 1000;

  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const distance = Math.hypot(dx, dy);

  if (distance > 1) {
    const step = speed * dt;

    // Move toward target without overshooting
    if (step >= distance) {
      player.x = target.x;
      player.y = target.y;
    } else {
      player.x += (dx / distance) * step;
      player.y += (dy / distance) * step;
    }
  }
}