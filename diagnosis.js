document.getElementById('classifyBtn').addEventListener('click', startRecording);

function startRecording() {
  // Disable the button to prevent multiple clicks
  const button = document.getElementById('classifyBtn');
  button.disabled = true;
  
  // Display a status message that recording has started
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.textContent = "Recording...";

  // Use the MediaRecorder API to record sound for 5 seconds
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        // After recording stops, introduce a 1.5-second delay before showing the result
        setTimeout(() => {
          generateResult();
        }, 1500);  // 1.5 seconds delay

        // Enable the button again
        button.disabled = false;
      };

      // Start recording
      mediaRecorder.start();

      // Stop recording after 5 seconds
      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);
    })
    .catch(error => {
      console.error("Error accessing the microphone: ", error);
      statusMessage.textContent = "Error: Unable to access microphone.";
      button.disabled = false;
    });
}

function generateResult() {
  // Generate a random result with a higher probability of "normal"
  const result = Math.random() < 0.80 ? "The sound is normal" : "The sound is abnormal";

  // Display the result
  const statusMessage = document.getElementById('statusMessage');
  statusMessage.textContent = result;
}
