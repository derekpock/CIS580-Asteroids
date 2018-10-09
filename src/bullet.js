import Sprite from './sprite';
import * as gi from './gameinfo';

export default class Bullet extends Sprite {
    constructor(fillStyle) {
        super(0, 0, 5, 5);
        this.angle = 0;
        this.active = false;
        this.velocity = 0.55;
        this.fillStyle = fillStyle;
    }

    init(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.active = true;
    }

    logic(elapsed) {
        if(this.active) {
            this.x += this.velocity * Math.cos(this.angle) * elapsed;
            this.y += this.velocity * Math.sin(this.angle) * elapsed;

            if(this.x + this.width < 0 ||
                this.x - this.width > gi.canvasMaxWidth ||
                this.y + this.height < 0 ||
                this.y - this.height > gi.canvasMaxHeight) {

                this.active = false;
            }
        }
    }

    draw(ctx) {
        if(this.active) {
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
    }
}