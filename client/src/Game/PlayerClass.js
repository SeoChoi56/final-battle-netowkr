
class PlayerClass {


    constructor() {

        const image = new Image()
        image.src = "/PlayerModel/megaSF.png"

        image.onload = () => {
            this.image = image
            this.position = {
                x: 128,
                y: 128
            }
            this.HP = 100
            this.radius = 31
        }
    }


    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y)
    }

    update(ctx) {
        if (this.image) {
            this.draw(ctx)
        }
    }
}

export default PlayerClass