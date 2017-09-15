function Enemy() {
    this.w = 30;
    this.pos = createVector();
    this.shootChance = 3;
    this.bullets = [];
    this.corners = floor(random(4)) + 3;
    this.bulletSpeed = 8;
    this.color = getColor(this.corners);
    this.pos.y = 80;
    this.lastShoot = millis();
    //
    this.update = function() {
        var lastArr = enemyRows[enemyRows.length - 1];
        var last = lastArr[lastArr.length - 1];
        var first = enemyRows[0][0];
        this.move(dir);
        if (last.pos.x >= windowWidth - (last.w * 2)) {
            dir = -1;
        } else if (first.pos.x <= (first.w * 2)) {
            dir = 1;
        }
        if (player.x < this.pos.x + 10 && player.x > this.pos.x - 10 && millis() - this.lastShoot > 1000 && floor(random(this.shootChance)) == 0) {
            this.lastShoot = millis()
            this.newBullet();
        }
        if (dist(this.pos.x, this.pos.y, player.x, player.y) < player.hitbox) {
            lose();
        }
    }
    this.move = function(dir) {
        //this.pos.x += dir * (maxSpeed - enemies.length); //Be Faster
        this.pos.x += dir;
    }
    this.setup = function(i, number) {
        this.rate = (windowWidth / number) / 2 + (windowWidth / number) / 4;
        this.pos.x = this.rate * i + (this.w * 2);
    }
    this.show = function() {
        fill(this.color);
        polygon(this.pos.x, this.pos.y, this.w, this.corners);
    }
    this.moveCloser = function() {
        this.pos.y += this.w * 3;
        this.shootChance -= 200;
    }
    this.newBullet = function() {
        var bullet = createVector(this.pos.x, this.pos.y);
        this.bullets.push(bullet);
    }
    this.showBullets = function() {
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].y += this.bulletSpeed;
            fill(this.color);
            polygon(this.bullets[i].x, this.bullets[i].y, bulletSize, this.corners);
            if (this.bullets[i].y > windowHeight) {
                this.bullets.splice(i, 1);
            }
        }
    }
    this.updateBullets = function() {
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            if (dist(this.bullets[i].x, this.bullets[i].y, player.x, player.y) < player.hitbox) {
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