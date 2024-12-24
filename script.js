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

mouse = {
    x: 0, y: 0
};

window.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect(); // To account for canvas offset
    mouse.x = event.x - rect.left;
    mouse.y = event.y - rect.top;
});

class StarClass {
    constructor() {
        this.size = Math.random() * 17 + 9; 
        this.cx = Math.round(Math.random() * (canvas.width - this.size * 2)) + this.size;
        this.cy = Math.round(Math.random() * (canvas.height - this.size * 2)) + this.size;
        this.radians = Math.round(Math.random() * 90);
        this.color = 'black'; 
        this.speedX = Math.random() * 4 - 2; // Random horizontal speed
        this.speedY = Math.random() * 4 - 2; // Random vertical speed
        this.nearMouse = false; 
        this.copyOne = this.speedX;
        this.copyTwo = this.speedY;
    }

    drawStar() {
        const radius = this.size / 2.0; // Outer radius
        const innerRadius = radius / 2.5; // Inner radius (adjust as needed)
        const angleOffset = this.radians || 0; // Initial rotation angle
    
        const coordinates = [];
        for (let i = 0; i < 10; i++) {
            // Alternate between outer and inner radius
            const r = i % 2 === 0 ? radius : innerRadius;
            const angle = angleOffset + (i * Math.PI / 5); // 360°/10 = 36°, in radians
            coordinates.push({
                x: this.cx + r * Math.cos(angle),
                y: this.cy + r * Math.sin(angle),
            });
        }
    
        c.beginPath();
        c.moveTo(coordinates[0].x, coordinates[0].y);
        for (let i = 1; i < coordinates.length; i++) {
            c.lineTo(coordinates[i].x, coordinates[i].y);
        }
        c.closePath();
    
        c.fillStyle = this.color;
        c.fill();
    }
    
    animateStar() {
        // Calculate distance between the mouse and the star
        const dx = mouse.x - this.cx;
        const dy = mouse.y - this.cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        const interactionRadius = 75; // Radius for mouse interaction
        const maxSpeed = 4; // Maximum speed for the star
        const lerpFactor = 0.1; // Smooth transition factor
    
        if (distance < interactionRadius) {
            this.nearMouse = true;
    
            const force = 0.5; // Strength of the repelling force
            const angle = Math.atan2(dy, dx);
    
            // Apply force in the opposite direction of the mouse
            this.speedX -= force * Math.cos(angle);
            this.speedY -= force * Math.sin(angle);
    
            // Slightly rotate the star when affected
            this.radians += Math.PI / 32;
    
            // Clamp speed to the maximum value
            this.speedX = Math.min(Math.max(this.speedX, -maxSpeed), maxSpeed);
            this.speedY = Math.min(Math.max(this.speedY, -maxSpeed), maxSpeed);
        } else if (this.nearMouse) {
            // Smoothly restore to original speed
            this.speedX += (this.copyOne - this.speedX) * lerpFactor;
            this.speedY += (this.copyTwo - this.speedY) * lerpFactor;
    
            // Stop the "near mouse" state when speeds are close to original
            if (Math.abs(this.speedX - this.copyOne) < 0.1 && Math.abs(this.speedY - this.copyTwo) < 0.1) {
                this.speedX = this.copyOne;
                this.speedY = this.copyTwo;
                this.nearMouse = false;
            }
        }
    
        // Reverse direction if the star hits the canvas boundary
        if (this.cx + this.size > canvas.width || this.cx - this.size < 0) {
            this.speedX *= -1;
            this.radians += Math.PI / 16; // Slightly change the rotation
        }
        if (this.cy + this.size > canvas.height || this.cy - this.size < 0) {
            this.speedY *= -1;
            this.radians += Math.PI / 16; // Slightly change the rotation
        }
    
        // Update the position
        this.cx += this.speedX;
        this.cy += this.speedY;
    
        // Redraw the star with updated rotation
        this.drawStar();
    }
    
    
}



var starArrays = [];

for (var i = 0; i < 125; i++) {
    starArrays.push(new StarClass());
}

const star = new StarClass();

function animate() {
    requestAnimationFrame(animate);

    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < starArrays.length; i++) {
        starArrays[i].animateStar();
    }
}

animate();