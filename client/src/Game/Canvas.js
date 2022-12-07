import React, { useRef, useEffect, useState, } from 'react'
import Enemy1 from './Enemy1';
import PlayerClass from './PlayerClass';
import Projectile from './Projectile';
import ParticleExplosion from './ParticleExplosion';
import "../Fonts/RetroGaming.ttf"

export default function Canvas({savePlayer, saveLevelNum, saveEnemiesList}) {

    const rows = 4
    const columns = 8
    const gridSize = 128

    let game = {
        over: false,
        active: true,
        restart: false
    }

    //Initial level number
    let levelNum = saveLevelNum
    const [showLevel, setLevel] = useState(levelNum)

    //create player
    const player = savePlayer

    //projectiles array
    const projectiles = []

    //Enemies array - 
    //populate it to render for each enemy 
    //their position will be determined by:
    //x: random number (3-5) * tile-size
    //y: random number (0-2) * tile-sze
    //tile size = 128
    const enemiesList = saveEnemiesList

    //number of enemies will be random but in between 1 - 3
    function randomNumEnemies() {
        const rand = Math.floor(Math.random() * (1 + levelNum)) + 1
        for (let i = 0; i < rand; i++) {
            //create a random number (3-5) for x position
            const randXPos = (Math.floor(Math.random() * 4) + 4) * 128
            const randYPos = (Math.floor(Math.random() * 4) + 0) * 128
            const randPos = {
                x: randXPos,
                y: randYPos
            }
            enemiesList.push(new Enemy1(randPos, levelNum))
        }
    }

    //player projectile of Enemy type 1
    const enemy1ProjectileList = []


    //particles Array
    const particles = []



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
            const animationID = window.requestAnimationFrame(animate)
            if (!game.active) return

            //win round or game
            if (enemiesList.length === 0) {
                if (levelNum === 2) {
                    //win the game
                }

                randomNumEnemies()
                // setTimeout(() => {
                //     game.active = false
                // }, 50)
                levelNum++
                setLevel(levelNum)
            }

            //clear canvas to redraw animation
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            //Draws the "battle grid"
            grid(ctx)

            //Draw and redraw player based on key input
            player.update(ctx)
            particles.forEach((particle, index) => {
                if (particle.opacity <= 0) {
                    setTimeout(() => {
                        particles.splice(index, 1)
                    })
                } else
                    particle.update(ctx)
            })

            //Draws the enemies in enemy ist
            enemiesList.forEach((enemy, index) => {

                //redraws the enemy 
                enemy.update(ctx, enemy1ProjectileList)

                //player projectiles hitting enemy
                projectiles.forEach((projectile, projIndex) => {
                    const rightOfProjectile = projectile.position.x + projectile.radius
                    const middleOfEnemyX = (enemy.position.x + 64)
                    const middleOfEnemyY = (enemy.position.y + 64)
                    //checks to see if projectile is within the enemies "hitbox (radius)"
                    if (rightOfProjectile >= (middleOfEnemyX - enemy.radius) && rightOfProjectile <= (middleOfEnemyX + enemy.radius) && projectile.position.y >= (middleOfEnemyY - enemy.radius) && projectile.position.y <= (middleOfEnemyY + enemy.radius)) {
                        //checks for enemy health if dead then remove from list
                        //if not keep going
                        if (enemy.HP <= 1) {
                            for (let i = 0; i < 15; i++) {
                                particles.push(new ParticleExplosion({
                                    position: {
                                        x: enemy.position.x + 64,
                                        y: enemy.position.y + 64
                                    },
                                    velocity: {
                                        x: (Math.random() - 0.5) * 12,
                                        y: (Math.random() - 0.5) * 12
                                    },
                                    radius: (Math.random()) * 10,
                                    color: 'yellow'
                                }))
                            }
                            setTimeout(() => {
                                enemiesList.splice(index, 1)
                                projectiles.splice(projIndex, 1)
                            }, 0)
                        } else
                            setTimeout(() => {
                                enemy.HP -= projectile.damage
                                projectiles.splice(projIndex, 1)
                            })
                    }

                })
                enemy1ProjectileList.forEach((enemy1Projectile, index) => {
                    const middleOfPlayerX = (player.position.x + 64)
                    const middleOfPlayerY = (player.position.y + 64)
                    if (enemy1Projectile.position.x <= 0) {
                        enemy1ProjectileList.splice(index, 1)
                    } else if (enemy1Projectile.position.x <= (middleOfPlayerX + player.radius) && enemy1Projectile.position.x >= (middleOfPlayerX - player.radius) && enemy1Projectile.position.y <= (middleOfPlayerY + player.radius) && enemy1Projectile.position.y >= (middleOfPlayerY - player.radius)) {
                        enemy1ProjectileList.splice(index, 1)
                        player.HP -= enemy1Projectile.damage
                        //show enemy hp
                        if (player.HP < 1) {
                            loseGame()
                        }
                    } else {
                        enemy1Projectile.update(ctx)
                    }

                })
            })
            // testEnemy.update(ctx)



            //If projectile exists for player, then projectile fires
            projectiles.forEach((projectile, index) => {
                if (projectile.position.x >= 1024) {
                    setTimeout(() => {
                        projectiles.splice(index, 1)
                    }, 0)
                } else {
                    projectile.update(ctx)
                }
            })
        }

        //Handles player movement
        document.addEventListener('keydown', ({ key }) => {
            if (game.over) return
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
                        velocity: 7,
                        levelNum: levelNum
                    }))
                    break;
            }
        })

        // Start Game
        document.getElementById('startButton').addEventListener('click', () => {
            document.getElementById('startScreen').style.display = "none"
            document.getElementById('gameCanvas').style.display = ''
            animate()
        })

        document.getElementById('restart').addEventListener('click', () => {
            
            animate()
            console.log(levelNum)
        })

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

    //Lose Game 
    function loseGame() {
        console.log('you lose')
        for (let i = 0; i < 15; i++) {
            particles.push(new ParticleExplosion({
                position: {
                    x: player.position.x + 64,
                    y: player.position.y + 64
                },
                velocity: {
                    x: (Math.random() - 0.5) * 12,
                    y: (Math.random() - 0.5) * 12
                },
                radius: (Math.random()) * 10,
                color: 'red'
            }))
        }

        setTimeout(() => {
            player.opacity = 0
            game.over = true
        }, 0)

        setTimeout(() => {
            game.active = false
        }, 1000)

    }





    return (
        <div>
            <div style={{
                position: "relative",
            }}>
                <div style={{
                    backgroundColor: "red",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: "none",
                    display: "none",
                }}
                    height="512px"
                    width="1024px"
                ></div>
                <canvas id="gameCanvas"
                    ref={canvasRef}
                    style={{
                        display: 'none'
                    }}
                    height="512px"
                    width="1024px" />
                <h1 id="show-level">Level: {showLevel}</h1>
                <button id="restart">Restart</button>
                <div id="startScreen"
                    style={{
                        position: "absolute",
                        backgroundImage: `url("/Menu/start.png")`,
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: '100%',
                        height: "1286px",
                        aspectRatio: 1,
                    }}>
                    <div id="startButton">
                        <img src="/Menu/startbutton.png" width={80} />
                    </div>
                </div>
            </div>
        </div>
    )
}