import React, { useRef, useEffect, } from 'react'
import Enemy1 from './Enemy1';
import PlayerClass from './PlayerClass';
import Projectile from './Projectile';

export default function Canvas() {

    const rows = 4
    const columns = 8
    const gridSize = 128

    //create player
    const player = new PlayerClass()

    //projectiles array
    const projectiles = []

    //Enemies array - 
    //populate it to render for each enemy 
    //their position will be determined by:
    //x: random number (3-5) * tile-size
    //y: random number (0-2) * tile-sze
    //tile size = 128
    const enemiesList = []

    //number of enemies will be random but in between 1 - 3
    function randomNumEnemies() {
        const rand = Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < rand; i++){
            //create a random number (3-5) for x position
            const randXPos = (Math.floor(Math.random() * 4) + 4) * 128
            const randYPos = (Math.floor(Math.random() * 4) + 0) * 128
            const randPos = {
                x: randXPos,
                y: randYPos
            }
            enemiesList.push(new Enemy1(randPos))
        }
    }

    const enemy1ProjectileList = []

    //Initial level number
    //Flag for end level
    const levelNum = 1
    let endLevel = false


    //Canvas ref
    const canvasRef = useRef(null)

    const keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        w: {
            pressed: false
        },
        s: {
            pressed: false
        },
        space: {
            pressed: false
        },
    }

    //Make grid 
    function grid(ctx) {
        //horizontal lines
        for (let i = 0; i < rows; i++) {
            const y_interval = i * gridSize;
            ctx.beginPath();
            ctx.moveTo(0, y_interval);
            ctx.lineTo(gridSize * 8, y_interval);
            ctx.stroke();
        }

        //vertical lines
        for (let j = 0; j < columns; j++) {
            const x_interval = j * gridSize;
            ctx.beginPath();
            ctx.moveTo(x_interval, 0);
            ctx.lineTo(x_interval, gridSize * 4);
            ctx.stroke();
        }
    }

    //To make the test enemy
    const randXPos = (Math.floor(Math.random() * 4) + 4) * 128
    const randYPos = (Math.floor(Math.random() * 4) + 0) * 128
    const randPos = {
        x: randXPos,
        y: randYPos
    }

    //for when testing with one enemy
    const testEnemy = new Enemy1(randPos)

    //animation of game
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')
        randomNumEnemies()
        function animate() {
            //Checks to see if enemies list is populated - if populated, gameplay assumes
                requestAnimationFrame(animate)
                //clear canvas to redraw animation
                ctx.clearRect(0, 0, canvas.width, canvas.height)
    
                //Draws the "battle grid"
                grid(ctx)
    
                //Draw and redraw player based on key input
                player.update(ctx)

                //Draws the enemies in enemy ist
                enemiesList.forEach((enemy, index) => {
                    enemy.update(ctx)
                    projectiles.forEach((projectile, projIndex) => {
                        const rightOfProjectile = projectile.position.x + projectile.radius
                        const middleOfEnemyX = (enemy.position.x + 64)
                        const middleOfEnemyY = (enemy.position.y + 64)
                        //checks to see if projectile is within the enemies "hitbox (radius)"
                        if(rightOfProjectile >= (middleOfEnemyX - enemy.radius) && rightOfProjectile <= (middleOfEnemyX + enemy.radius) && projectile.position.y >= (middleOfEnemyY - enemy.radius) && projectile.position.y <= (middleOfEnemyY + enemy.radius)){
                            //checks for enemy health if dead then remove from list
                            //if not keep going
                            if(enemy.HP <= 1) {
                                setTimeout(() => {
                                    enemiesList.splice(index, 1)
                                    projectiles.splice(projIndex, 1)
                                }, 0)
                            } else {
                                setTimeout(() => {
                                    enemy.HP -= projectile.damage
                                    projectiles.splice(projIndex, 1)
                                })
                            }
                        }
                    })
                })
                // testEnemy.update(ctx)
    
                //If projectile exists for player, then projectile fires
                projectiles.forEach((projectile, index) => {
                    if(projectile.position.x >= 1024) {
                        setTimeout(() => {
                            projectiles.splice(index, 1)
                        }, 0)
                    } else {
                        projectile.update(ctx)
                    }
                })            
        }
            animate()
    })

    //updates the new position as set by the keypress
    function updatePosition(newPosition, direction) {
        switch (direction) {
            case 'left':
                if (player.position.x != 0) {
                    player.position = {
                        x: newPosition,
                        y: player.position.y
                    }
                }
                break;
            case 'right':
                if (player.position.x < 384) {
                    player.position = {
                        x: newPosition,
                        y: player.position.y
                    }
                }
                break;
            case 'up':
                if (player.position.y != 0) {
                    player.position = {
                        x: player.position.x,
                        y: newPosition
                    }
                }
                break;
            case 'down':
                if (player.position.y < 384) {
                    player.position = {
                        x: player.position.x,
                        y: newPosition
                    }

                }
                break;
        }
    }




    //movement handler for player
    //movement kind of works but because strict calls it twice, it messes up movement
    //turning off strict mode 
    useEffect(() => {
        document.addEventListener('keydown', ({ key }) => {
            switch (key) {
                //Sets the new position of the character when key is pressed
                case 'a':
                    updatePosition((player.position.x - 128), "left")
                    keys.a.pressed = true
                    break;
                case 'd':
                    updatePosition((player.position.x + 128), "right")
                    keys.d.pressed = true
                    break;
                case 'w':
                    updatePosition((player.position.y - 128), "up")
                    break;
                case 's':
                    updatePosition((player.position.y + 128), "down")
                    break;
                case ' ':
                    //creates the new projectile
                    projectiles.push(new Projectile({
                        position: {
                            x: player.position.x + 102,
                            y: player.position.y + 64
                        },
                        velocity: 10
                    }))
                    break;
            }
        })
    }, [])




    return (
        <div>
            <canvas id="canvas" ref={canvasRef} height="512px" width="1024px" />
            <button onClick={randomNumEnemies}>Random</button>
        </div>
    )
}