function BossEnemy() {
    this.isABoss = true;
    this.w = 30;
    var spawnX = firstEnemy.pos.x;
    this.pos = createVector(spawnX, this.w * 2);
    this.bullets = [];
    this.corners = 3;
    this.dead = false;
    this.color = getColor(this.corners);
    this.headingDir = 1;
    this.bulletSpeed = enemyBulletSpeed;
    this.update = function() {
        if (this.pos.x > lastEnemy.pos.x) {
            this.headingDir = -1;
        } else if (this.pos.x < firstEnemy.pos.x) {
            this.headingDir = 1;
        }
        if (this.dead == false) {
            for (var i = players.length - 1; i >= 0; i--) {
                curr = players[i];
                if (curr.x < this.pos.x + 10 && curr.x > this.pos.x - 10 && millis() - lastShoot > 800 && floor(random(this.notShootChance)) == 0) {
                    lastShoot = millis();
                    this.newBullet();
                }
                if (this.pos.y >= curr.y) {
                    lost = true;
                }
            }
            if (floor(random(this.notShootChance * 300)) == 0 && millis() - lastShoot > 800) {
                this.newBullet();
            }
        }
    }
    this.show = function() {
        fill(0, 0, 0, 80);
        rect(this.pos.x, this.pos.y, this.w * 3, this.w * 3);
        fill(this.color);
        makeTriangle(this.pos.x, this.pos.y, this.w);
    }
    this.move = function() {
        this.pos.x += (this.headingDir * 5);
    }
    this.showBullets = function() {
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].active == true) {
                this.bullets[i].y += this.bulletSpeed;
                fill(this.color);
                makeTriangle(this.bullets[i].x, this.bullets[i].y, bulletSize);
                if (this.bullets[i].y > /*player.y + player.h * 2 */ windowHeight) {
                    this.bullets.splice(i, 1);
                }
            }
        }
    }
    this.newBullet = function() {
        if (start == true) {
            var bullet = createVector(this.pos.x, this.pos.y);
            bullet.active = true;
            this.bullets.push(bullet);
            animate.enemyShooted(this.pos.x, this.pos.y + this.w / 2, this.color);
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
    this.moveCloser = function() {
        this.pos.y += this.w * 3;
    }
    this.die = function(c) {
        this.dead = true;
        animate.enemyDeath(this.pos.x, this.pos.y, this.color, c);
    }
}

function makeTriangle(x, y, size, animFrame) {
    beginShape();
    vertex(x - size, y - size);
    vertex(x, y + size);
    vertex(x + size, y - size);
    vertex(x - size, y - size);
    endShape(CLOSE);
}