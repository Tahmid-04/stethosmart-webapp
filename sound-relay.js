let audioContext;
let microphone;
let audioWorkletNode;
let gainNode;
let isStreaming = false;

// Function to load the AudioWorkletProcessor
async function setupAudioWorklet() {
    // Add the audio-processor.js module to the audio context
    await audioContext.audioWorklet.addModule('audio-processor.js');  // Make sure this path is correct!
}

// Start streaming function
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

        alert("Heart sound relaying started!");  // Notify the user
    } catch (error) {
        console.error("Error accessing the microphone: ", error);
    }
}

// Stop streaming function
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

    alert("Heart sound relaying stopped!");  // Notify the user
}

// Adding event listeners to buttons
document.getElementById('startBtn').addEventListener('click', startStream);
document.getElementById('stopBtn').addEventListener('click', stopStream);
