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
    this.leftKey;
    this.rightKey;
    this.shootKey;
    this.number;
    this.x = random(this.w, windowWidth - this.w);
    this.y = windowHeight - this.w - this.w / 6;
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
        textSize(30);
        text(this.number, this.x, this.y + this.h * 2);
    }
    //
    this.move = function() {
        var prssdKeys = getPressedKeys();
        for (var i = prssdKeys.length - 1; i >= 0; i--) {
            curr = prssdKeys[i];
            if (curr == this.leftKey) {
                if (this.x >= 0 + this.w) {
                    this.x += -this.xspeed;
                }
            } else if (curr == this.rightKey) {
                if (this.x <= windowWidth - this.w) {
                    this.x += this.xspeed;
                }
            } else if (curr == this.shootKey && millis() - this.lastShoot > 500) {
                this.newBullet();
                this.lastShoot = millis();
            }
        }
    }
    this.newBullet = function() {
        var bullet = createVector(this.x, this.y + this.h / 2);
        this.bullets.push(bullet);
        playerShoot.play()
    }
    this.showBullets = function() {
        fill(this.c);
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].y -= this.bulletSpeed;
            ellipse(this.bullets[i].x, this.bullets[i].y, this.w / 3);
            if (this.bullets[i].y < 0) {
                this.bullets.splice(i, 1);
            }
        }
    }
    this.updateBullets = function() {
        var killed = [];
        for (var j = this.bullets.length - 1; j >= 0; j--) {
            for (var i = enemyRows.length - 1; i >= 0; i--) {
                for (var e = enemyRows[i].length - 1; e >= 0; e--) {
                    if (enemyRows[i][e].dead == false) {
                        if (dist(this.bullets[j].x, this.bullets[j].y, enemyRows[i][e].pos.x, enemyRows[i][e].pos.y) < enemyRows[i][e].w) {
                            enemyKill.play();
                            enemyRows[i][e].dead = true;
                            killed.push(j);
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