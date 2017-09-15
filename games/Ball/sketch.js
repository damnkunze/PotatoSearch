/*
 * @name Forces
 * @description Demonstration of multiple force acting on bodies
 * (<a href="http://natureofcode.com">natureofcode.com</a>)
 */
// Demonstration of multiple force acting on 
// bodies (Mover class)
// Bodies experience gravity continuously
// Bodies experience fluid resistance when in "water"
// Five moving bodies
var movers = [];
var liquid;
var h;
var y;
var margin = 40;
var maxClickDist = 30;
var animate;
var animations = [];
var liquidC;
var liquidSlowing = 0.05;
var spawnRate = 200;
var animationCount = 20;

function clog(msg) {
    console.log(msg);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    liquidC = color(100, 150, 250);
    rectMode(CENTER);
    ellipseMode(CENTER);
    noStroke();
    h = 200;
    y = height - h / 2;
    animate = new AnimationController();
    liquid = new Liquid(width / 2, y, width, h, liquidSlowing);
    setInterval(function() {
        movers.push(new Mover(random(0.5, 3), random(margin, width - margin), 0));
    }, spawnRate)
}

function draw() {
    background(200);
    // Draw water
    liquid.display();
    checkMouse();
    clog(frameRate());
    if (animations.length / animationCount > 1) {
        for (var i = 5; i >= 0; i--) {
            var particle = floor(random(0, animations.length));
            animations.splice(particle, 1)
        }
    }
    for (var i = animations.length - 1; i >= 0; i--) {
        if (animations[i].done() == true) {
            animations.splice(i, 1);
        } else {
            animations[i].update();
            animations[i].show();
        }
    }
    for (var i = 0; i < movers.length; i++) {
        // Is the Mover in the liquid?
        if (liquid.contains(movers[i])) {
            if (movers[i].firstInLiquid == false) {
                movers[i].firstInLiquid = true;
                animate.moverIn(movers[i]);
            }
            // Calculate drag force
            var dragForce = liquid.calculateDrag(movers[i]);
            // Apply drag force to Mover
            movers[i].applyForce(dragForce);
        } else {
            movers[i].firstInLiquid = false;
        }
        // Gravity is scaled by mass here!
        var gravity = createVector(0, 0.1 * movers[i].mass);
        // Apply gravity
        movers[i].applyForce(gravity);
        // Update and display
        movers[i].update();
        movers[i].display();
        movers[i].checkEdges();
    }
}

function reset() {
    movers = [];
    animations = [];
}

function checkMouse() {
    fill(200, 0, 0, 150);
    ellipse(mouseX, mouseY, maxClickDist);
    for (var i = 0; i < movers.length; i++) {
        var d = dist(movers[i].position.x, movers[i].position.y, mouseX, mouseY);
        if (d < maxClickDist + movers[i].mass / 2) {
            var yPush = (movers[i].position.y - mouseY) * 0.3;
            var xPush = (movers[i].position.x - mouseX) * 0.3;
            var pushForce = createVector(yPush, xPush);
            var opposite = p5.Vector.mult(movers[i].velocity, -1);
            movers[i].velocity.mult(0);
            movers[i].acceleration.mult(0);
            movers[i].applyForce(pushForce);
        }
    }
}

function keyPressed() {
    if (keyCode == 13) {
        reset();
    }
    if (keyCode == UP_ARROW) {
        pushAllMovers(createVector(0, -10));
    }
    if (keyCode == RIGHT_ARROW) {
        pushAllMovers(createVector(10, 0));
    }
    if (keyCode == LEFT_ARROW) {
        pushAllMovers(createVector(-10, 0));
    }
    if (keyCode == DOWN_ARROW) {
        pushAllMovers(createVector(0, 10));
    }
    if (key == 'S') {
        noLoop();
    }
}

function pushAllMovers(v) {
    for (var i = 0; i < movers.length; i++) {
        movers[i]
        movers[i].applyForce(v);
    }
}

function keyReleased() {
    if (key == 'S') {
        loop();
    }
}