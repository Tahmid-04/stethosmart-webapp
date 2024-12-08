
// Get references to the button and status message
const sendButton = document.getElementById('sendBtn');
const statusMessage = document.getElementById('statusMessage');

// Function to simulate sending heart sound data
function sendHeartSoundData() {
    statusMessage.textContent = "Sending Heart Sound Data...";  // Show the sending message
    statusMessage.style.color = "#4CAF50";  // Change the color to green to indicate success
}

// Event listener for the send button
sendButton.addEventListener('click', sendHeartSoundData);
