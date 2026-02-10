// key.js
export class Key {
  constructor(scene, x, y, textureKey) {
    this.scene = scene;
    this.collected = false;

    this.image = scene.add.image(x, y, textureKey).setScale(0.6);
    this.pos = new Phaser.Math.Vector2(x, y);
  }

  touchesCircle(x, y, radius) {
    const dx = x - this.pos.x;
    const dy = y - this.pos.y;
    return (dx * dx + dy * dy) < (radius * radius);
  }

  collect() {
    this.collected = true;
    this.image.setVisible(false);
  }
}