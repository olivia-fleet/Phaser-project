// key.js
class Key {
  constructor(scene, x, y, size, color) {
    this.scene = scene;
    this.pos = new Phaser.Math.Vector2(x, y);
    this.size = size;
    this.color = color;
    this.collected = false;

    this.graphics = scene.add.graphics();
    this.draw();
  }

  trianglePoints() {
    const x = this.pos.x;
    const y = this.pos.y;
    const s = this.size;

    // Triangle pointing up
    return [
      new Phaser.Math.Vector2(x, y - s),
      new Phaser.Math.Vector2(x - s, y + s),
      new Phaser.Math.Vector2(x + s, y + s),
    ];
  }

  draw() {
    this.graphics.clear();

    if (this.collected) return;

    const pts = this.trianglePoints();
    this.graphics.fillStyle(this.color, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(pts[0].x, pts[0].y);
    this.graphics.lineTo(pts[1].x, pts[1].y);
    this.graphics.lineTo(pts[2].x, pts[2].y);
    this.graphics.closePath();
    this.graphics.fillPath();
  }

  touchesCircle(circleX, circleY, radius) {
    // Simple: treat key like a point in the middle
    const dx = circleX - this.pos.x;
    const dy = circleY - this.pos.y;
    return (dx * dx + dy * dy) < (radius * radius);
  }

  collect() {
    this.collected = true;
    this.draw();
  }
}