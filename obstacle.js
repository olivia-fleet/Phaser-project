// obstacle.js
class Obstacle {
  constructor(scene, x, y, width, height, color) {
    this.scene = scene;
    this.color = color;

    // Rectangle data (we keep it simple!)
    this.rect = new Phaser.Geom.Rectangle(
      x - width / 2,
      y - height / 2,
      width,
      height
    );

    // Draw it
    this.graphics = scene.add.graphics();
    this.draw();
  }

  draw() {
    this.graphics.clear();
    this.graphics.fillStyle(this.color, 1);
    this.graphics.fillRectShape(this.rect);
  }

  blocksCircle(circleX, circleY, radius) {
    // Make a circle and ask Phaser if it touches our rectangle
    const circle = new Phaser.Geom.Circle(circleX, circleY, radius);
    return Phaser.Geom.Intersects.CircleToRectangle(circle, this.rect);
  }
}