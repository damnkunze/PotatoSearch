var enemiesPerRow = 8,
    startEnemyRows = 4,
    enemyFireRate = 8,
    enemyWait = 20000, //20 seconds
    enemyBeginWait = 2000, //2 seconds
    enemyCounter = 10,
    enemyRows = [],
    timeouted = false,
    dir = 1;
var players = [],
    playerCounter = 2, //Up to 3 Players
    bulletSize = 15;
var keys;
var start = false;
var lost = false;
//
function clog(msg) {
    console.log(msg);
}

function preload() {
    if (!localStorage.getItem('enemies')) {
        localStorage.setItem('enemies', ' ');
    }
    if (!localStorage.getItem('players')) {
        localStorage.setItem('players', ' ');
    }
    enemyKill = loadSound('../games/assets/enemyKilled.mp4');
    enemyShoot = loadSound('../games/assets/enemyShoot.mp4');
    playerKill = loadSound('../games/assets/playerKilled.mp4');
    playerShoot = loadSound('../games/assets/playerShoot.mp4');
    win = loadSound('../games/assets/win.mp4');
    enemyKill.setVolume(0.5);
    playerKill.setVolume(0.3);
    enemyShoot.setVolume(0.15);
    playerShoot.setVolume(0.35);
}

function setup() {
    createCanvas(windowWidth + displayWidth, windowHeight);
    if (playerCounter > 3) playerCounter = 3;
    for (var i = 0; i < playerCounter; i++) {
        players[i] = new Player();
        getKeysForPlayer(i + 1); //Convert i to the players number
        players[i].number = i + 1;
    }
    noStroke();
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
    textAlign(CENTER);
    setInterval(function() {
        timeouted = true;
    }, enemyWait);
    setInterval(function() {
        if (!keyIsPressed) {
            keys = [];
        }
    }, 100)
    setTimeout(function() {
        start = true;
    }, enemyBeginWait);
    saveGame();
}

function draw() {
    if (enemyCounter == 0) {
        noLoop();
        setTimeout(function() {
            textSize(70);
            background(0);
            fill(255);
            text("You won!", windowWidth / 2, windowHeight / 2);
            fill(0, 200, 0);
            deleteSaved();
            typeToReload();
            win.play();
        }, 500);
    } else if (playerCounter == 0 || lost == true) {
        noLoop();
        setTimeout(function() {
            textSize(70);
            background(0);
            fill(255);
            text("You lost!", windowWidth / 2, windowHeight / 2);
            deleteSaved();
            typeToReload();
        }, 500);
    } else {
        background(0);
        enemyCounter = 0;
        playerCounter = 0;
        for (var i = enemyRows.length - 1; i >= 0; i--) {
            for (var j = enemyRows[i].length - 1; j >= 0; j--) {
                if (!enemyRows[i][j].dead) {
                    enemyCounter++;
                }
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

function typeToReload() {
    textSize(15);
    fill(255);
    text("Press any key to retry.", windowWidth / 2, windowHeight / 2 + 30);
    window.addEventListener("keydown", function() {
        window.location.reload();
    }, false);
}
//SAVE CONTROLLER =========================================================================================
function saveGame() {
    deleteSaved();
    for (var i = enemyRows.length - 1; i >= 0; i--) {
        for (var j = enemyRows[i].length - 1; j >= 0; j--) {
            var untilNow = localStorage.getItem('enemies');
            var curr = enemyRows[i][j];
            localStorage.setItem('enemies', untilNow + curr.pos.x + '$' + curr.pos.y + '$' + curr.corners + '$' + curr.dead + '#');
        }
        localStorage.setItem('enemies', localStorage.getItem('enemies') + '*');
    }
    for (var i = players.length - 1; i >= 0; i--) {
        var untilNow = localStorage.getItem('players');
        localStorage.setItem('players', untilNow + JSON.stringify(players[i]));
    }
    clog(localStorage.getItem('players'));
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
}

function deleteSaved() {
    localStorage.setItem('enemies', ' ');
    localStorage.setItem('players', ' ');
}
//KEY CONTROLLER =================================================================================================
function getKeysForPlayer(number) {
    switch (number) {
        case 1:
            players[0].leftKey = '37'; //A D W
            players[0].rightKey = "39";
            players[0].shootKey = '38';
            break;
        case 2:
            players[1].leftKey = '65'; //LEFT_ARROW RIGHT_ARROW UP_ARROW
            players[1].rightKey = '68';
            players[1].shootKey = '87';
            break;
        case 3:
            players[2].leftKey = '71'; //G J Z
            players[2].rightKey = '74';
            players[2].shootKey = '90';
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