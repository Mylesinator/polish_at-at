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

function inverseKinematics(P0, P1, P2, target) {
    const len1 = Math.floor(distance(P0, P1));
    const len2 = Math.floor(distance(P1, P2));

    const x = target.x-P0.x;
    const y = P0.y-target.y;

    console.log(distance(P0, target), x, y);

    const angleP0 = -90 + radiansToDegrees(
        Math.acos((len1**2+x**2+y**2-len2**2)/(2*len1*Math.sqrt(x**2+y**2)))
    );
    const angleP1 = 180 - radiansToDegrees(
        Math.acos(((len1**2 + len2**2)-(x**2+y**2))/(2*len1*len2))
    );

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

    const leg1 = inverseKinematics(j1p, j2p, j3p, cursor);
    
    console.log(leg1);
    joint1.style.transform = `rotate(${leg1.angleP0}deg)`;
    joint2.style.transform = `rotate(${leg1.angleP1}deg)`;
    
})