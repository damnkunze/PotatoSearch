var enemiesPerRow = 8,
    startEnemyRows = 4,
    enemyWait = 20000,
    enemyFirstWait = 10000, //       20 seconds
    enemyBeginWait = 3000,
    enemyBulletSpeed = 8, //   2 seconds
    enemyShootSpeed = 800,
    enemyNotShootChance = 15;
var playerShootSpeed = 500;
var blockerCounter = 3,
    blockerSize = 160,
    blockerHitpoints = 5;
var bulletSize = 15; //         Size of all bullets
var opponentShootSpeed = 1000;
var undeadPlayers = false;
//
//
//NO CHANGES BELOW THIS LINE!!! ----------------------------------------------
var keys;
var start = false;
var lost = false;
var textColor;
var timeouted = false;
var enemyMovingDir = 1;
var enemyCounter;
var enemyRows = [];
var blockers = [];
var enemyAnimations = [];
var playerAnimations = [];
var alreadyOver = false;
var deviceIsOkay = true;
var lastEnemy;
var firstEnemy;
var animate;
var paused = false;
var player;
var opponent;
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
}

function setup() {
    if (windowWidth > 1000 && windowHeight > 450) {
        deviceIsOkay = true;
    }
    createCanvas(windowWidth + displayWidth, windowHeight);
    player = new Player();
    opponent = new Opponent();
    //
    for (var i = 0; i < startEnemyRows; i++) {
        enemyRows[i] = newRow(enemiesPerRow);
        //
        for (var e = enemyRows.length - 1; e >= 0; e--) {
            for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                enemyRows[e][j].moveCloser();
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
    setTimeout(function() { //First timeout is different from the normal
        timeouted = true;
        setInterval(function() {
            timeouted = true;
        }, enemyWait);
    }, enemyFirstWait)
    setTimeout(function() {
        player.showHelp = false;
        opponent.showHelp = false;
        start = true;
    }, enemyBeginWait);
    textColor = color(200);
    player.scoreCounter = new ScoreCounter();
    setInterval(function() {
        player.scoreCounter.everyMinute();
    }, 1000 * 60);
    setInterval(function() {
        player.scoreCounter.everyTenSeconds();
    }, 1000 * 10);
    animate = new AnimationController();
}

function draw() {
    if (deviceIsOkay == false) {
        gameIsOver('too small');
    } else {
        if (player.dead == true && alreadyOver == false) {
            alreadyOver = true;
            gameIsOver('opponent');
        } else if (opponent.dead == true && alreadyOver == false) {
            alreadyOver = true;
            gameIsOver('player');
        } else {
            if (!keyIsPressed) {
                keys = [];
            }
            background(color(0, 0, 0, 50));
            enemyCounter = 0;
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
            for (var i = enemyRows.length - 1; i >= 0; i--) {
                for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                    if (enemyRows[i][j].dead == true) {
                        enemyRows[i][j].move();
                        enemyRows[i][j].update();
                    } else {
                        enemyRows[i][j].move();
                        enemyRows[i][j].update();
                        enemyRows[i][j].show(i);
                        if (start == true) {
                            enemyRows[i][j].updateBullets();
                            enemyRows[i][j].showBullets();
                        }
                    }
                }
            }
            var frontArr = enemyRows[0];
            lastEnemy = frontArr[frontArr.length - 1];
            firstEnemy = frontArr[0];
            if (keyIsPressed) {
                player.move();
                opponent.move();
            }
            player.updateBullets();
            player.showBullets();
            if (player.dead == false) {
                player.show();
            }
            if (opponent.dead == false) {
                opponent.update();
                opponent.show();
            }
            opponent.updateBullets();
            opponent.showBullets();
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
                enemyRows[enemyRows.length] = newRow(enemiesPerRow, enemyRows[0][0].pos.x);
                for (var i = enemyRows.length - 1; i >= 0; i--) {
                    for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                        enemyRows[i][j].moveCloser();
                    }
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
                win.play();
                if (why == 'player') {
                    text("The indvader has won!", windowWidth / 2, windowHeight / 2);
                    textSize(15);
                    text("Press the spacebar to retry.", windowWidth / 2, windowHeight / 2 + 30);
                }
                if (why == 'opponent') {
                    text("The aliens have won!", windowWidth / 2, windowHeight / 2);
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