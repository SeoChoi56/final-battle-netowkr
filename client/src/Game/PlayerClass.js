
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
            this.opacity = 1
        }
    }


    draw(ctx) {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = "black"
        ctx.fillText(`HP: ${this.HP}`, this.position.x, this.position.y, 100)
        ctx.font = "30px Times New Roman"
        ctx.drawImage(this.image, this.position.x, this.position.y)
        ctx.restore()
    }

    update(ctx) {
        if (this.image) {
            this.draw(ctx)
        }
    }
}

export default PlayerClass