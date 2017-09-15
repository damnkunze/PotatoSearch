function enemyDeath(x, y, c) {
    if (enemyCounter > 1) {
        var lifetime = 5;
        var range = 10;
        var size = 40;
        var count = 30;
        enemyAnimations.push(new Explosion(x, y, c, lifetime, range, size, count));
        enemyAnimations[enemyAnimations.length - 1].explode();
    }
}

function enemyShooted(x, y, c) {
    var lifetime = 10;
    var range = 3;
    var size = 5;
    var count = 10;
    enemyAnimations.push(new Explosion(x, y, c, lifetime, range, size, count));
    enemyAnimations[enemyAnimations.length - 1].explode();
}

function playerDeath(x, y, c) {
    if (playerCounter > 1) {
        var lifetime = 2.5;
        var range = 18;
        var size = 40;
        var count = 100;
        playerAnimations.push(new Explosion(x, y, c, lifetime, range, size, count));
        playerAnimations[playerAnimations.length - 1].explode();
    }
}

function playerShooted(x, y, c) {
    var lifetime = 10;
    var range = 3;
    var size = 5;
    var count = 10;
    playerAnimations.push(new Explosion(x, y, c, lifetime, range, size, count));
    playerAnimations[playerAnimations.length - 1].explode();
}
//========================================================================
function Explosion(x, y, c, lifetime, range, size, count) {
    this.x = x;
    this.y = y;
    this.c = c;
    this.particles = [];
    this.done = function() {
        if (this.particles.length === 0) {
            return true;
        } else {
            return false;
        }
    }
    this.update = function() {
        for (var i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].done()) {
                this.particles.splice(i, 1);
            }
        }
    }
    this.explode = function() {
        for (var i = 0; i < count; i++) {
            var p = new Particle(this.x, this.y, this.c, lifetime, range, size);
            this.particles.push(p);
        }
    }
    this.show = function() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].show();
        }
    }

    function Particle(x, y, c, lifetime, range, size) {
        this.pos = createVector(x, y);
        this.lifespan = 255;
        this.c = c;
        this.acc = createVector(0, 0);
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(2, range));
        this.range = range;
        this.update = function() {
            this.vel.mult(0.9);
            this.lifespan -= lifetime;
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }
        this.done = function() {
            if (this.lifespan < 0) {
                return true;
            } else {
                return false;
            }
        }
        this.show = function() {
            fill(red(this.c), green(this.c), blue(this.c), this.lifespan);
            rect(this.pos.x, this.pos.y, size, size);
        }
    }
}