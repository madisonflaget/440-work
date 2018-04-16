// adapted from code by Kyle McDonald
// https://kylemcdonald.github.io/cv-examples/

var capture;
var w = 640,
    h = 480;
var raster, param, pmat, resultMat, detector;

// variables to move the marker image around
var move = 0;
let markers = [];
var imgY = 0;

//create memory variable to keep track of how long a marker is obscurred. Create a starting number of lives from which memory will subtract later
var memory = 0;
var lives = 3;

// create an array to store the names of the the 3 markers
var marker_img1;
var marker_img2;
var marker_img3;
var marker_img;

var game_active = true;

function preload()  {

    // preload marker images and sounds so they display faster
    marker_img1 = loadImage('assets/m2.png');
    marker_img2 = loadImage('assets/m10.png');
    marker_img3 = loadImage('assets/m98.png');
    marker_img = [ marker_img1, marker_img2, marker_img3 ];

    soundFormats('mp3');
    music = loadSound('assets/mario_music.mp3');
    lose_life = loadSound('assets/lose_life.mp3');
    gameover_sound = loadSound('assets/gameover.mp3');
}

function setup() {
    //load bg image and gameover image
    bg = loadImage("assets/mario_bg.png");
    game_over = loadImage("assets/game_over.jpg");

    // If game is active and running: set volume then start playing music
    if (game_active) {
        music.setVolume(1.0);
        music.play();
    }

    //load initial marker image into canvas
    imgX = windowWidth - 220;
    markers.push( new Marker(marker_img1, imgX, imgY ) );

    pixelDensity(1); // this makes the internal p5 canvas smaller
    capture = createCapture(VIDEO);
    createCanvas(windowWidth - 30, windowHeight - 130);
    capture.size(windowWidth - 30, windowHeight - 130);
    capture.hide();

    raster = new NyARRgbRaster_Canvas2D(canvas);
    param = new FLARParam(canvas.width, canvas.height);
    pmat = mat4.identity();
    param.copyCameraMatrix(pmat, 100, 10000);
    resultMat = new NyARTransMatResult();
    detector = new FLARMultiIdMarkerDetector(param, 2);
    detector.setContinueMode(true);
}

function draw() {

    if (game_active) {

        image(capture, 0, 0, windowWidth - 30, windowHeight - 130);
        canvas.changed = true;
        var thresholdAmount = 140; //select('#thresholdAmount').value() * 255 / 100;
        detected = detector.detectMarkerLite(raster, thresholdAmount);

        // added a background so that there is a plain canvas to draw on. Then marker image is drawn
        background(bg);

        //each frame, generate a random number in a range to be used for the y location of the image
        imgY = random(0, 400);

        // draw and update markers if they hit the edge of the screen
        for( let i = markers.length-1; i >= 0; i-- ){
            markers[i].display();
            markers[i].move();
            if( markers[i].destroy() ){
                markers.splice(i, 1);
                markers.push( new Marker(random(marker_img), imgX, imgY ));
            }
        }

        for (var i = 0; i < detected; i++) {
            // read data from the marker
            //var id = detector.getIdMarkerData(i);

            // *** commented out this line to get rid of the annoying flashing ***
            // get the transformation for this marker
            // detector.getTransformMatrix(i, resultMat);

            // convert the transformation to account for our camera
            var mat = resultMat;
            var cm = mat4.create
            cm[0] = mat.m00, cm[1] = -mat.m10, cm[2] = mat.m20, cm[3] = 0;
            cm[4] = mat.m01, cm[5] = -mat.m11, cm[6] = mat.m21, cm[7] = 0;
            cm[8] = -mat.m02, cm[9] = mat.m12, cm[10] = -mat.m22, cm[11] = 0;
            cm[12] = mat.m03, cm[13] = -mat.m13, cm[14] = mat.m23, cm[15] = 1;
            mat4.multiply(pmat, cm, cm);

            // define a set of 3d vertices
            var q = 1;
            var verts = [
                vec4.create(-q, -q, 0, 1),
                vec4.create(q, -q, 0, 1),
                vec4.create(q, q, 0, 1),
                vec4.create(-q, q, 0, 1),
            //vec4.create(0, 0, -2*q, 1) // poke up
            ];

            // convert that set of vertices from object space to screen space
            var w2 = width / 2,
                h2 = height / 2;
            verts.forEach(function (v) {
                mat4.multiplyVec4(cm, v);
                v[0] = v[0] * w2 / v[3] + w2;
                v[1] = -v[1] * h2 / v[3] + h2;
            });

            noStroke();
            fill(0, millis() % 255);
            beginShape();
            verts.forEach(function (v) {
                vertex(v[0], v[1]);
            });
            endShape();
        }

        // if all existing markers are visble, reset memory to 0 (to clear anomalies)
        // If fewer than the number of existing markers  is visible: subtract 1 from lives, splice out the oldest marker, draw a new marker at the start point
        if (detected >= markers.length) {
            memory = 0;
        } else {
            memory++
            if (memory > 30){
                memory = 0;
                lives--;
                music.stop();
                lose_life.setVolume(1.0);
                lose_life.play();
                markers.splice(i, 1);
                // if I lose all my lives, then I get a Game Over screen and the music stops
                if (lives <= 0 && game_active) {
                    game_active = false;
                    background(game_over);
                    music.stop();
                    setTimeout(function(){
                        gameover_sound.setVolume(1.0);
                        gameover_sound.play();
                    }, 3500);
                }
                if (game_active) {
                    setTimeout(function(){
                    music.play();
                    markers.push(new Marker(random(marker_img), imgX, imgY));
                    }, 3500);
                }
            }
        }
    } // <- end game active conditional

    select('#markersDetected').elt.innerText = detected;
    // new ID 'lives' to keep track of how many times a variable is obscurred ie I collides
    select('#lives').elt.innerText = lives;


}
