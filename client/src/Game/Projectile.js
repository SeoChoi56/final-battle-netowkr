class Projectile {
    constructor({position , velocity}) {
        this.position = {
            x: position.x,
            y: position.y
        }
        this.velocity = velocity
        this.radius = 5
        this.damage = 1
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI)
        ctx.fillStyle = "blue"
        ctx.fill()
        ctx.closePath()
    }

    update(ctx) {
        this.draw(ctx)
        this.position.x += this.velocity
    }
}

export default Projectile