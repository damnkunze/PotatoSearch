function AnimationController() {
    this.moverIn = function(m) {
        var antiLifetime = 7;
        var range = m.mass * m.mass;
        var size = 5;
        animations.push(new Explosion(m.position.x, m.position.y - m.mass, antiLifetime, range, size, animationCount));
        animations[animations.length - 1].explode();
    }
}

function Explosion(x, y, antiLifetime, range, size, count) {
    this.x = x;
    this.y = y;
    this.c = liquidC;
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
            if (!this.c[0]) { //For multicolor particles
                var p = new Particle(this.x, this.y, this.c, antiLifetime, range, size);
                this.particles.push(p);
            } else {
                var index = floor(random(0, 4));
                if (index == 2 || index == 3) index = 1;
                var rndmC = this.c[index];
                var p = new Particle(this.x, this.y, rndmC, antiLifetime, range, size);
                this.particles.push(p);
            }
        }
    }
    this.show = function() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].show();
        }
    }

    function Particle(x, y, c, antiLifetime, range, size) {
        this.pos = createVector(x, y);
        this.antiLifetime = 255;
        this.c = c;
        this.acc = createVector(0, 0);
        this.vel = p5.Vector.random2D();
        this.vel.add(createVector(0, -2));
        this.vel.mult(random(2, range));
        this.range = range;
        this.update = function() {
            this.vel.mult(0.9);
            this.vel.add(createVector(0, 0.5));
            this.antiLifetime -= antiLifetime;
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);
        }
        this.done = function() {
            if (this.antiLifetime < 0) {
                return true;
            } else {
                return false;
            }
        }
        this.show = function() {
            fill(red(this.c), green(this.c), blue(this.c), this.antiLifetime);
            rect(this.pos.x, this.pos.y, size, size);
        }
    }
}