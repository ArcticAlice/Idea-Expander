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

// Function to create stars
function drawStar(cx, cy, size, color) {
    let currentColor = color;
    const innerRadius = size / 2.0;
    const rot = Math.PI / 2 * 3;  // Rotation offset to start drawing at the top
    let x = cx;
    let y = cy;
    let step = Math.PI / 5;

    c.beginPath();  // Start drawing

    c.moveTo(cx, cy - size);  // Start at the top of the star

    for (let i = 0; i < 5; i++) {
        // Outer vertex of the star
        x = cx + Math.cos(rot + (step * i * 2)) * size;
        y = cy + Math.sin(rot + (step * i * 2)) * size;
        c.lineTo(x, y);

        // Inner vertex of the star
        x = cx + Math.cos(rot + (step * (i * 2 + 1))) * innerRadius;
        y = cy + Math.sin(rot + (step * (i * 2 + 1))) * innerRadius;
        c.lineTo(x, y);
    }

    c.lineTo(cx, cy - size);  // Complete the star by connecting back to the first point
    c.closePath();
    c.fillStyle = currentColor;
    c.fill();  // Fill the star
}

for (i = 0; i < 75; i++) {
    const randStarSize = Math.round(Math.random() * 4) + 2;
    const randStarCx = Math.round(Math.random() * 1440);
    const randStarCy = Math.round(Math.random() * 1000);
    // C8B6FF F5FEFD - white
    drawStar(randStarCx, randStarCy, randStarSize, "black");
}