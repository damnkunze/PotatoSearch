//=====================================================================================================
function Player() {
    this.w = 50;
    this.h = this.w / 2;
    this.bullets = [];
    this.bulletSpeed = 10;
    this.lastShoot = millis();
    this.xspeed = 10;
    this.c = color(0, 200, 0);
    this.dead = false;
    this.leftKey = [37, '<'];
    this.rightKey = [39, '>'];
    this.shootKey = [38, '^'];
    this.x = random(this.w, windowWidth - this.w);
    this.y = windowHeight - this.w - this.w / 6;
    this.showHelp = true;
    //
    this.show = function() {
        // beginShape();
        // vertex(this.x, /*              */ this.y - this.w / 2);
        // vertex(this.x + (this.w / 3) / 2, this.y - this.w / 2);
        // vertex(this.x + (this.w / 3) / 2, this.y - this.w / 2 + this.w / 3);
        // vertex(this.x + this.w / 2, /* */ this.y - this.w / 2 + this.w / 3);
        // vertex(this.x + this.w / 2, /* */ this.y + this.w / 3);
        // vertex(this.x - this.w / 2, /* */ this.y + this.w / 3);
        // vertex(this.x - this.w / 2, /* */ this.y - this.w / 2 + this.w / 3);
        // vertex(this.x - (this.w / 3) / 2, this.y - this.w / 2 + this.w / 3);
        // vertex(this.x - (this.w / 3) / 2, this.y - this.w / 2);
        // vertex(this.x, /*              */ this.y - this.w / 2);
        // endShape(CLOSE);
        fill(0, 0, 0, 80);
        rect(this.x, this.y, this.w * 3, this.w * 2);
        fill(this.c);
        beginShape();
        vertex(this.x, this.y - this.h / 3);
        vertex(this.x + ((this.w / 3) / 2), this.y);
        vertex(this.x + ((this.w / 3) * 2), this.y);
        vertex(this.x + ((this.w / 3) * 2), this.y + this.h / 1.5);
        vertex(this.x - ((this.w / 3) * 2), this.y + this.h / 1.5);
        vertex(this.x - ((this.w / 3) * 2), this.y);
        vertex(this.x - ((this.w / 3) / 2), this.y);
        vertex(this.x, this.y - this.h / 3);
        endShape(CLOSE);
        if (this.showHelp == true) {
            textSize(20);
            text(this.leftKey[1], this.x - this.w, this.y);
            text(this.shootKey[1], this.x, this.y - this.h / 2);
            text(this.rightKey[1], this.x + this.w, this.y);
        } else {
            text(this.scoreCounter.score, this.x, this.y - this.h);
        }
    }
    //
    this.move = function() {
        var prssdKeys = getPressedKeys();
        var s = true;
        if (prssdKeys.includes(this.leftKey[0])) {
            if (this.x >= 0 + this.w) {
                this.x += -this.xspeed;
            }
        }
        if (prssdKeys.includes(this.rightKey[0])) {
            if (this.x <= windowWidth - this.w) {
                this.x += this.xspeed;
            }
        }
        if (prssdKeys.includes(this.shootKey[0])) {
            if (millis() - this.lastShoot > playerShootSpeed) {
                this.newBullet();
                this.lastShoot = millis();
            }
        }
    }
    this.newBullet = function() {
        var bullet = createVector(this.x, this.y + this.h / 2);
        bullet.active = true;
        this.bullets.push(bullet);
        animate.playerShooted(this.x, this.y - this.h / 3, this.c);
    }
    this.showBullets = function() {
        fill(this.c);
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].active == true) {
                this.bullets[i].y -= this.bulletSpeed;
                ellipse(this.bullets[i].x, this.bullets[i].y, bulletSize);
            }
        }
    }
    this.updateBullets = function() {
        var killed = [];
        for (var j = this.bullets.length - 1; j >= 0; j--) {
            if (this.bullets[j].y < 0) {
                this.bullets.splice(j, 1);
            } else if (this.bullets[j].active == true) {
                for (var i = enemyRows.length - 1; i >= 0; i--) {
                    for (var e = enemyRows[i].length - 1; e >= 0; e--) {
                        if (enemyRows[i][e].dead == false) {
                            if (dist(this.bullets[j].x, this.bullets[j].y, enemyRows[i][e].pos.x, enemyRows[i][e].pos.y) < enemyRows[i][e].w) {
                                var currEnemy = enemyRows[i][e];
                                currEnemy.die(this.c);
                                this.scoreCounter.pointsEnemyKill();
                                this.bullets[j].active = false;
                            }
                        }
                    }
                }
                if (dist(this.bullets[j].x, this.bullets[j].y, opponent.x, opponent.y) < opponent.w) {
                    opponent.die(this.c);
                    this.bullets[j].active = false;
                }
            }
        }
    }
    this.die = function(c) {
        if (undeadPlayers == false) {
            this.dead = true
            animate.playerDeath(this.x, this.y, this.c, c);
        }
    }
}