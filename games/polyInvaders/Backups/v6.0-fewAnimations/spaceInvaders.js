var enemiesPerRow = 8,
    startEnemyRows = 4,
    enemyWait = 20000, //       20 seconds
    enemyBeginWait = 5000; //   2 seconds
var playerCounter = 3; //       Up to 3 Players
var blockerCounter = 3,
    blockerSize = 160,
    blockerHitpoints = 5;
var bulletSize = 15; //         Size of all bullets
//
//
//NO CHANGES BELOW THIS LINE!!! ----------------------------------------------
var keys;
var start = false;
var lost = false;
var textColor;
var players = [];
var timeouted = false;
var dir = 1;
var enemyCounter;
var enemyRows = [];
var blockers = [];
var enemyAnimations = [];
var playerAnimations = [];
//
function clog(msg) {
    console.log(msg);
}

function preload() {
    enemyKill = loadSound('./assets/enemyKilled.mp4');
    enemyShoot = loadSound('./assets/enemyShoot.mp4');
    playerKill = loadSound('./assets/playerKilled.mp4');
    playerShoot = loadSound('./assets/playerShoot.mp4');
    win = loadSound('./assets/win.mp4');
    enemyKill.setVolume(0.5);
    playerKill.setVolume(0.3);
    enemyShoot.setVolume(0.15);
    playerShoot.setVolume(0.35);
    win.setVolume(0.15);
    if (!localStorage.getItem('enemies')) {
        localStorage.setItem('enemies', ' ');
        localStorage.setItem('players', ' ');
    }
}

function setup() {
    createCanvas(windowWidth + displayWidth, windowHeight);
    if (playerCounter > 3) playerCounter = 3;
    if (playerCounter < 1) playerCounter = 1;
    if (enemiesPerRow < 1) enemiesPerRow = 1;
    if (startEnemyRows < 1) startEnemyRows = 1;
    for (var i = 0; i < playerCounter; i++) {
        players[i] = new Player();
        getKeysForPlayer(i + 1); //Convert i to the players number
        players[i].number = i + 1;
        players[i].showHelp = true;
    }
    for (var i = 0; i < startEnemyRows; i++) {
        enemyRows[i] = newRow(enemiesPerRow);
        //
        for (var e = enemyRows.length - 1; e >= 0; e--) {
            for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                if (e != 0) { //Dont come closer if its the last row
                    enemyRows[e][j].moveCloser();
                }
            }
        }
    }
    for (var i = 0; i < blockerCounter; i++) {
        blockers[i] = new Blocker();
        blockers[i].setup(i, blockerCounter - 1);
    }
    noStroke();
    textAlign(CENTER);
    rectMode(CENTER);
    ellipseMode(CENTER);
    setInterval(function() {
        timeouted = true;
    }, enemyWait);
    setTimeout(function() {
        start = true;
    }, enemyBeginWait);
    textColor = color(200);
}

function draw() {
    if (enemyCounter == 0) {
        gameIsOver("You won!", 1);
    } else if (playerCounter == 0 || lost == true) {
        gameIsOver("You have lost!", 0);
    } else {
        if (!keyIsPressed) {
            keys = [];
        }
        background(color(0, 0, 0, 50));
        enemyCounter = 0;
        playerCounter = 0;
        for (var i = enemyRows.length - 1; i >= 0; i--) {
            for (var j = enemyRows[i].length - 1; j >= 0; j--) { //Count the enemies
                if (!enemyRows[i][j].dead) {
                    enemyCounter++;
                }
            }
        }
        for (var i = blockers.length - 1; i >= 0; i--) {
            if (blockers[i].active == true) {
                blockers[i].update();
                blockers[i].show();
            }
        }
        for (var i = players.length - 1; i >= 0; i--) {
            if (players[i].alive == true) {
                playerCounter++;
                fill(0, 200, 0);
                players[i].updateBullets();
                players[i].showBullets();
                players[i].show();
                if (keyIsPressed) {
                    players[i].move();
                }
                if (start == true) {
                    players[i].showHelp = false;
                }
            }
        }
        for (var i = enemyRows.length - 1; i >= 0; i--) {
            for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                if (enemyRows[i].length == 0) {
                    enemyRows.splice(i, 1);
                } else {
                    if (enemyRows[i][j].dead == true) {
                        enemyRows[i][j].move(dir);
                        enemyRows[i][j].update();
                    } else {
                        enemyRows[i][j].move(dir);
                        enemyRows[i][j].update();
                        enemyRows[i][j].show(i);
                        if (start == true) {
                            enemyRows[i][j].updateBullets();
                            enemyRows[i][j].showBullets();
                        }
                    }
                }
            }
        }
        for (var i = enemyAnimations.length - 1; i >= 0; i--) {
            if (enemyAnimations[i].done() == true) {
                enemyAnimations.splice(i, 1);
            } else {
                enemyAnimations[i].update();
                enemyAnimations[i].show();
            }
        }
        for (var i = playerAnimations.length - 1; i >= 0; i--) {
            if (playerAnimations[i].done() == true) {
                playerAnimations.splice(i, 1);
            } else {
                playerAnimations[i].update();
                playerAnimations[i].show();
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
}
//=====================================================================================================
function gameIsOver(txt, winOrLose) {
    noLoop();
    setTimeout(function() {
        textSize(70);
        background(0);
        fill(textColor);
        text(txt, windowWidth / 2, windowHeight / 2);
        textSize(15);
        text("Press the spacebar to retry.", windowWidth / 2, windowHeight / 2 + 30);
        setTimeout(function() {
            window.addEventListener("keydown", function(event) {
                if (event.keyCode == 32) {
                    window.location.reload();
                }
            }, false);
        }, 1000);
        if (winOrLose == 1) {
            win.play();
        } else {
            //play loseSound
        }
    }, 500);
}

function newRow(number, firstPos) {
    var row = [];
    for (var i = number; i > 0; i--) {
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
//KEY CONTROLLER =================================================================================================
function assignKeys(number, left1, left2, right1, right2, shoot1, shoot2) {
    players[number].leftKey[0] = left1;
    players[number].leftKey[1] = left2;
    players[number].rightKey[0] = right1;
    players[number].rightKey[1] = right2;
    players[number].shootKey[0] = shoot1;
    players[number].shootKey[1] = shoot2;
}

function getKeysForPlayer(number) {
    switch (number) {
        case 1:
            assignKeys(number - 1, '37', '<', '39', '>', '38', '^');
            break;
        case 2:
            assignKeys(number - 1, '65', 'A', '68', 'D', '87', 'W');
            break;
        case 3:
            assignKeys(number - 1, '71', 'G', '74', 'J', '90', 'Z');
            break;
    }
}
keys = [];
window.addEventListener("keydown", function(e) {
    keys[e.keyCode] = e.keyCode;
}, false);
window.addEventListener('keyup', function(e) {
    keys[e.keyCode] = false;
}, false);

function getPressedKeys() {
    var res = [];
    for (var i = 0; i < keys.length; i++) {
        if (keys[i]) {
            res[res.length] = keys[i];
        }
    }
    return res;
}