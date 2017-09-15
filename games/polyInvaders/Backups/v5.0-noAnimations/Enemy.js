var lastShoot;

function Enemy(x, y, corners, dead) {
    this.w = 30;
    this.pos = createVector();
    this.notShootChance = 8;
    this.bullets = [];
    this.corners = corners || floor(random(4)) + 3;
    this.bulletSpeed = 8;
    this.color = getColor(this.corners);
    this.pos.y = y || this.w * 2;
    this.dead = dead || false;
    lastShoot = millis();
    //
    this.update = function() {
        var lastArr = enemyRows[enemyRows.length - 1];
        var last = lastArr[lastArr.length - 1];
        var first = enemyRows[0][0];
        if (last.pos.x >= windowWidth - this.w) {
            dir = -1;
        } else if (first.pos.x <= 0 + this.w + this.w / 2) {
            dir = 1;
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
    this.move = function(dir) {
        this.pos.x += dir;
    }
    this.setup = function(i, number, firstPos) {
        if (!firstPos) firstPos = this.w * 2;
        this.pos.x = firstPos + i * (windowWidth / number) / 1.5;
    }
    this.show = function() {
        this.pos.x -= this.w / 2; //Make this.x and this.y the center of the enemy
        this.pos.y -= this.w / 2;
        fill(this.color);
        polygon(this.pos.x, this.pos.y, this.w, this.corners);
        this.pos.x += this.w / 2;
        this.pos.y += this.w / 2;
    }
    this.moveCloser = function() {
        this.pos.y += this.w * 3;
    }
    this.newBullet = function() {
        if (start == true) {
            var bullet = createVector(this.pos.x, this.pos.y);
            bullet.active = true;
            this.bullets.push(bullet);
            enemyShoot.play();
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
            if (this.bullets[i].active == true) {
                for (var j = players.length - 1; j >= 0; j--) {
                    if (players[j].alive == true && this.bullets[i]) {
                        curr = players[j];
                        if (max(curr.x, this.bullets[i].x) - min(curr.x, this.bullets[i].x) < curr.w && max(curr.y, this.bullets[i].y) - min(curr.y, this.bullets[i].y) < curr.h) {
                            players[j].alive = false;
                            playerKill.play();
                            this.bullets[i].active = false; //Delete bullet and skip this bullet for the other players
                            i--;
                        }
                    }
                }
            }
        }
    }
}
//=====================================================================================================
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