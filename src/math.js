
export function isPointInCircle(pointObj, circleObj) {
    let dX = pointObj.x - circleObj.x;
    let dY = pointObj.y - circleObj.y;
    return (dX * dX + dY * dY) <= (circleObj.radius * circleObj.radius);
}

/// Get the polar distance and angle between two points.
/// Distance is [0] returned item.
/// Angle is [1] returned item.
export function polarDistanceAndAngle(x1, y1, x2, y2) {
    let dX = x2 - x1;
    let dY = y2 - y1;

    let distance = Math.sqrt(dX * dX + dY * dY);
    let angle = Math.atan2(dY, dX);
    return [distance, angle];
}

export function polarToRect(r, angle) {
    return [
        r * Math.cos(angle),
        r * Math.sin(angle)
    ];
}

export function getPotentialCollisionsForCircles(listA, listB) {
    let collisions = [];
    listA.forEach(function(a) {
       listB.forEach(function(b) {
          if(a !== b) {
              let dx = b.x - a.x;
              let dy = b.y - a.y;
              let dr = b.radius + a.radius;
              if(dx*dx + dy*dy < dr*dr) {
                  collisions.push({first: a, second: b});
              }
          }
       });
    });
    return collisions;
}

export function elasticCollision(a, b) {
    // E = aE1 + bE1
    // xp2 = axp1 + bxp1
    // yp2 = ayp1 + byp1
    // vai + vaf = vbi + vbf
    // vbf = vai + vaf - vbi
    // ma vai + mb vbi = ma vaf + mb (vai + vaf - vbi)
    // ma vai + mb vbi = ma vaf + mb vai + mb vaf - mb vbi
    // ma vai + 2 mb vbi = ma vaf + mb vai + mb vaf
    // ma vai + 2mb vbi - mb vai = ma vaf + mb vaf
    // (ma vai + 2mb vbi - mb vai) / (ma + mb) = vaf

    let angle = Math.atan2(b.y - a.y, b.x - a.x);
    a.angle -= angle;
    b.angle -= angle;
    let ay = a.velocity * Math.sin(a.angle);
    let by = b.velocity * Math.sin(b.angle)
    let ai = a.velocity * Math.cos(a.angle);
    let bi = b.velocity * Math.cos(b.angle);
    let af = (a.mass * ai + 2 * b.mass * bi - b.mass * ai) / (a.mass + b.mass);
    let bf = ai + af - bi;

    a.angle = Math.atan2(ay, af);
    b.angle = Math.atan2(by, bf);
    a.velocity = Math.sqrt(af*af + ay*ay);
    b.velocity = Math.sqrt(bf*bf + by*by);
}