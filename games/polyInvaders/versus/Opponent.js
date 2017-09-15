function Opponent() {
    this.w = 30;
    this.x = random(0, windowWidth);
    this.xspeed = 5;
    this.y = this.w * 2;
    this.bullets = [];
    this.corners = 3;
    this.dead = false;
    this.color = getColor(this.corners);
    this.headingDir = 1;
    this.bulletSpeed = enemyBulletSpeed;
    this.showHelp = true;
    this.leftKey = [65, 'A'];
    this.rightKey = [68, 'D'];
    this.shootKey = [87, 'W'];
    this.lastShoot = millis();
    this.show = function() {
        fill(0, 0, 0, 80);
        rect(this.x, this.y, this.w * 3, this.w * 3);
        fill(this.color);
        makeTriangle(this.x, this.y, this.w);
        if (this.showHelp == true) {
            textSize(20);
            text(this.leftKey[1], this.x - this.w * 2, this.y);
            text(this.shootKey[1], this.x, this.y + this.w * 2);
            text(this.rightKey[1], this.x + this.w * 2, this.y);
        }
    }
    this.update = function() {
        if (lastEnemy.pos.x < this.x) {
            this.x = lastEnemy.pos.x;
        } else if (firstEnemy.pos.x > this.x) {
            this.x = firstEnemy.pos.x;
        }
    }
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
            if (millis() - this.lastShoot > opponentShootSpeed) {
                this.newBullet();
            }
        }
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
        this.lastShoot = millis();
        var bullet = createVector(this.x, this.y);
        bullet.active = true;
        this.bullets.push(bullet);
        animate.enemyShooted(this.x, this.y + this.w / 2, this.color);
    }
    this.updateBullets = function() {
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].y > height) {
                this.bullets.splice(i, 1);
            } else if (this.bullets[i].active == true) {
                if (player.dead == false && this.bullets[i]) {
                    if (max(player.x, this.bullets[i].x) - min(player.x, this.bullets[i].x) < player.w && max(player.y, this.bullets[i].y) - min(player.y, this.bullets[i].y) < player.h) {
                        player.die(this.color);
                        this.bullets[i].active = false; //Delete bullet and skip this bullet for the other players
                        i--;
                    }
                }
            }
        }
    }
    this.die = function(c) {
        this.dead = true;
        animate.opponentDeath(this.x, this.y, this.color, c);
    }
}

function makeTriangle(x, y, size) {
    beginShape();
    vertex(x - size, y - size);
    vertex(x, y + size);
    vertex(x + size, y - size);
    vertex(x - size, y - size);
    endShape(CLOSE);
}