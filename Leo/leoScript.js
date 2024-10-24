const colorPickerMain = document.querySelector('.color-picker-main');
const colorOptions = document.querySelectorAll('.color-option');

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

let selectedColor = 'black';  // Default color
let isExpanded = false;  // Tracks whether the color options are visible

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
    c.fillStyle = 'rgb(128, 128, 128)';
    c.fill();  // Fill the star
}


drawStar(415, 35, 5, 10); //Top Star
drawStar(370, 100, 5, 10); // Number 2
drawStar(395, 165, 5, 10); // Number 3
drawStar(405, 240, 5, 10); // Number 4
drawStar(300, 360, 5, 10); // Number 5
drawStar(215, 490, 5, 10); // Number 6 