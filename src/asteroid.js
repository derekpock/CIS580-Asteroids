import Sprite from './sprite';
import * as gi from './gameinfo';

const splitMassLoss = 25;
export const minimumMass = 60;

export default class Asteroid extends Sprite {
    constructor(x, y, mass, velocity, angle) {
        let radius = Math.sqrt(mass);
        super(x, y, radius, radius);
        this.radius = radius;
        this.mass = mass;
        this.velocity = velocity;
        this.angle = angle;
    }

    logic(elapsed) {
        // Player locomotion
        this.x += this.velocity * Math.cos(this.angle) * elapsed;
        this.y += this.velocity * Math.sin(this.angle) * elapsed;

        if(this.x + this.radius < 0) {
            this.x = gi.canvasMaxWidth + this.radius;
        } else if (this.x - this.radius > gi.canvasMaxWidth) {
            this.x = -this.radius;
        }

        if(this.y + this.radius < 0) {
            this.y = gi.canvasMaxHeight + this.radius;
        } else if (this.y - this.radius > gi.canvasMaxHeight) {
            this.y = -this.radius;
        }
    }

    draw(ctx) {
        ctx.fillStyle = "gray";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fill();
    }

    separate() {
        if(this.mass < (minimumMass * 2 + splitMassLoss)) {
            return null;
        } else {
            let splitMass = (this.mass - splitMassLoss) / 2;
            let newVel = this.velocity * 1.414213562; // v = V / cos(45deg)
            let separationRadius = this.radius * 2;
            //let separationRadius = Math.sqrt((pi*mm - c) / 2pi)) + 1
            let newAngle1 = this.angle + Math.PI / 2;
            let newAngle2 = this.angle - Math.PI / 2;

            // Create new asteroid to the right
            let newAsteroid = new Asteroid(
                this.x + (separationRadius * Math.cos(newAngle1)),
                this.y + (separationRadius * Math.sin(newAngle1)),
                splitMass,
                newVel,
                newAngle1
            );

            // Modify this to be the new asteroid to the left.
            this.x += (separationRadius * Math.cos(newAngle2));
            this.y += (separationRadius * Math.sin(newAngle2));
            this.mass = splitMass;
            this.radius = Math.sqrt(this.mass);
            this.width = this.radius;
            this.height = this.radius;
            this.velocity = newVel;
            this.angle = newAngle2;

            return newAsteroid;
        }
    }
}