var img;
var move = 0;
var imgX = 0;
var imgY = 0;

function preload()  {
    img = loadImage('assets/mark_smaller.png');
}

function setup() {
    imgX = windowWidth-220;

    createCanvas(windowWidth-20,windowHeight-20);
    background(0);

}

function draw() {
    background('black')
    image(img, imgX, imgY);

    imgX = imgX - 1;
}
