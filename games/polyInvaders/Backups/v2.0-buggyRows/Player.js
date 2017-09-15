//=====================================================================================================
function Player() {
    this.x = width / 2;
    this.y = windowHeight - 55;
    this.w = 110;
    this.bullets = [];
    this.bulletSpeed = 10;
    this.shooted = false;
    this.lastShoot = millis();
    //
    this.show = function() {
        this.hitbox = this.w - (this.w / 3) - bulletSize / 2;
        beginShape();
        vertex(this.x, /*              */ this.y - this.w / 2);
        vertex(this.x + (this.w / 3) / 2, this.y - this.w / 2);
        vertex(this.x + (this.w / 3) / 2, this.y - this.w / 2 + this.w / 3);
        vertex(this.x + this.w / 2, /* */ this.y - this.w / 2 + this.w / 3);
        vertex(this.x + this.w / 2, /* */ this.y + this.w / 3);
        vertex(this.x - this.w / 2, /* */ this.y + this.w / 3);
        vertex(this.x - this.w / 2, /* */ this.y - this.w / 2 + this.w / 3);
        vertex(this.x - (this.w / 3) / 2, this.y - this.w / 2 + this.w / 3);
        vertex(this.x - (this.w / 3) / 2, this.y - this.w / 2);
        vertex(this.x, /*              */ this.y - this.w / 2);
        endShape(CLOSE);
    }
    //
    this.move = function() {
        if (keyCode === LEFT_ARROW) {
            if (this.x - this.w / 2 >= 0) {
                this.x += -10;
            }
        } else if (keyCode === RIGHT_ARROW) {
            if (this.x + this.w / 2 <= windowWidth) {
                this.x += 10;
            }
        } else if (keyCode === UP_ARROW && millis() - this.lastShoot > 500 && this.shooted === false) {
            this.newBullet();
            this.lastShoot = millis();
            this.shooted = true;
        }
    }
    this.newBullet = function() {
        var bullet = createVector(this.x, this.y);
        this.bullets.push(bullet);
    }
    this.showBullets = function() {
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].y -= this.bulletSpeed;
            ellipse(this.bullets[i].x, this.bullets[i].y, this.w / 5);
            if (this.bullets[i].y < 0) {
                this.bullets.splice(i, 1);
            }
        }
    }
    this.updateBullets = function() {
        if (counter > 0 && this.bullets.length > 0) {
            f: for (var j = this.bullets.length - 1; j >= 0; j--) {
                for (var i = enemyRows.length - 1; i >= 0; i--) {
                    for (var e = enemyRows[i].length - 1; e >= 0; e--) {
                        if (dist(this.bullets[j].x, this.bullets[j].y, enemyRows[i][e].pos.x, enemyRows[i][e].pos.y) < enemyRows[i][e].w) {
                            enemyRows[i].splice(e, 1);
                            this.bullets.splice(j, 1);
                            continue f;
                        }
                    }
                }
            }
        }
    }
}