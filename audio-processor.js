// audio-processor.js
class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
    }

    process(inputs, outputs, parameters) {
        const input = inputs[0];
        const output = outputs[0];

        // Relay the audio input to output (pass-through example)
        for (let channel = 0; channel < input.length; channel++) {
            output[channel].set(input[channel]);
        }

        return true;
    }
}

// Register the AudioWorkletProcessor
registerProcessor('audio-processor', AudioProcessor);
