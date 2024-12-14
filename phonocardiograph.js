document.addEventListener('DOMContentLoaded', function () {
    // Get the canvas context where the graph will be plotted
    const ctx = document.getElementById('phonocardiographGraph').getContext('2d');
    
    let graphInstance;  // To hold the Chart.js instance

    // Function to generate a sine wave data
    function generateSineWave() {
        const samples = 100;  // Number of points in the sine wave
        const data = [];
        const labels = [];

        for (let i = 0; i < samples; i++) {
            const x = i / (samples - 1) * 2 * Math.PI; // X values from 0 to 2π
            const y = Math.sin(x); // Sine function for Y values
            data.push(y);
            labels.push(i); // Use index for X-axis labels (can be time or sample points)
        }

        return { data, labels };
    }

    // Start button functionality
    document.getElementById('startGraphBtn').addEventListener('click', function () {
        // Generate sine wave data
        const { data, labels } = generateSineWave();

        // Plot the graph using Chart.js
        graphInstance = new Chart(ctx, {
            type: 'line',  // Line chart
            data: {
                labels: labels,  // X-axis labels (time or sample points)
                datasets: [{
                    label: 'Heart Sound (Sine Wave)',
                    data: data,  // Y-axis data (sine wave)
                    borderColor: 'rgb(75, 192, 192)',  // Line color
                    fill: false  // Don't fill the area under the curve
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { 
                        title: { display: true, text: 'Time (s)' }
                    },
                    y: { 
                        title: { display: true, text: 'Amplitude' },
                        min: -1.5, // To ensure the graph is centered
                        max: 1.5   // Max amplitude for sine wave
                    }
                }
            }
        });
    });

    // Stop button functionality
    document.getElementById('stopGraphBtn').addEventListener('click', function () {
        if (graphInstance) {
            graphInstance.destroy();  // Destroy the current graph
        }
    });
});
