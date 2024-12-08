// Get references to the buttons and status message div
const startButton = document.getElementById('startBtn');
const stopButton = document.getElementById('stopBtn');
const statusMessage = document.getElementById('statusMessage');

// Function to start recording
function startRecording() {
    statusMessage.textContent = "Recording Ongoing";  // Show the recording message
    statusMessage.style.color = "#f44336";  // Change the color to red to indicate recording
}

// Function to stop recording
function stopRecording() {
    statusMessage.textContent = "";  // Clear the status message
}

// Event listeners for start and stop buttons
startButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
