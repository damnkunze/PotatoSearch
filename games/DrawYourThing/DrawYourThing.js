/*
Draw with the mouse; erase with the spacebar; clear with tab, save with enter; 
 change modes with , and . ; change brushSize of brush with 1 to 6; change color randomly with the mousewheel
*/
var brushSize = 30,
    wheel, mode; //1 = ellipse, 2 = rect
var x, y;
var spaceState = true;
var allSame = 0,
    r = allSame,
    g = allSame,
    b = allSame,
    saveNumber = 0;
var pageBackground,
    brush;

function setup() {
    pageBackground = color(255);
    createCanvas(windowWidth, windowHeight);
    background(pageBackground);
    noStroke();
    mode = 1;
    rectMode(CENTER);
    ellipseMode(CENTER);
}

function draw() {
    x = mouseX;
    y = mouseY;
    pageBackground = color(255);
    brush = color(r, g, b);
    if (spaceState == false) {
        fill(pageBackground);
    } else if (spaceState == true) {
        fill(brush);
    }
    if (mode == 1 && mouseIsPressed) {
        ellipse(x, y, brushSize, brushSize);
    }
    if (mode == 2 && mouseIsPressed) {
        rect(x, y, brushSize, brushSize);
    }
}

function keyPressed() {
    var Codekey = keyCode;
    if (Codekey == 8) {
        background(pageBackground);
    } else if (key == ' ' && spaceState == true) {
        spaceState = false;
    } else if (key == ' ' && spaceState == false) {
        spaceState = true;
    } else if (key == ENTER || key == RETURN || Codekey == 13) {
        save();
    }
    switch (key) {
        case '1':
            brushSize = 5;
            break;
        case '2':
            brushSize = 10;
            break;
        case '3':
            brushSize = 20;
            break;
        case '4':
            brushSize = 30;
            break;
        case '5':
            brushSize = 40;
            break;
        case '6':
            brushSize = 50;
            break;
        case '7':
            brushSize = 60;
            break;
        case '8':
            brushSize = 70;
            break;
        case '9':
            brushSize = 80;
            break;
        case ',', '¼':
            mode = 1;
            break;
        case '.', '¾':
            mode = 2;
            break;
    }
}