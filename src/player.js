import Sprite from './sprite';
import * as gi from './gameinfo';
import Bullet from './bullet';
import * as math from './math';

const maxBullets = 300;
const fireRate = 150;

export default class Player extends Sprite {
    constructor(x, y, width, height, asteroids) {
        super(x, y, width, height);
        this.velocity = 0.5;
        this.bullets = [];
        for(let i = 0; i < maxBullets; i++) {
            this.bullets.push(new Bullet("yellow"));
        }
        this.nextBullet = 0;
        this.fireDelay = 0;
        this.asteroids = asteroids;
        this.lives = 3;
        this.score = 0;
        this.laserShootSound = new Audio("sounds/LaserShoot.wav");
        this.playerCrashSound = new Audio("sounds/PlayerCrash.wav");
    };

    logic(elapsed) {
        // Bullet logic
        for(let j = 0; j < this.bullets.length; j++) {
            let bullet = this.bullets[j];
            if(bullet.active) {
                bullet.logic(elapsed);
                // Detect collisions between bullets and asteroids
                for(let i = 0; i < this.asteroids.length; i++) {
                    if (math.isPointInCircle(bullet, this.asteroids[i])) {
                        let newAsteroid = this.asteroids[i].separate();
                        if(newAsteroid != null) {
                            this.asteroids.push(newAsteroid);
                        } else {
                            this.asteroids.splice(i, 1);
                        }
                        bullet.active = false;
                        this.score++;
                        break;
                    }
                }
            }
        }

        for(let i = 0; i < this.asteroids.length; i++) {
            if (math.isPointInCircle(this, this.asteroids[i])) {
                this.lives--;
                this.asteroids.splice(i, 1);
                this.playerCrashSound.play();
                break;
            }
        }

        // Player locomotion
        if(gi.inputs.forward) {
            this.y -= this.velocity * elapsed;
        }
        if(gi.inputs.backward) {
            this.y += this.velocity * elapsed;
        }
        if(gi.inputs.left) {
            this.x -= this.velocity * elapsed;
        }
        if(gi.inputs.right) {
            this.x += this.velocity * elapsed;
        }

        if(this.x + this.width < 0) {
            this.x = gi.canvasMaxWidth + this.width;
        } else if (this.x - this.width > gi.canvasMaxWidth) {
            this.x = -this.width;
        }

        if(this.y + this.height < 0) {
            this.y = gi.canvasMaxHeight + this.height;
        } else if (this.y - this.height > gi.canvasMaxHeight) {
            this.y = -this.height;
        }

        this.fireDelay -= elapsed;
        if(gi.mouseDown & 1 && this.fireDelay <= 0) {
            // Fire bullet
            let i = 0;
            while(i < maxBullets && this.bullets[this.nextBullet].active) {
                i++;
                this.nextBullet++;
                if(this.nextBullet >= maxBullets) {
                    this.nextBullet = 0;
                }
            }
            if(i !== maxBullets) {
                let angle = Math.atan2(gi.mousePos.y - this.y, gi.mousePos.x - this.x);
                this.bullets[this.nextBullet].init(this.x, this.y, angle);
                this.fireDelay = fireRate;
                this.laserShootSound.cloneNode(true).play();
            }
        }

    }

    draw(ctx) {
        this.bullets.forEach(function (bullet) {
            if(bullet.active) {
                bullet.draw(ctx);
            }
        });
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
}