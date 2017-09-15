var lastShoot;

function Enemy(x, y, corners, dead) {
    this.w = 30;
    this.pos = createVector();
    this.notShootChance = 8;
    this.bullets = [];
    this.corners = corners || floor(random(4)) + 3;
    this.bulletSpeed = enemyBulletSpeed;
    this.color = getColor(this.corners);
    this.pos.y = y || this.w * 2;
    this.dead = dead || false;
    lastShoot = millis();
    //
    this.update = function() {
        if (this.dead == false) {
            for (var i = players.length - 1; i >= 0; i--) {
                curr = players[i];
                if (curr.x < this.pos.x + 10 && curr.x > this.pos.x - 10 && millis() - lastShoot > 800 && floor(random(this.notShootChance)) == 0) {
                    lastShoot = millis();
                    this.newBullet();
                }
                if (this.pos.y >= curr.y && !undeadPlayers) {
                    lost = true;
                }
            }
            if (floor(random(this.notShootChance * 300)) == 0 && millis() - lastShoot > 800) {
                this.newBullet();
            }
        }
    }
    this.move = function() {
        this.pos.x += enemyMovingDir;
    }
    this.setup = function(i, number, firstPos) {
        if (!firstPos) firstPos = this.w * 2;
        this.pos.x = firstPos + i * (windowWidth / number) / 1.5;
    }
    this.show = function() {
        fill(this.color);
        polygon(this.pos.x, this.pos.y, this.w, this.corners);
    }
    this.moveCloser = function() {
        this.pos.y += this.w * 3;
    }
    this.newBullet = function() {
        if (start == true) {
            var bullet = createVector(this.pos.x, this.pos.y);
            bullet.active = true;
            this.bullets.push(bullet);
            animate.enemyShooted(this.pos.x, this.pos.y + this.w / 2, this.color);
        }
    }
    this.showBullets = function() {
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].active == true) {
                this.bullets[i].y += this.bulletSpeed;
                fill(this.color);
                polygon(this.bullets[i].x, this.bullets[i].y, bulletSize, this.corners);
                if (this.bullets[i].y > /*player.y + player.h * 2 */ windowHeight) {
                    this.bullets.splice(i, 1);
                }
            }
        }
    }
    this.updateBullets = function() {
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].y > height) {
                this.bullets.splice(i, 1);
            } else if (this.bullets[i].active == true) {
                for (var j = players.length - 1; j >= 0; j--) {
                    if (players[j].alive == true && this.bullets[i]) {
                        curr = players[j];
                        if (max(curr.x, this.bullets[i].x) - min(curr.x, this.bullets[i].x) < curr.w && max(curr.y, this.bullets[i].y) - min(curr.y, this.bullets[i].y) < curr.h) {
                            players[j].die(this.color);
                            this.bullets[i].active = false; //Delete bullet and skip this bullet for the other players
                            i--;
                        }
                    }
                }
            }
        }
    }
    this.die = function(c) {
        this.dead = true;
        animate.enemyDeath(this.pos.x, this.pos.y, this.color, c);
    }
}
//=====================================================================================================
function getColor(corners) {
    switch (corners) {
        case 3:
            return color(150, 0, 200);
        case 4:
            return color(0, 0, 200);
        case 5:
            return color(200, 0, 0);
        case 6:
            return color(200, 200, 0);
    }
}

function polygon(x, y, radius, npoints) {
    var angle = TWO_PI / npoints;
    beginShape();
    for (var a = 0; a < TWO_PI; a += angle) {
        var sx = x + cos(a) * radius;
        var sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}