//=====================================================================================================
function Player() {
    this.w = 50;
    this.h = this.w / 2;
    this.bullets = [];
    this.bulletSpeed = 10;
    this.lastShoot = millis();
    this.xspeed = 10;
    this.c = color(0, 200, 0);
    this.alive = true;
    this.leftKey = [];
    this.rightKey = [];
    this.shootKey = [];
    this.number;
    this.x = random(this.w, windowWidth - this.w);
    this.y = windowHeight - this.w - this.w / 6;
    this.showHelp;
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
        textSize(this.h + 10);
        text(this.number, this.x, this.y + this.h * 2);
        if (this.showHelp == true) {
            textSize(20);
            text(this.leftKey[1], this.x - this.w, this.y);
            text(this.shootKey[1], this.x, this.y - this.h / 2);
            text(this.rightKey[1], this.x + this.w, this.y);
        }
    }
    //
    this.move = function() {
        var prssdKeys = getPressedKeys();
        for (var i = prssdKeys.length - 1; i >= 0; i--) {
            curr = prssdKeys[i];
            if (curr == this.leftKey[0]) {
                if (this.x >= 0 + this.w) {
                    this.x += -this.xspeed;
                }
            } else if (curr == this.rightKey[0]) {
                if (this.x <= windowWidth - this.w) {
                    this.x += this.xspeed;
                }
            } else if (curr == this.shootKey[0] && millis() - this.lastShoot > 500) {
                this.newBullet();
                this.lastShoot = millis();
            }
        }
    }
    this.newBullet = function() {
        var bullet = createVector(this.x, this.y + this.h / 2);
        bullet.active = true;
        this.bullets.push(bullet);
        playerShoot.play()
    }
    this.showBullets = function() {
        fill(this.c);
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            if (this.bullets[i].active == true) {
                this.bullets[i].y -= this.bulletSpeed;
                ellipse(this.bullets[i].x, this.bullets[i].y, bulletSize);
                if (this.bullets[i].y < 0) {
                    this.bullets.splice(i, 1);
                }
            }
        }
    }
    this.updateBullets = function() {
        var killed = [];
        for (var j = this.bullets.length - 1; j >= 0; j--) {
            if (this.bullets[j].active == true) {
                for (var i = enemyRows.length - 1; i >= 0; i--) {
                    for (var e = enemyRows[i].length - 1; e >= 0; e--) {
                        if (enemyRows[i][e].dead == false) {
                            if (dist(this.bullets[j].x, this.bullets[j].y, enemyRows[i][e].pos.x, enemyRows[i][e].pos.y) < enemyRows[i][e].w) {
                                enemyKill.play();
                                enemyRows[i][e].dead = true;
                                this.bullets[j].active = false;
                            }
                        }
                    }
                }
            }
        }
        for (var i = killed.length - 1; i >= 0; i--) {
            this.bullets.splice(killed[i], 1);
        }
    }
}