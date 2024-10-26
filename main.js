const joint1 = document.getElementById("joint1");
const joint2 = document.getElementById("joint2");
const joint3 = document.getElementById("joint3");
const joint4 = document.getElementById("joint4");
const joint5 = document.getElementById("joint5");
const joint6 = document.getElementById("joint6");
const joint7 = document.getElementById("joint7");
const joint8 = document.getElementById("joint8");
const joint9 = document.getElementById("joint9");
const joint10 = document.getElementById("joint10");
const joint11 = document.getElementById("joint11");
const joint12 = document.getElementById("joint12");
const ATAT = document.getElementById("at-at");
const example_foot = document.querySelectorAll(".foot")[0];


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

function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

function inverseKinematics(P0, P1, P2, target) {
    const len1 = distance(P0, P1);
    const len2 = distance(P1, P2);

    const x = target.x;
    const y = target.y;
    const rate = x/y;

    const angleP1 = -(180 - radiansToDegrees(Math.acos((len1**2 + len2**2 - (x**2+y**2))/(2*len1*len2))))||0;
    
    const angleP0 = (radiansToDegrees(Math.atan(rate))*(y/Math.abs(y)))-(angleP1/2);

    const angleP2 = -angleP0-(angleP1);

    return {angleP0, angleP1, angleP2}
}

function clamp_f(func) {
    return (func+Math.abs(func))/2
}

const step_height = 0.1;
const crouch_factor = 0.01;
const stride_factor = 0.2;
const speed = 1.5;
const ATAT_height = ATAT.clientHeight;
function loop() {
    let j1p = getPivotOrigin(joint1);
    let j2p = getPivotOrigin(joint2);
    let j3p = getPivotOrigin(joint3);
    let j4p = getPivotOrigin(joint4);
    let j5p = getPivotOrigin(joint5);
    let j6p = getPivotOrigin(joint6);
    let j7p = getPivotOrigin(joint7);
    let j8p = getPivotOrigin(joint8);
    let j9p = getPivotOrigin(joint9);
    let j10p = getPivotOrigin(joint10);
    let j11p = getPivotOrigin(joint11);
    let j12p = getPivotOrigin(joint12);

    let leg_length = distance(j1p, j2p) + distance(j2p, j3p);

    const t = Date.now()*speed/1000; // Seconds
    let f_x = (t) => { return ((leg_length*stride_factor)*Math.sin(t))};
    let f_y = (t) => { return -clamp_f((leg_length*step_height)*Math.cos(t))+leg_length*(1-crouch_factor)};
    let target1 = {x: f_x(t), y: f_y(t)};
    let target2 = {x: f_x(t+Math.PI), y: f_y(t+Math.PI)};

    let height_array = [j1p, j2p, j3p, j4p, j5p, j6p, j7p, j8p, j9p, j10p, j11p, j12p];
    height_array.sort((a,b) => b.y-a.y);
    // console.log(height_array[0],height_array[height_array.length-1]);
    const foot = example_foot.getBoundingClientRect();
    let top = leg_length+(height_array[height_array.length-1].y-height_array[0].y)
    // ATAT.style.marginTop = `${top}px`;
    ATAT.style.marginBottom = `${leg_length+(foot.height)-top}px`;

    const leg1 = inverseKinematics(j1p, j2p, j3p, target1);
    const leg2 = inverseKinematics(j4p, j5p, j6p, target2);
    const leg3 = inverseKinematics(j7p, j8p, j9p, target2);
    const leg4 = inverseKinematics(j10p, j11p, j12p, target1);

    joint1.style.transform = `rotate(${leg1.angleP0}deg)`;
    joint2.style.transform = `rotate(${leg1.angleP1}deg)`;
    joint3.style.transform = `rotate(${leg1.angleP2}deg)`;
    joint4.style.transform = `rotate(${leg2.angleP0}deg)`;
    joint5.style.transform = `rotate(${leg2.angleP1}deg)`;
    joint6.style.transform = `rotate(${leg2.angleP2}deg)`;
    joint7.style.transform = `rotate(${leg3.angleP0}deg)`;
    joint8.style.transform = `rotate(${leg3.angleP1}deg)`;
    joint9.style.transform = `rotate(${leg3.angleP2}deg)`;
    joint10.style.transform = `rotate(${leg4.angleP0}deg)`;
    joint11.style.transform = `rotate(${leg4.angleP1}deg)`;
    joint12.style.transform = `rotate(${leg4.angleP2}deg)`;
    
    requestAnimationFrame(loop);
}
loop();