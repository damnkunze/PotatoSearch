function Mover(m, x, y) {
    this.mass = m;
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.firstInLiquid = false;
}
// Newton's 2nd law: F = M * A
// or A = F / M
Mover.prototype.applyForce = function(force) {
    var f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
};
Mover.prototype.update = function() {
    // Velocity changes according to acceleration
    this.velocity.add(this.acceleration);
    // position changes by velocity
    this.position.add(this.velocity);
    // We must clear acceleration each frame
    this.acceleration.mult(0);
};
Mover.prototype.display = function() {
    noStroke();
    fill(51, 130);
    ellipse(this.position.x, this.position.y, this.mass * 16, this.mass * 16);
};
// Bounce off bottom of window
Mover.prototype.checkEdges = function() {
    if (this.position.y > (height - this.mass * 8)) {
        this.velocity.y *= -0.9;
        this.position.y = (height - this.mass * 8);
    }
    if (this.position.y < (0 + this.mass * 8)) {
        this.velocity.y *= 0.9;
        this.position.y = (0 + this.mass * 8);
    }
    if (this.position.x < (0 + this.mass * 8)) {
        this.velocity.x *= 0.9;
        this.position.x = (0 + this.mass * 8);
    }
    if (this.position.x > (width - this.mass * 8)) {
        this.velocity.x *= -0.9;
        this.position.x = (width - this.mass * 8);
    }
};