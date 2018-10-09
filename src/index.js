import Player from './player';
import * as gi from './gameinfo';
import Asteroid, {minimumMass} from "./asteroid";
import * as math from './math';

let activeCanvas = document.getElementById("canvas");
let backCanvas = document.createElement("canvas");
let backCtx = backCanvas.getContext("2d");

let lastFrameTime;
let initialized = false;
let pause;

let player;
let asteroids = [];
let level;
let asteroidEmitted = false;
let asteroidCollideSound = new Audio("sounds/AsteroidCollide.wav");

gi.init(activeCanvas);
requestAnimationFrame(init);

/// Initialize the game, can be used to reset the game for a second run.
function init(currentTime) {
    if(!initialized) {
        // First time initialization
        backCanvas.width = gi.canvasMaxWidth;
        backCanvas.height = gi.canvasMaxHeight;
        pause = true;
    }

    // Every time initialization
    if(currentTime !== undefined && currentTime !== null) {
        lastFrameTime = currentTime;
    }
    asteroids = [];
    player = new Player(gi.canvasMaxWidth / 2, gi.canvasMaxHeight / 2, 10, 10, asteroids);
    level = 0;

    if(!initialized) {
        initialized = true;
        requestAnimationFrame(frameLoop);
    }
}

/// Logic of the enemies, player, and bullet movements and collision detection.
function logic(elapsed) {
    if(gi.inputs.escape === 1) {
        pause = !pause;
    }
    if(pause) {

    } else {
        if(player.lives > 0) {
            if(gi.inputs.interact === 1) {
                player.x = Math.random() * gi.canvasMaxWidth;
                player.y = Math.random() * gi.canvasMaxHeight;
            }
            player.logic(elapsed);
        } else {
            if(gi.inputs.enter === 1) {
                init(null);
            }
        }
        if(asteroids.length === 0) {
            level++;
            for(let i = 0; i < (level * 2); i++) {
                let side = Math.random() * 2;
                let x = 0;
                let y = 0;
                if(side === 0) {
                    x = Math.random() * gi.canvasMaxWidth;
                    y = Math.random() * 999999999;
                } else {
                    x = Math.random() * 999999999;
                    y = Math.random() * gi.canvasMaxHeight;
                }

                asteroids.push(
                    new Asteroid(
                        x,
                        y,
                        (Math.random() * 250 * level) + minimumMass,
                        (Math.random() * 0.1) + 0.1,
                        (Math.random() * 2 * Math.PI)));
            }
        }
        asteroids.forEach(function(asteroid) {
            asteroid.logic(elapsed);
        });
        let asteroidCollisions = math.getPotentialCollisionsForCircles(asteroids, asteroids);
        asteroidCollisions.forEach(function(collision) {
            math.elasticCollision(collision.first, collision.second);
            asteroidCollideSound.play();
        });
    }
    if(gi.mouseDown & 2 && !asteroidEmitted) {
        asteroids.push(
            new Asteroid(
                gi.mousePos.x,
                gi.mousePos.y,
                (Math.random() * 1000) + 10,
                (Math.random() * 0.1) + 0.1,
                (Math.random() * 2 * Math.PI)));
        asteroidEmitted = true;
    } else if( ~gi.mouseDown & 2 ) {
        asteroidEmitted = false;
    }
}

/// Draw everything on the back-canvas.
function draw(ctx) {
    ctx.fillStyle = "#222222";
    ctx.fillRect(0, 0, gi.canvasMaxWidth, gi.canvasMaxHeight);

    if(player.lives > 0) {
        drawTextLeftBottom(ctx, "40pt Monospace", "white", "Score: " + player.score, 5, -10);
        drawTextLeftBottom(ctx, "40pt Monospace", "white", "Lives: " + player.lives, 5, -55);
        drawTextLeftBottom(ctx, "40pt Monospace", "white", "Level: " + level, 5, -100);
        player.draw(ctx);
    } else {
        drawTextCentered(ctx, "60pt Arial", "white", "Game Over", 0, 0);
        drawTextCentered(ctx, "40pt Arial", "white", "Press Enter to Restart", 0, 40);
    }
    asteroids.forEach(function(asteroid) {
        asteroid.draw(ctx);
    });

    if(pause) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, gi.canvasMaxWidth, gi.canvasMaxHeight);
        let startinText = (level === 0 ? "Begin" : "Resume");
        drawTextCentered(ctx, "60px Arial", "white", "Press Escape to " + startinText, 0, -100);
        drawTextCentered(ctx, "40px Arial", "white", "WASD To Move", 0, 100);
        drawTextCentered(ctx, "40px Arial", "white", "Mouse Move/Click to Fire", 0, 140);
        drawTextCentered(ctx, "40px Arial", "white", "Warp Ship with F", 0, 180);
    }
}

function drawTextLeftBottom(ctx, font, color, text, xOffset, yOffset) {
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, xOffset, gi.canvasMaxHeight + yOffset);
}

function drawTextLeft(ctx, font, color, text, xOffset, yOffset) {
    let offset = gi.getTextDimensions(font, text);
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, xOffset, (gi.canvasMaxHeight - offset.height) / 2 + yOffset);
}

function drawTextCentered(ctx, font, color, text, xOffset, yOffset) {
    let offset = gi.getTextDimensions(font, text);
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.fillText(text, (gi.canvasMaxWidth - offset.width) / 2 + xOffset, (gi.canvasMaxHeight - offset.height) / 2 + yOffset);
}

/// The animation frame calls this function. We do the logic and advance inputs, then draw to the back buffer, then draw to the main canvas.
function frameLoop(currentTime) {
    let elapsed = currentTime - lastFrameTime;
    lastFrameTime = currentTime;
    requestAnimationFrame(frameLoop);
    logic(elapsed);
    gi.advanceInput();
    draw(backCtx);
    activeCanvas.getContext("2d").drawImage(backCanvas, 0, 0);
}

