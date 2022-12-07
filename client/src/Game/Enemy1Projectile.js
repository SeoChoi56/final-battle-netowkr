class Enemy1Projectile {
    constructor({position, velocity}) {
        this.position = {
            x: position.x,
            y: position.y
        }
        this.velocity = velocity
        this.width = 25
        this.height = 8
        this.damage = 5
    }

    draw(ctx) {
        ctx.fillStyle="white"
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(ctx) {
        this.draw(ctx)
        this.position.x += this.velocity.x
    }
}

export default Enemy1Projectile