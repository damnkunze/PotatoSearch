var enemiesPerRow = 8,
    startEnemyRows = 4,
    enemyWait = 20000,
    enemyFirstWait = 10000, //       20 seconds
    enemyBeginWait = 3000,
    enemyBulletSpeed = 8; //   2 seconds
var playerCounter = 2, //       Up to 3 Players
    playerShootSpeed = 500;
var blockerCounter = 3,
    blockerSize = 160,
    blockerHitpoints = 5;
var bulletSize = 15; //         Size of all bullets
var undeadPlayers = false;
//
//
//NO CHANGES BELOW THIS LINE!!! ----------------------------------------------
var keys;
var start = false;
var lost = false;
var textColor;
var players = [];
var timeouted = false;
var enemyMovingDir = 1;
var enemyCounter;
var enemyRows = [];
var blockers = [];
var enemyAnimations = [];
var playerAnimations = [];
var scoreCounter;
var alreadyOver = false;
var deviceIsOkay = true;
var lastEnemy;
var firstEnemy;
var animate;
var paused = false;
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
    if (windowWidth > 1000 && windowHeight > 450) {
        deviceIsOkay = true;
    }
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
    setTimeout(function() { //First timeout is different from the normal one
        timeouted = true;
        setInterval(function() {
            timeouted = true;
        }, enemyWait);
    }, enemyFirstWait)
    setTimeout(function() {
        start = true;
    }, enemyBeginWait);
    textColor = color(200);
    scoreCounter = new ScoreCounter();
    setInterval(function() {
        scoreCounter.everyMinute();
    }, 1000 * 60);
    setInterval(function() {
        scoreCounter.everyTenSeconds();
    }, 1000 * 10);
    animate = new Animate();
}

function draw() {
    if (deviceIsOkay == false) {
        gameIsOver('too small');
    } else {
        if (enemyCounter == 0 && alreadyOver == false) {
            alreadyOver = true;
            gameIsOver('won');
        } else if ((playerCounter == 0 || lost == true) && alreadyOver == false) {
            alreadyOver = true;
            gameIsOver('lost');
        } else {
            if (!keyIsPressed) {
                keys = [];
            }
            background(color(0, 0, 0, 50));
            scoreCounter.show();
            enemyCounter = 0;
            playerCounter = 0;
            for (var i = enemyRows.length - 1; i >= 0; i--) {
                if (enemyRows[i].isABoss) {
                    enemyCounter++;
                } else {
                    for (var j = enemyRows[i].length - 1; j >= 0; j--) { //Count the enemies
                        if (!enemyRows[i][j].dead) {
                            enemyCounter++;
                        }
                    }
                }
            }
            for (var i = blockers.length - 1; i >= 0; i--) {
                if (blockers[i].active == true) {
                    blockers[i].update();
                    blockers[i].show();
                }
            }
            fill(0, 200, 0);
            strokeWeight(200);
            line(0, 0, windowWidth, windowHeight);
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
                if (enemyRows[i].isABoss == true) {
                    if (enemyRows[i].dead == true) {
                        enemyRows[i].move();
                        enemyRows[i].update();
                    } else {
                        enemyRows[i].move();
                        enemyRows[i].update();
                        enemyRows[i].show(i);
                        if (start == true) {
                            enemyRows[i].updateBullets();
                            enemyRows[i].showBullets();
                        }
                    }
                } else {
                    for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                        if (enemyRows[i].length == 0) {
                            enemyRows.splice(i, 1);
                        } else {
                            if (enemyRows[i][j].dead == true) {
                                enemyRows[i][j].move(enemyMovingDir);
                                enemyRows[i][j].update();
                            } else {
                                enemyRows[i][j].move(enemyMovingDir);
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
            }
            var frontArr = enemyRows[0];
            lastEnemy = frontArr[frontArr.length - 1];
            firstEnemy = frontArr[0];
            if (lastEnemy.pos.x >= windowWidth - firstEnemy.w) {
                enemyMovingDir = -1;
            } else if (firstEnemy.pos.x <= 0 + firstEnemy.w) {
                enemyMovingDir = 1;
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
                    if (enemyRows[i].isABoss == true) {
                        enemyRows[i].moveCloser();
                    } else {
                        for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                            enemyRows[i][j].moveCloser();
                        }
                    }
                }
                var divBy__ = (enemyRows.length + 1) / 5;
                if (floor(divBy__) == divBy__) { // Nur wenn es teilbar durch ___ ist
                    enemyRows[enemyRows.length] = new BossEnemy();
                } else {
                    enemyRows[enemyRows.length] = newRow(enemiesPerRow, enemyRows[0][0].pos.x);
                }
            }
        }
    }
}
//=====================================================================================================
function gameIsOver(why) {
    clearInterval();
    clearTimeout();
    window.addEventListener("keydown", function(event) {
        if (event.keyCode == 32) {
            window.location.reload();
        }
    }, false);
    if (why == 'too small') {
        noLoop();
        background(0);
        fill(255);
        textSize(windowWidth / 20);
        text("Your device or browser window is too small!", windowWidth / 2, windowHeight / 2);
        textSize(windowWidth / 50);
        text("Press the spacebar after you have resized it.", windowWidth / 2, windowHeight / 2 + 30)
    } else {
        setTimeout(function() { //First stop the game and then write on top of it
            noLoop();
            setTimeout(function() {
                background(0);
                textSize(70);
                fill(textColor);
                if (why == 'won') {
                    win.play();
                    text("You won!", windowWidth / 2, windowHeight / 2);
                    scoreCounter.show();
                    textSize(15);
                    text("Press the spacebar to retry.", windowWidth / 2, windowHeight / 2 + 30);
                }
                if (why == 'lost') {
                    text("You have lost!", windowWidth / 2, windowHeight / 2);
                    scoreCounter.show();
                    textSize(15);
                    text("Press the spacebar to retry.", windowWidth / 2, windowHeight / 2 + 30);
                }
            }, 200);
        }, 1500);
    }
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

function keyPressed() {
    if (key == ' ' && !alreadyOver) {
        if (!paused) {
            paused = true;
            pauseGame();
        } else {
            paused = false;
            resumeGame();
        }
    }
}

function resumeGame() {
    loop();
}

function pauseGame() {
    noLoop();
    fill(255);
    var size = 40;
    rect(size, size * 2, size, size * 2);
    rect(size * 3 - (size / 2), size * 2, size, size * 2);
}
//KEY CONTROLLER =================================================================================================
keys = [];
window.addEventListener("keydown", function(e) {
    keys[e.keyCode] = e.keyCode;
}, false);
window.addEventListener('keyup', function(e) {
    keys.splice(e.keyCode, 1);
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