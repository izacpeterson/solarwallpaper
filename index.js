const { createCanvas } = require("canvas");

const width = 1920 * 2;
const height = 1080 * 2;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

let today = new Date();
let epoch = new Date("01/01/2000");
let dateDiff = today - epoch;
let dayDIff = dateDiff / (1000 * 3600 * 24);
console.log(dayDIff);

class Planet {
  constructor(name, oP, mL, sMA, fromEpoch, color, radius) {
    this.name = name;
    this.oP = oP;
    this.mL = mL;
    this.sMA = Math.log(sMA + 1) * 2.5;
    this.distMult = 100;
    // this.fromEpoch = 0;
    this.fromEpoch = fromEpoch;
    this.color = color || "#FFFFFF";
    this.radius = Math.log(radius * 5 + 1) * 10;
  }
  getCurrentPosition() {
    let r = this.oP / this.fromEpoch;
    let s = Math.floor(r) * -1;
    let f = s - r;

    f = f * 360;

    let speed = 360 / this.oP;
    let time = speed * this.fromEpoch;

    return ((this.mL + time) * Math.PI) / 180;
  }
  getX() {
    return this.distMult * this.sMA * Math.sin(this.getCurrentPosition());
  }
  getY() {
    return this.distMult * this.sMA * Math.cos(this.getCurrentPosition());
  }
  getAngle() {}
  draw() {
    let currentX = this.getX();
    let currentY = this.getY();

    let currentAngle = Math.atan2(currentY, currentX);

    if (currentAngle < 0) {
      currentAngle += 2 * Math.PI;
    }

    let segment = 0.01;
    for (let i = 0.5; i >= 0; i -= segment) {
      let trailLength = 0.1;

      ctx.beginPath();
      ctx.arc(
        0,
        0,
        this.distMult * this.sMA,
        currentAngle,
        currentAngle + trailLength
      );
      ctx.strokeStyle = `rgba(255,255,255,${i})`; // Set the trail color same as the planet
      ctx.stroke();

      currentAngle += segment;
    }

    ctx.beginPath();
    ctx.arc(0, 0, this.distMult * this.sMA, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.stroke();

    // Draw the planet
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(currentX, currentY, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// let system = {
//   planets: [
//     // Planet(360, 0, 200),
//     new Planet("Mercury", 87.91, 252.25, 1, dayDIff, "#808080", 0.383),
//     new Planet("Venus", 224.7, 181.98, 2, dayDIff, "#ffeb80", 0.949),
//     new Planet("Earth", 365.26, 100.46, 3, dayDIff, "#4682B4", 1),
//     new Planet("Mars", 686.98, 355, 4, dayDIff, "#ff6a33", 0.532),
//     new Planet("Jupiter", 4332.59, 34.4, 5, dayDIff, "#ffb733", 11.209),
//     new Planet("Saturn", 10759, 49.94, 6, dayDIff, "#F5DEB3", 9.449),
//     new Planet("Uranus", 30685, 313.23, 7, dayDIff, "#00FFFF", 4.007),
//     new Planet("Neptune", 60189, 304.88, 8, dayDIff, "#3333a2", 3.883),
//   ],
// };
let system = {
  planets: [
    // Planet(360, 0, 200),
    new Planet("Mercury", 87.91, 252.25, 0.39, dayDIff, "#808080", 0.383),
    new Planet("Venus", 224.7, 181.98, 0.72, dayDIff, "#ffeb80", 0.949),
    new Planet("Earth", 365.26, 100.46, 1, dayDIff, "#4682B4", 1),
    new Planet("Mars", 686.98, 355, 1.52, dayDIff, "#ff6a33", 0.532),
    new Planet("Jupiter", 4332.59, 34.4, 5.2, dayDIff, "#ffb733", 11.209),
    new Planet("Saturn", 10759, 49.94, 8.58, dayDIff, "#F5DEB3", 9.449),
    new Planet("Uranus", 30685, 313.23, 19.22, dayDIff, "#00FFFF", 4.007),
    new Planet("Neptune", 60189, 304.88, 30.05, dayDIff, "#3333a2", 3.883),
  ],
};

ctx.translate(width / 2, height / 2);

ctx.fillStyle = "#111";
ctx.fillRect(-width / 2, -height / 2, width, height);

ctx.fillStyle = "#FFD700";
ctx.beginPath();
ctx.ellipse(0, 0, 20, 20, 0, 0, 2 * Math.PI);
ctx.fill();

for (let planet of system.planets) {
  planet.draw();
}

let nowString = today.toLocaleString(undefined, {
  hour12: true,
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
ctx.fillStyle = "#FFFFFF";
ctx.font = "50px Arial";
// text top right
ctx.fillText(nowString, 0 - width / 2 + 50, height / 2 - 50);

// draw stars
ctx.fillStyle = "#555555";
for (let i = 0; i < 1000; i++) {
  let x = Math.random() * width - width / 2;
  let y = Math.random() * height - height / 2;
  ctx.beginPath();
  ctx.arc(x, y, 1, 0, 2 * Math.PI);
  ctx.fill();
}

const fs = require("fs");
const out = fs.createWriteStream(__dirname + "/test.png");
const stream = canvas.createPNGStream();
stream.pipe(out);
out.on("finish", () => console.log("The PNG file was created."));
