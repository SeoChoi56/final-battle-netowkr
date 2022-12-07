import Enemy1Projectile from './Enemy1Projectile'

class Enemy1 {
    constructor(newposition, levelNum ) {
        const image = new Image()
        image.src = "/EnemyModel/mettaur-sprite-map.png"


        image.onload = () => {
            this.image = image
            this.position = {
                x: newposition.x,
                y: newposition.y
            }
            this.frameCount = 0;
            this.directionUp = true
            this.HP = 20
            //this is the hitbox
            this.radius = 31
            this.levelNum = levelNum
        }
    }

    draw(ctx) {
        ctx.fillStyle = "black"
        ctx.fillText(`HP: ${this.HP}`, this.position.x, this.position.y, 100)
        ctx.font = "30px Times New Roman"
        ctx.drawImage(this.image, this.position.x, this.position.y)
    }

    update(ctx, enemy1ProjectileList) {
        if (this.image) {
            this.draw(ctx)
            this.frameCount++
            if (this.frameCount === 40) {
                const chanceToFire = Math.floor(Math.random() * 100) + 1
                if(chanceToFire > 60)
                this.shoot(enemy1ProjectileList)
            }
            //every 5 frames/update calls
            if (this.frameCount === 60) {
                //checks for direction
                if (this.directionUp) {
                    //if position is at top change direction
                    //otherwise change y to a higher position
                    if (this.position.y > 0) {
                        this.position.y -= 128
                    } else {
                        this.directionUp = !this.directionUp
                    }
                } else {
                    if (this.position.y < 384) {
                        this.position.y += 128
                    } else {
                        this.directionUp = !this.directionUp
                    }
                }
                this.frameCount = 0;
            }
        }
    }

    shoot(enemies1List) {
        enemies1List.push(new Enemy1Projectile({
            position: {
                x: this.position.x + 38,
                y: this.position.y + 64
            },
            velocity: {
                x: -2,
                y: 0
            }
        }))
    }
}

export default Enemy1