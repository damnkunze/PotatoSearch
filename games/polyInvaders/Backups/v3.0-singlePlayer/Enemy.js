var lastShoot;

function Enemy(x, y, corners, dead) {
    this.w = 30;
    this.pos = createVector();
    this.notShootChance = enemyFireRate;
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
        this.move(dir);
        if (last.pos.x >= windowWidth - this.w) {
            dir = -1;
        } else if (first.pos.x <= 0 + this.w + this.w / 2) {
            dir = 1;
        }
        if (this.dead == false) {
            if (player.x < this.pos.x + 10 && player.x > this.pos.x - 10 && millis() - lastShoot > 800 && floor(random(this.notShootChance)) == 0) {
                lastShoot = millis();
                this.newBullet();
            } else if (floor(random(this.notShootChance * 300)) == 0 && millis() - lastShoot > 800) {
                this.newBullet();
            }
            if (this.pos.y >= player.y) {
                lose();
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
        var bullet = createVector(this.pos.x, this.pos.y);
        this.bullets.push(bullet);
        enemyShoot.play()
    }
    this.showBullets = function() {
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].y += this.bulletSpeed;
            fill(this.color);
            polygon(this.bullets[i].x, this.bullets[i].y, bulletSize, this.corners);
            if (this.bullets[i].y > /*player.y + player.h * 2 */ windowHeight) {
                this.bullets.splice(i, 1);
            }
        }
    }
    this.updateBullets = function() {
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            if (max(player.x, this.bullets[i].x) - min(player.x, this.bullets[i].x) < player.w && max(player.y, this.bullets[i].y) - min(player.y, this.bullets[i].y) < player.h) {
                lose();
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