const joint1 = document.getElementById("joint1");
const joint2 = document.getElementById("joint2");
const joint3 = document.getElementById("joint3");

const point = document.getElementById("target");

function getPivotOrigin(elem) {
    const rect = elem.getBoundingClientRect();
    return {
        x: rect.x+rect.width/2,
        y: rect.y+rect.height/2
    }
}

function distance(elem1, elem2) {
    const a = (elem2.x - elem1.x);
    const b = (elem2.y - elem1.y);
    return Math.sqrt(a**2+b**2);
}

function calculateAngle(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);  // In radians
}

function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

function applyConstraint(P0, P1, P2, maxLength) {
    const d = distance(P0, P1);  // Current distance
    if (d > maxLength) {
        // Clamp P1 to be within the maximum length from P0
        const angle = Math.atan2(P1.y - P0.y, P1.x - P0.x);
        P1.x = P0.x + Math.cos(angle) * maxLength;
        P1.y = P0.y + Math.sin(angle) * maxLength;
    }
    return P1;
}

let target = {x: 0, y: 0};
// FABRIK (Forward And Backward Reaching Inverse Kinematics) algorithm
function inverseKinematics(P0, P1, P2, len1, len2) {
    // Setup
    const constraintLength = 100;

    // forward reaching
    P2.x = target.x;
    P2.y = target.y;

    // move P1 towards P2
    let d = distance(P2, P1);
    let ratio = len2 / d;
    P1.x = P2.x + (P1.x - P2.x) * ratio;
    P1.y = P2.y + (P1.y - P2.y) * ratio;

    // move P0 towards P1
    d = distance(P0, P1);
    ratio = len1 / d;
    P0.x = P1.x + (P0.x - P1.x) * ratio;
    P0.y = P1.y + (P0.y - P1.y) * ratio;

    // backward reaching
    // move P1 towards P0 again
    d = distance(P1, P0);
    ratio = len1 / d;
    P1.x = P0.x + (P1.x - P0.x) * ratio;
    P1.x = P0.x + (P1.x - P0.x) * ratio;

    // apply constraints to P1
    P1 = applyConstraint(P0, P1, P2, constraintLength);

    // update P2 again to maintain len2
    d = distance(P1, P2);
    ratio = len2 / d;
    P2.x = P1.x + (P2.x - P1.x) * ratio;
    P2.x = P1.x + (P2.x - P1.x) * ratio;

    const angleP0 = radiansToDegrees(calculateAngle(P0, P1));  // Angle from P0 to P1
    const angleP1 = radiansToDegrees(calculateAngle(P1, P2));  // Angle from P1 to P2

    return {angleP0, angleP1}
}

document.addEventListener("mousemove", event => {
    let cursor = {x: event.clientX, y: event.clientY};
    point.style.left = `${cursor.x}px`;
    point.style.top = `${cursor.y}px`;

    let j1p = getPivotOrigin(joint1);
    let j2p = getPivotOrigin(joint2);
    let j3p = getPivotOrigin(joint3);
    const len1 = distance(j1p, j2p);
    const len2 = distance(j2p, j3p);

    target = cursor;
    const leg1 = inverseKinematics(j1p, j2p, j3p, len1, len2);
    
    console.log(leg1);
    joint1.style.transform = `rotate(${leg1.angleP0}deg)`;
    joint2.style.transform = `rotate(${leg1.angleP1}deg)`;
    
})