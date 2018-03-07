var img;
var move = 0;
var imgX = 500;
var imgY = 400;

function preload()  {
    img = loadImage('assets/mark_smaller.png');
}

function setup() {
    createCanvas(windowWidth-20,windowHeight-20);
    image(img, imgX, imgY);
}

function draw() {
    // imgX =- 1;
}
