var img;

function preload()  {
    img = loadImage('assets/mark_smaller.png');
}

function setup() {
    createCanvas(800,800);
    image(img, 0, 0);
}
