const colorPickerMain = document.querySelector('.color-picker-main');
const colorOptions = document.querySelectorAll('.color-option');

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

let selectedColor = 'rgba(128, 128, 128, 0.5)';  // Default color
let isExpanded = false;  // Tracks whether the color options are visible

const popUp = document.getElementById('popUpBt');
const saveButton = document.getElementById('saveButton');
const ideaText = document.getElementById('ideaText');
const finishButton = document.getElementById('finishButton');

let currentStarIndex = null;
let ideaArray = {};



// Function to expand/collapse color options
colorPickerMain.addEventListener('click', () => {
    isExpanded = !isExpanded;
    colorOptions.forEach((option) => {
        if (isExpanded) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
});

// Function to handle color selection
colorOptions.forEach((option) => {
    option.addEventListener('click', (e) => {
        selectedColor = e.target.style.backgroundColor;  // Set selected color
        colorPickerMain.style.backgroundColor = selectedColor;  // Change main button color
        isExpanded = false;  // Collapse color options after selection
        colorOptions.forEach(opt => opt.classList.remove('active'));  // Hide options
    });
});


function drawStar(cx, cy, spikes, outerRadius) {
    const innerRadius = outerRadius / 2.0;
    const rot = Math.PI / 2 * 3;  // Rotation offset to start drawing at the top
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    c.beginPath();  // Start drawing

    c.moveTo(cx, cy - outerRadius);  // Start at the top of the star

    for (let i = 0; i < spikes; i++) {
        // Outer vertex of the star
        x = cx + Math.cos(rot + (step * i * 2)) * outerRadius;
        y = cy + Math.sin(rot + (step * i * 2)) * outerRadius;
        c.lineTo(x, y);

        // Inner vertex of the star
        x = cx + Math.cos(rot + (step * (i * 2 + 1))) * innerRadius;
        y = cy + Math.sin(rot + (step * (i * 2 + 1))) * innerRadius;
        c.lineTo(x, y);
    }

    c.lineTo(cx, cy - outerRadius);  // Complete the star by connecting back to the first point
    c.closePath();
    c.fillStyle = selectedColor;
    c.fill();  // Fill the star
}

// Define all the star coordinates and sizes
const starData = [
    { cx: 415, cy: 35, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 370, cy: 100, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 395, cy: 165, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 300, cy: 360, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 215, cy: 490, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 115, cy: 620, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 230, cy: 568, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 300, cy: 560, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 445, cy: 525, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 517, cy: 535, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 790, cy: 543, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 893, cy: 570, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 960, cy: 550, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 1025, cy: 610, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 970, cy: 660, spikes: 5, outerRadius: 10, colored: false, whatColor: null },
    { cx: 892, cy: 657, spikes: 5, outerRadius: 10, colored: false, whatColor: null }
];

// Draw the initial stars in gray
for (let i = 0; i < starData.length; i++) {
    const currentStar = starData[i];
    drawStar(currentStar.cx, currentStar.cy, currentStar.spikes, currentStar.outerRadius, 'gray');
}

// Handle canvas click event
canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // Adjust X to canvas space
    const y = event.clientY - rect.top;  // Adjust Y to canvas space

    for (let i = 0; i < starData.length; i++) {
        const currentStar = starData[i];
        const distance = Math.sqrt((x - currentStar.cx) ** 2 + (y - currentStar.cy) ** 2);

        // Check if the click was within the radius of the star
        if (distance <= currentStar.outerRadius) {
            if (i === 0 || starData[i - 1].colored === true) {
                // Clear the old star before drawing the new one
                c.clearRect(currentStar.cx - currentStar.outerRadius, currentStar.cy - currentStar.outerRadius, 
                            currentStar.outerRadius * 2, currentStar.outerRadius * 2);

                // Set the star to colored and update its color
                starData[i].colored = true;
                starData[i].whatColor = selectedColor
                drawStar(currentStar.cx, currentStar.cy, currentStar.spikes, currentStar.outerRadius, selectedColor);


                popUp.classList.add('show');
                currentStarIndex = i;

                break;  // Stop checking after a valid star is clicked
            }
        }
    }
});

saveButton.addEventListener('click', () => {
    ideaArray[currentStarIndex] = ideaText.value;
    ideaText.value = '';
    console.log(ideaArray);
    popUp.classList.remove('show');  // Hide the pop-up after saving
});

function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Function to interpolate colors
function interpolateColor(color1, color2, t) {
    const c1 = color1.replace('rgb(', '').replace(')', '').split(',');
    const c2 = color2.replace('rgb(', '').replace(')', '').split(',');
    const r = Math.round(lerp(c1[0], c2[0], t));
    const g = Math.round(lerp(c1[1], c2[1], t));
    const b = Math.round(lerp(c1[2], c2[2], t));
    return `rgb(${r},${g},${b})`;
}


function animateLines() {
    let starIndex = 0;  // Start from the first star
    let progress = 0;   // Progress of the animation (0 to 1)
    const speed = 0.06; // Animation speed (adjust this value as needed)

    function drawLineStep() {
        // Define the two stars we're connecting
        const star1 = starData[starIndex];
        const star2 = starData[starIndex + 1];

        // Interpolate between the two stars based on progress
        const x = lerp(star1.cx, star2.cx, progress);
        const y = lerp(star1.cy, star2.cy, progress);

        // Redraw all the stars first to ensure they remain on the canvas
        starData.forEach(star => {
            drawStar(star.cx, star.cy, star.spikes, star.outerRadius, star.whatColor || 'rgba(255, 255, 255, 0.5)');
        });

        // Draw the line from the first star to the current point in the animation
        c.beginPath();
        c.moveTo(star1.cx, star1.cy);
        c.lineTo(x, y);
        c.strokeStyle = 'white';
        c.lineWidth = 1;
        c.lineCap = 'round';
        c.shadowColor = 'rgba(255, 255, 255, 0.7)';
        c.shadowBlur = 1.5; // Add a glow effect
        c.stroke();

        // If we've reached the second star, move to the next star
        if (progress >= 1) {
            starIndex++;
            progress = 0; // Reset progress for the next line segment
        } else {
            progress += speed; // Increment progress
        }

        // Continue animating if there are more stars to connect
        if (starIndex < starData.length - 1) {
            requestAnimationFrame(drawLineStep);
        }
    }

    // Start the animation
    requestAnimationFrame(drawLineStep);
}


// Button to finish drawing
finishButton.addEventListener('click', () => {
    if (starData[starData.length - 1].colored === true) {
        animateLines();  // Call the function to animate the drawing of lines
    }
});
