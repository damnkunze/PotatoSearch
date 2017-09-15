var player;
var pressed = false;
var enemies = [];
var dir = 1;
var maxSpeed;
var timeouted = false;
var ememyWait = 10000; //10 seconds
//
function clog(msg) {
    console.log(msg);
}

function setup() {
    createCanvas((windowWidth + displayWidth) / 2, windowHeight);
    player = new Player();
    rectMode(CENTER);
    noStroke();
    maxSpeed = enemies.length + 1;
    setTimeout(function() {
        for (var i = enemies.length - 1; i >= 0; i--) {
            enemies[i].moveCloser();
        }
        timeouted = true;
    }, ememyWait);
    newRow();
    textAlign(CENTER);
    textSize(70);
}

function draw() {
    if (enemies.length == 0) {
        fill(255);
        text("You have won!", windowWidth / 2, windowHeight / 2);
        fill(0, 200, 0);
        noLoop();
    } else {
        background(0);
        fill(0, 200, 0);
        player.checkBullets();
        player.showBullets();
        player.show();
        if (pressed) {
            player.move();
        }
        for (var i = enemies.length - 1; i >= 0; i--) {
            enemies[i].update();
            enemies[i].show(i);
            enemies[i].checkBullets();
            enemies[i].showBullets();
        }
    }
    if (timeouted) {
        setTimeout(function() {
            for (var i = enemies.length - 1; i >= 0; i--) {
                enemies[i].moveCloser();
            }
            timeouted = true;
        }, ememyWait);
        timeouted = false;
    }
}

function keyPressed() {
    pressed = true;
}

function keyReleased() {
    pressed = false;
    player.shooted = false;
}
//=====================================================================================================
function Player() {
    this.x = width / 2;
    this.y = windowHeight - 90;
    this.w = 120;
    this.bullets = [];
    this.bulletSpeed = 10;
    this.shooted = false;
    this.lastShoot = millis();
    //
    this.show = function() {
        beginShape();
        vertex(this.x, this.y);
        vertex(this.x + (this.w / 3) / 2, this.y);
        vertex(this.x + (this.w / 3) / 2, this.y + 20);
        vertex(this.x + (this.w / 3), this.y + 20);
        vertex(this.x + (this.w / 3), this.y + 70);
        vertex(this.x - (this.w / 3), this.y + 70);
        vertex(this.x - (this.w / 3), this.y + 20);
        vertex(this.x - (this.w / 3) / 2, this.y + 20);
        vertex(this.x - (this.w / 3) / 2, this.y);
        vertex(this.x, this.y);
        endShape(CLOSE);
    }
    //
    this.move = function() {
        if (keyCode === LEFT_ARROW) {
            if (this.x - this.w / 2 >= 20) {
                this.x += -10;
            }
        } else if (keyCode === RIGHT_ARROW) {
            if (this.x + this.w / 2 <= windowWidth - 20) {
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
    this.checkBullets = function() {
        if (enemies.length > 0 && this.bullets.length > 0) {
            for (var j = this.bullets.length - 1; j >= 0; j--) {
                for (var i = enemies.length - 1; i >= 0; i--) {
                    if (dist(this.bullets[j].x, this.bullets[j].y, enemies[i].pos.x, enemies[i].pos.y) < enemies[i].w) {
                        enemies.splice(i, 1);
                        this.bullets.splice(j, 1);
                        break;
                    }
                }
            }
        }
    }
}
//=====================================================================================================
function newRow(row) {
    for (var i = 8; i >= 0; i--) {
        enemies.push(new Enemy());
    }
    for (var i = enemies.length - 1; i >= 0; i--) {
        enemies[i].setup(i);
    }
}

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
//=====================================================================================================
function Enemy() {
    this.w = 30;
    this.pos = createVector();
    this.shootChance = 1000;
    this.bullets = [];
    this.corners = floor(random(4)) + 3;
    this.bulletSpeed = 8;
    this.color = getColor(this.corners);
    this.pos.y = 80;
    this.lastShoot = millis();
    //
    this.update = function() {
        var last = enemies[enemies.length - 1];
        var first = enemies[0];
        for (var i = enemies.length - 1; i >= 0; i--) {
            enemies[i].move(dir);
        }
        if (last.pos.x >= windowWidth - (last.w * 2)) {
            dir = -1;
        } else if (first.pos.x <= (first.w * 2)) {
            dir = 1;
        }
        if (player.x < this.pos.x + 10 && player.x > this.pos.x - 10 && millis() - this.lastShoot > 1000) {
            this.lastShoot = millis()
            this.newBullet();
        }
        if (floor(random(this.shootChance)) == 1) {
            this.lastShoot = millis()
            this.newBullet();
        }
    }
    this.move = function(dir) {
        //this.pos.x += dir * (maxSpeed - enemies.length); //Be Faster
        this.pos.x += dir;
    }
    this.setup = function(i) {
        this.rate = (windowWidth / enemies.length) / 2 + (windowWidth / enemies.length) / 4;
        var middlePos = windowWidth / 4;
        this.pos.x = middlePos + this.rate * i + (this.w * 2);
    }
    this.show = function() {
        fill(this.color);
        polygon(this.pos.x, this.pos.y, this.w, this.corners);
    }
    this.moveCloser = function() {
        this.pos.y += this.w * 2;
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
            polygon(this.bullets[i].x, this.bullets[i].y, this.w / 2, this.corners);
            if (this.bullets[i].y > windowHeight) {
                this.bullets.splice(i, 1);
            }
        }
    }
    this.checkBullets = function() {
        for (var i = this.bullets.length - 1; i >= 0; i--) {
            if (dist(this.bullets[i].x, this.bullets[i].y, player.x, player.y) < player.w / 2) {
                fill(255);
                text("You have lost!", windowWidth / 2, windowHeight / 2);
                noLoop();
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