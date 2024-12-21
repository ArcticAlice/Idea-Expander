const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const left = document.querySelector(".leftArrow");
const right = document.querySelector(".rightArrow");
const carousel = document.querySelector(".carousel");
const firstCard = carousel.querySelector(".card");
const firstCardWidth = firstCard.offsetWidth + 52; // Include the gap between cards

left.addEventListener("click", () => {
    carousel.scrollLeft -= firstCardWidth; // Scroll to the left by one card width
});

right.addEventListener("click", () => {
    carousel.scrollLeft += firstCardWidth; // Scroll to the right by one card width
});

class StarClass {
    constructor() {
        this.cx = Math.round(Math.random() * innerWidth);
        this.cy = Math.round(Math.random() * innerHeight);
        this.size = Math.random() * 5 + 5; 
        this.color = 'black'; 
        this.speedX = Math.random() * 4 - 2; // Random horizontal speed
        this.speedY = Math.random() * 4 - 2; // Random vertical speed
    }

    drawStar() {
        const innerRadius = this.size / 2.0;
        const rot = Math.PI / 2 * 3;
        let x = this.cx;
        let y = this.cy;
        const step = Math.PI / 5;

        c.beginPath();
        c.moveTo(this.cx, this.cy - this.size);

        for (let i = 0; i < 5; i++) {
            x = this.cx + Math.cos(rot + (step * i * 2)) * this.size;
            y = this.cy + Math.sin(rot + (step * i * 2)) * this.size;
            c.lineTo(x, y);

            x = this.cx + Math.cos(rot + (step * (i * 2 + 1))) * innerRadius;
            y = this.cy + Math.sin(rot + (step * (i * 2 + 1))) * innerRadius;
            c.lineTo(x, y);
        }

        c.closePath();
        c.fillStyle = this.color;
        c.fill();
    }

    animateStar() {
        // Reverse direction if the star hits the canvas boundary
        if (this.cx + this.size > innerWidth || this.cx - this.size < 0) {
            this.speedX *= -1;
        }
        if (this.cy + this.size > innerHeight || this.cy - this.size < 0) {
            this.speedY *= -1;
        }

        this.cx += this.speedX;
        this.cy += this.speedY;

        this.drawStar();
    }
}

var starArrays = [];

for (var i = 0; i < 100; i++) {
    starArrays.push(new StarClass());
}

const star = new StarClass();

function animate() {
    requestAnimationFrame(animate);

    // Clear the canvas
    c.clearRect(0, 0, innerWidth, innerHeight);

    for (var i = 0; i < starArrays.length; i++) {
        starArrays[i].animateStar();
    }
}

animate();