/**
 * Inputs from the user.
 * A value of 1 means "just inputted", a value of 2 means "inputted a previous frame", 0 means "not inputted".
 * @type {{forward: number, backward: number, left: number, right: number, shift: number, interact: number, space: number, enter: number}}
 */
export let inputs = {
    forward: 0,
    backward: 0,
    left: 0,
    right: 0,
    shift: 0,
    interact: 0,
    space: 0,
    enter: 0,
    escape: 0
};

let activeCanvas;
let displayScaleRatio = 1;
export let canvasMaxWidth;
export let canvasMaxHeight;
export let mouseDown = 0;

export let mousePos = {
    x: 0,
    y: 0
};

/** Map of text dimensions for performance (don't recalculate dimensions of "0" many times). */
let textDimensionsGroups = [];
let initialized = false;

/**
 * Initialize the game info. Calls some event listeners into action.
 * Should only be called once!
 * @param _activeCanvas
 */
export function init(_activeCanvas) {
    if(initialized) {
        console.log("Error: Game info init called more than once. Ignoring.");
    } else {
        activeCanvas = _activeCanvas;
        canvasMaxWidth = activeCanvas.width;
        canvasMaxHeight = activeCanvas.height;

        resizeActiveCanvas();
        window.addEventListener("resize", resizeActiveCanvas);

        window.addEventListener("keydown", function(event) {
            let key = event.key;
            if(parseInputKey(key, 1)) {
                event.preventDefault();
            }
        });

        window.addEventListener("keyup", function(event) {
            let key = event.key;
            if(parseInputKey(key, 0)) {
                event.preventDefault();
            }
        });

        window.addEventListener("mousedown", function(event) {
            mouseDown = event.buttons;
        });

        window.addEventListener("mouseup", function(event) {
            mouseDown = event.buttons;
        });

        window.addEventListener("contextmenu", function(event) {
            event.preventDefault();
        });

        activeCanvas.addEventListener("mousemove", function(event) {
            mousePos.x = (event.clientX - activeCanvas.offsetLeft) * displayScaleRatio;
            mousePos.y = (event.clientY - activeCanvas.offsetTop) * displayScaleRatio;
        });

        initialized = true;
    }
}

/**
 * Advances the inputs, marking them as 2 if they were previously 1.
 */
export function advanceInput() {
    for(let key in inputs) {
        if(inputs[key] === 1) {
            inputs[key] = 2;
        }
    }
}

/**
 * Change the cursor's visual representation.
 * @param newCursor     New cursor representation.
 */
export function setCursorTo(newCursor) {
    if(window.style.cursor !== newCursor) {
        window.style.cursor = newCursor;
    }
}

/**
 * Get the physical dimensions of the provided text as if it was already displayed on-screen.
 * Used to center-align or right-align text in certain ways.
 * The first time called for a specific text and font, this is expensive. However, we keep track of previous
 * calculations so that they can be quickly called without unnecessary recalculation.
 * @param font      The font to measure the text in.
 * @param text      The text to measure.
 * @returns {{width: number, height: number}|*}
 */
export function getTextDimensions(font, text) {
    let textDimensionsGroup = textDimensionsGroups[text];
    if(textDimensionsGroup == undefined) {
        textDimensionsGroup = new TextDimensionsGroup(text);
        textDimensionsGroups[text] = textDimensionsGroup;
    }
    return textDimensionsGroup.getDimensions(font);
}

/// Dynamically resizes the canvas up to a maximum size based on available window space.
function resizeActiveCanvas() {
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    let xRatio = canvasMaxWidth / screenWidth;
    let yRatio = canvasMaxHeight / screenHeight;

    let canvasWidth;
    let canvasHeight;

    if(xRatio < 1 && yRatio < 1) {
        displayScaleRatio = 1;
        canvasWidth = canvasMaxWidth;
        canvasHeight = canvasMaxHeight;
    } else {
        if(xRatio > yRatio) {
            // x is limited
            displayScaleRatio = xRatio;
            canvasWidth = screenWidth;
            canvasHeight = canvasMaxHeight / xRatio;
        } else {
            // y is limited
            displayScaleRatio = yRatio;
            canvasHeight = screenHeight;
            canvasWidth = canvasMaxWidth / yRatio;
        }
    }
    activeCanvas.style.width = canvasWidth + "px";
    activeCanvas.style.height = canvasHeight + "px";
    activeCanvas.style.left = ((screenWidth - canvasWidth) / 2) + "px";
    activeCanvas.style.top = ((screenHeight - canvasHeight) / 2) + "px";
}

/**
 * Parse key value and match it to the correct inputs object attribute.
 * @param key           Key that was changed
 * @param value         Whether it was active (true) or inactive (false) in change
 * @returns {boolean}   True if the key was found, false if it was an unregistered key.
 */
function parseInputKey(key, value) {
    switch(key) {
        case "w":
        case "W":
            inputs.forward = value;
            break;
        case "a":
        case "A":
            inputs.left = value;
            break;
        case "s":
        case "S":
            inputs.backward = value;
            break;
        case "d":
        case "D":
            inputs.right = value;
            break;
        case "f":
        case "F":
            inputs.interact = value;
            break;
        case " ":
            inputs.space = value;
            break;
        case "Shift":
            inputs.shift = value;
            break;
        case "Enter":
            inputs.enter = value;
            break;
        case "Escape":
            inputs.escape = value;
            break;
        default:
            return false;
    }
    return true;
}

/**
 * Simple TextDimensionsGroup object.
 * Keeps track of a single text measured in different fonts.
 * @param text      Text that is being measured.
 * @constructor
 */
function TextDimensionsGroup(text) {
    this.text = text;
    this.dimensionsByFont = [];
}

/**
 *
 * @param font
 * @returns {{width: number, height: number}}
 */
TextDimensionsGroup.prototype.getDimensions = function(font) {
    let dimension = this.dimensionsByFont[font];
    if(dimension == undefined) {
        let tester = document.getElementById("textWidthTester");
        tester.style.font = font;
        tester.innerText = this.text;
        dimension = {
            width: tester.clientWidth + 1,
            height: tester.clientHeight + 1
        };
        this.dimensionsByFont[font] = dimension;
    }
    return dimension;
};