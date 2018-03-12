class Marker {
    constructor(img, x, y) {
        this.imgRef = img;
        this.posX = x;
        this.posY = y;
        this.deltaX = -4;
        this.deltaY = 0;
    }

    display(){
        image(this.imgRef, this.posX, this.posY);
    }

    move(){
        this.posX += this.deltaX;
        this.posY += this.deltaY;
    }

    destroy(){
        if(this.posX < 0){
            return true;
        } else {
            return false;
        }
    }
}
