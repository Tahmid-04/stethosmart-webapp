let audioContext;
let microphone;
let audioWorkletNode;
let gainNode;
let isStreaming = false;
let mediaRecorder;
let audioChunks = [];

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusMessage = document.getElementById('statusMessage'); // Status message div

startBtn.addEventListener('click', startStream);
stopBtn.addEventListener('click', stopStream);

// Function to load the AudioWorkletProcessor
async function setupAudioWorklet() {
  await audioContext.audioWorklet.addModule('audio-processor.js');  // Make sure this path is correct!
}

// Function to start recording
function startRecording(stream) {
  audioChunks = [];  // Clear previous audio chunks

  mediaRecorder = new MediaRecorder(stream);  // Initialize the MediaRecorder

  // Capture audio data as it's recorded
  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);  // Push data into chunks
  };

  // When recording stops, save the audio as a file
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);

    // Prompt user to enter a filename
    const filename = prompt("Enter the filename for your recording:", "heart_sound_recording.wav");
    const safeFilename = filename && filename.trim() !== "" ? filename : "heart_sound_recording.wav";

    // Create a temporary download link and click it to download the file
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = safeFilename;
    a.click();
  };

  mediaRecorder.start();  // Start recording
  console.log('Recording started');
}

// Start streaming and recording
async function startStream() {
  if (isStreaming) return;  // Don't start again if already streaming

  isStreaming = true;
  audioContext = new (window.AudioContext || window.webkitAudioContext)();  // Create an AudioContext

  // Resume the AudioContext if suspended (important for mobile devices)
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }

  try {
    // Get permission to use the user's microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    microphone = audioContext.createMediaStreamSource(stream);  // Get the microphone input

    // Set up the AudioWorklet
    await setupAudioWorklet();

    // Create the AudioWorkletNode
    audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');  // 'audio-processor' matches the name we used in the registration

    // Create a GainNode to control the volume
    gainNode = audioContext.createGain();
    gainNode.gain.value = 2;  // Amplify the audio signal (adjust as needed)

    // Connect the microphone to the AudioWorkletNode
    microphone.connect(audioWorkletNode);

    // Connect the AudioWorkletNode to the GainNode
    audioWorkletNode.connect(gainNode);

    // Connect the GainNode to the audio output (speakers)
    gainNode.connect(audioContext.destination);

    // Start recording in parallel
    startRecording(stream);

    // Show the status message
    statusMessage.textContent = "Recording in progress...";

    // Disable the start button and enable the stop button
    startBtn.disabled = true;
    stopBtn.disabled = false;

    alert("Recording and Heart sound relaying started!");  // Notify the user
  } catch (error) {
    console.error("Error accessing the microphone: ", error);
    alert("Failed to start streaming and recording. Please ensure the microphone is available.");
  }
}

// Stop streaming and recording
function stopStream() {
  if (!isStreaming) return;  // Don't stop if not streaming

  isStreaming = false;

  // Disconnect the microphone and audio worklet node to stop the stream
  if (microphone) {
    microphone.disconnect();
  }

  if (gainNode) {
    gainNode.disconnect();
  }

  if (audioWorkletNode) {
    audioWorkletNode.disconnect();
  }

  // Stop recording
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();  // Stop recording
  }

  // Hide the status message
  statusMessage.textContent = "";

  // Disable the stop button and enable the start button for a new recording
  stopBtn.disabled = true;
  startBtn.disabled = false;

  alert("Recording and Heart sound relaying stopped!");  // Notify the user
}
