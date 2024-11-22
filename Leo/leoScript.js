
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const colorPickerMain = document.querySelector('.color-picker-main');
const colorOptions = document.querySelectorAll('.color-option');
const style = document.createElement('style');

const popUp = document.getElementById('popUpBt');
const saveButton = document.getElementById('saveButton');
const ideaText = document.getElementById('ideaText');
const textAreaStuff = document.querySelector("textarea");
const moveBt = document.querySelector('.drag');

const icon = document.querySelector('.icon');
const ideaIcon = document.querySelector('.ideaIcon');
const closeBt = document.querySelector(".closebtn");
const closeBtTwo = document.querySelector(".closebtn2");
const finishButton = document.getElementById('finishButton');


let selectedColor = '#C8B6FF';
const starRadius = 15;
let isExpanded = false;

let isPopUpClosed = true;

let currentStarIndex = JSON.parse(localStorage.getItem("Index")) || null;
let myArray = JSON.parse(localStorage.getItem("starArray"));
let ideaObj = [];

let offsetX, offsetY, pos1, pos2;

// Define all the star coordinates and sizes
const starData = [
    { cx: 415, cy: 35, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null, },
    { cx: 370, cy: 100, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 395, cy: 165, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 300, cy: 360, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 215, cy: 490, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 115, cy: 620, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 230, cy: 568, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 300, cy: 560, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 445, cy: 525, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 517, cy: 535, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 790, cy: 543, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 893, cy: 570, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 960, cy: 550, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 1025, cy: 610, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 970, cy: 660, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null },
    { cx: 892, cy: 657, spikes: 5, outerRadius: starRadius, colored: false, whatColor: null }
];

// Function to create stars
function drawStar(cx, cy, spikes, outerRadius, color) {
    let currentColor = color;
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
    c.fillStyle = currentColor;
    c.fill();  // Fill the star
}


// Class for Star Info
class starInfoSet {
    constructor(color, text) {
        this.color = color;
        this.text = text;
    }
}


// Code Segment For Color Options
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

colorOptions.forEach((option) => {
    option.addEventListener('click', (e) => {
        selectedColor = e.target.style.backgroundColor;  // Set selected color
        colorPickerMain.style.backgroundColor = selectedColor;  // Change main button color
    });
});


// Draw random stars
for (i = 0; i < 50; i++) {
    const randStarSize = Math.round(Math.random() * 4) + 2;
    const randStarCx = Math.round(Math.random() * 1300);
    const randStarCy = Math.round(Math.random() * 700);
    // C8B6FF F5FEFD - white
    drawStar(randStarCx, randStarCy, 5, randStarSize, "#C8B6FF");
}
// Draw the initial stars in gray
function grayStars() {

    let myArray = JSON.parse(localStorage.getItem("starArray"));

    let count = 0;

    // Check if the array exists and the index is within bounds
    if (myArray && Array.isArray(myArray)) {

        for(let i = 0; i < myArray.length; i++) {
            starData[i].colored = true;
            starData[i].whatColor = myArray[i].color;
            const currentStar = starData[i];
            drawStar(currentStar.cx, currentStar.cy, currentStar.spikes, currentStar.outerRadius, myArray[i].color);
            count++;
        }
    }
    
    for (let i = count; i < starData.length; i++) {
        const currentStar = starData[i];
        drawStar(currentStar.cx, currentStar.cy, currentStar.spikes, currentStar.outerRadius, 'gray');
    }
}

grayStars();


// Code Segment For Clicking Stars
canvas.addEventListener('click', function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // Adjust X to canvas space
    const y = event.clientY - rect.top;  // Adjust Y to canvas space

    for (let i = 0; i < starData.length; i++) {
        const currentStar = starData[i];
        const distance = Math.sqrt((x - currentStar.cx) ** 2 + (y - currentStar.cy) ** 2);

        // Check if the click was within the radius of the star
        if (distance <= currentStar.outerRadius) {
            if ((i === 0 || starData[i - 1].colored === true) && isPopUpClosed) {

                // Clear the old star before drawing the new one
                c.clearRect(currentStar.cx - currentStar.outerRadius, currentStar.cy - currentStar.outerRadius,
                    currentStar.outerRadius * 2, currentStar.outerRadius * 2);

                // Set the star to colored and update its color
                starData[i].colored = true;
                starData[i].whatColor = selectedColor
                drawStar(currentStar.cx, currentStar.cy, currentStar.spikes, currentStar.outerRadius, selectedColor);

                loadData(i);
                changeHTML(selectedColor);

                popUp.classList.add('show');
                isPopUpClosed = false;

                currentStarIndex = i;

                break;  // Stop checking after a valid star is clicked
            }
        }
    }
});


// Code Segment For Animating Stars
function lerp(start, end, t) {
    return start + (end - start) * t;
}

function animateLines() {
    let starIndex = 0;  // Start from the first star
    let progress = 0;   // Progress of the animation (0 to 1)
    const speed = 0.07; // Animation speed (adjust this value as needed)

    function drawLineStep() {
        // Define the two stars we're connecting
        const star1 = starData[starIndex];
        const star2 = starData[starIndex + 1];

        // Interpolate between the two stars based on progress
        const x = lerp(star1.cx, star2.cx, progress);
        const y = lerp(star1.cy, star2.cy, progress);

        // Redraw all the stars first to ensure they remain on the canvas
        starData.forEach(star => {
            drawStar(star.cx, star.cy, star.spikes, star.outerRadius, star.whatColor);
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


// Code Segment For Finish Button
finishButton.addEventListener('click', () => {
    if (starData[starData.length - 1].colored === true) {
        animateLines();  // Call the function to animate the drawing of lines
    }
});


// Code Segement For Navigation Bar
icon.addEventListener('click', () => {
    document.getElementById("mySidenav").style.width = "200px";
});
closeBt.addEventListener('click', () => {
    document.getElementById("mySidenav").style.width = "0";
})


// Code Segement For Idea Navigation Bar
ideaIcon.addEventListener('click', () => {
    document.getElementById("myIdeaNav").style.width = "250px";
})
closeBtTwo.addEventListener('click', () => {
    document.getElementById("myIdeaNav").style.width = "0";
})

// Code Segment For Drag Button
function onMouseMove(event) {
    // Update the pop-up position based on the initial offset
    pos1 = offsetX - event.clientX;
    pos2 = offsetY - event.clientY;
    offsetX = event.clientX;
    offsetY = event.clientY;
    popUp.style.left = (popUp.offsetLeft - pos1) + "px";
    popUp.style.top = (popUp.offsetTop - pos2) + "px";
}
    // Function to end drag on mouseup
function onMouseUp() {
    // Remove the mousemove and mouseup events when dragging stops
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}
    // Mouse down event to initiate drag
moveBt.addEventListener('mousedown', (event) => {
    // Prevent text selection during drag
    event.preventDefault();

    // Calculate the offset between the mouse position and the pop-up's top-left corner
    offsetX = event.clientX;
    offsetY = event.clientY;

    // Add the mousemove event to the document to drag the pop-up
    document.addEventListener('mousemove', onMouseMove);

    // Remove dragging on mouseup
    document.addEventListener('mouseup', onMouseUp);
});
    // Mouse moving away
canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left; // Adjust X to canvas space
    const y = event.clientY - rect.top;  // Adjust Y to canvas space

    let isHoveringOverStar = false;

    for (let i = 0; i < starData.length; i++) {
        const tempStar = starData[i];
        const distance = Math.sqrt((x - tempStar.cx) ** 2 + (y - tempStar.cy) ** 2);

        if (distance <= tempStar.outerRadius) {
            // If within the star's radius, set the flag and break out of the loop
            isHoveringOverStar = true;
            break;
        }
    }

    // Change the cursor based on whether it's over a star
    canvas.style.cursor = isHoveringOverStar ? "pointer" : "default";
});


// Code Segment For Loading Data
function loadData(index) {
    // Check if the array exists and the index is within bounds
    if (myArray && Array.isArray(myArray) && index < myArray.length) {
        let currentInfo = myArray[index].text;
        
        // If currentInfo is defined, set it; otherwise, leave placeholder
        ideaText.value = currentInfo ?? ideaText.placeholder;
    }
}

// Code Segment For Save Button
saveButton.addEventListener('click', () => {
    if (myArray && Array.isArray(myArray)) {
        ideaObj = myArray;
    }
    ideaObj[currentStarIndex] = new starInfoSet(selectedColor, ideaText.value);
    
    // Save the idea in localStorage with the currentStarIndex as the key
    localStorage.setItem("starArray", JSON.stringify(ideaObj));
    localStorage.setItem("Index", JSON.stringify(currentStarIndex));
    
    // Clear the textarea
    ideaText.value = '';
    
    // Hide the pop-up after saving
    popUp.classList.remove('show');

    isPopUpClosed = true;

    // Re-render the idea containers with the updated ideas
    renderIdeas();
});


function renderIdeas() {
    const ideaContainers = document.querySelector('.ideaContainers');
    ideaContainers.innerHTML = ''; // Clear existing content to avoid duplication

    if (myArray && Array.isArray(myArray)) {
        myArray.forEach((starInfo, index) => {
            if (starInfo) {
                // Create a new idea box dynamically
                const ideaBox = document.createElement('div');
                ideaBox.className = 'idea';
                ideaBox.innerHTML = `
                    <div style="color: ${starInfo.color || 'black'}">
                        <p>${starInfo.text || 'No text provided'}</p>
                    </div>
                `;
                
                // Add click event listener
                ideaBox.addEventListener('click', () => {
                    handleIdeaClick(starInfo, index); // Pass data to the handler
                });

                ideaContainers.appendChild(ideaBox);
            }
        });
    }
}

function handleIdeaClick(starInfo, index) {
    loadData(index);
    popUp.classList.add('show');
}

// Initial rendering of ideas when page loads
renderIdeas();

function changeHTML(color) {
    saveButton.style.backgroundColor = color;
    style.innerHTML = `
        #ideaText::placeholder {
        color: ${color};
    }`;

    document.head.appendChild(style);
    moveBt.style.fill = color;
    textAreaStuff.style.color = color;
}