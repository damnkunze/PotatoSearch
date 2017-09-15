var player;
var enemyRows = [];
var dir = 1;
var maxSpeed;
var timeouted = false;
var counter = 10;
var bulletSize = 15;
var enemiesPerRow = 8,
    startEnemyRows = 4,
    enemyFireRate = 8,
    enemyWait = 20000; //20 seconds
var lost = false;
//
function clog(msg) {
    console.log(msg);
}

function preload() {
    if (!localStorage.getItem('enemies')) {
        localStorage.setItem('enemies', ' ');
    }
    if (!localStorage.getItem('player')) {
        localStorage.setItem('player', ' ');
    }
    enemyKill = loadSound('../games/assets/enemyKilled.mp4');
    enemyShoot = loadSound('../games/assets/enemyShoot.mp4');
    playerKill = loadSound('../games/assets/playerKilled.mp4');
    playerShoot = loadSound('../games/assets/playerShoot.mp4');
}

function setup() {
    enemyKill.setVolume(0.5);
    playerKill.setVolume(0.3);
    enemyShoot.setVolume(0.15);
    playerShoot.setVolume(0.35);
    createCanvas(windowWidth + displayWidth, windowHeight);
    player = new Player();
    noStroke();
    for (var i = 0; i < startEnemyRows; i++) {
        enemyRows[i] = newRow(enemiesPerRow);
        //
        for (var e = enemyRows.length - 1; e >= 0; e--) {
            for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                if (e != 0) {
                    enemyRows[e][j].moveCloser();
                }
            }
        }
    }
    textAlign(CENTER);
    textSize(70);
    setInterval(function() {
        timeouted = true;
    }, enemyWait);
    saveGame(enemyRows, player);
}

function draw() {
    if (counter == 0) {
        noLoop();
        setTimeout(function() {
            background(0);
            fill(255);
            text("You won!", windowWidth / 2, windowHeight / 2);
            fill(0, 200, 0);
            deleteSaved();
        }, 1000);
    } else {
        background(0);
        fill(0, 200, 0);
        player.updateBullets();
        player.showBullets();
        player.show();
        if (keyIsPressed) {
            player.move();
        }
        counter = 0;
        for (var i = enemyRows.length - 1; i >= 0; i--) {
            for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                if (!enemyRows[i][j].dead) {
                    counter++;
                }
            }
        }
        for (var i = enemyRows.length - 1; i >= 0; i--) {
            for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                if (enemyRows[i].length == 0) {
                    enemyRows.splice(i, 1);
                } else {
                    if (enemyRows[i][j].dead == true) {
                        enemyRows[i][j].update();
                    } else {
                        enemyRows[i][j].update();
                        enemyRows[i][j].show(i);
                        enemyRows[i][j].updateBullets();
                        enemyRows[i][j].showBullets();
                    }
                }
            }
        }
        if (timeouted) {
            timeouted = false;
            for (var i = enemyRows.length - 1; i >= 0; i--) {
                for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                    enemyRows[i][j].moveCloser();
                }
            }
            enemyRows[enemyRows.length] = newRow(enemiesPerRow, enemyRows[0][0].pos.x);
        }
    }
    if (lost == true) {
        noLoop();
        playerKill.play();
        setTimeout(function() {
            background(0);
            fill(255);
            text("You lost!", windowWidth / 2, windowHeight / 2);
        }, 500);
    }
}

function keyReleased() {
    player.shooted = false;
}
//=====================================================================================================
function newRow(number, firstPos) {
    var row = [];
    for (var i = number; i >= 0; i--) {
        row.push(new Enemy());
    }
    for (var i = 0; i <= row.length - 1; i++) {
        row[i].setup(i, number, firstPos);
    }
    return row;
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

function lose() {
    lost = true;
}

function saveIt() {
    if (!lost && counter != 0) {
        saveGame(enemyRows, player);
    }
}

function saveGame(enemies, player) {
    deleteSaved();
    for (var i = enemies.length - 1; i >= 0; i--) {
        for (var j = enemies[i].length - 1; j >= 0; j--) {
            var untilNow = localStorage.getItem('enemies');
            var curr = enemies[i][j];
            localStorage.setItem('enemies', untilNow + curr.pos.x + '$' + curr.pos.y + '$' + curr.corners + '$' + curr.dead + '#');
        }
        localStorage.setItem('enemies', localStorage.getItem('enemies') + '*');
    }
    localStorage.setItem('player', JSON.stringify(player));
}

function reloadGame() {
    enemyRows = [];
    var rows = localStorage.getItem('enemies').split('*');
    for (var i = rows.length - 1; i >= 0; i--) {
        var enemies = rows[i].split('#');
        for (var i = enemies.length - 1; i >= 0; i--) {
            var enemy = enemies[i].split('$');
            enemyRows.push(enemy);
        }
    }
    clog(enemies);
}

function deleteSaved() {
    localStorage.setItem('enemies', ' ');
    localStorage.setItem('player', ' ');
}