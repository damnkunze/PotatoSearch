//
function Blocker() {
    createVector(this.x, this.y);
    this.y = player.y - player.h * 4;
    this.w = blockerSize;
    this.hitpoints = blockerHitpoints;
    this.h = this.w / 2;
    this.stepLenght = this.h / this.hitpoints;
    this.active = true;
    this.show = function() {
        fill(0, 200, 0);
        rect(this.x, this.y, this.w, this.h);
    }
    this.setup = function(i, number) {
        this.x = i * (windowWidth / number);
    }
    this.update = function() {
        for (var i = enemyRows.length - 1; i >= 0; i--) {
            for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                for (var b = enemyRows[i][j].bullets.length - 1; b >= 0; b--) {
                    var currBullet = enemyRows[i][j].bullets[b];
                    if (enemyRows[i][j].bullets[b].active == true && max(currBullet.x, this.x) - min(currBullet.x, this.x) < this.w / 2 + bulletSize / 2 && max(currBullet.y, this.y) - min(this.y, currBullet.y) < this.h / 2 + bulletSize / 2) {
                        this.getHit();
                        enemyRows[i][j].bullets[b].active = false;
                    }
                }
            }
        }
        for (var j = player.bullets.length - 1; j >= 0; j--) {
            var currBullet = player.bullets[j];
            if (currBullet.active == true && max(currBullet.x, this.x) - min(currBullet.x, this.x) < this.w / 2 + bulletSize / 2 && max(currBullet.y, this.y) - min(this.y, currBullet.y) < this.h / 2 + bulletSize / 2) {
                this.getHit();
                player.bullets[j].active = false;
            }
        }
        for (var j = opponent.bullets.length - 1; j >= 0; j--) {
            var currBullet = opponent.bullets[j];
            if (currBullet.active == true && max(currBullet.x, this.x) - min(currBullet.x, this.x) < this.w / 2 + bulletSize / 2 && max(currBullet.y, this.y) - min(this.y, currBullet.y) < this.h / 2 + bulletSize / 2) {
                this.getHit();
                opponent.bullets[j].active = false;
            }
        }
    }
    this.getHit = function() {
        if (this.hitpoints == 1) {
            this.active = false;
        } else {
            this.hitpoints--;
            this.h -= this.stepLenght;
        }
    }
}