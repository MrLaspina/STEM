let model, webcam, labelContainer, maxPredictions;
let isRunning = false;

// Bin classification keywords for automatic sorting
const binClassifications = {
    recycling: ['plastic', 'bottle', 'can', 'aluminum', 'cardboard', 'paper', 'newspaper', 'metal', 'glass', 'jar', 'tin'],
    compost: ['food', 'apple', 'banana', 'orange', 'organic', 'vegetable', 'fruit', 'leaf', 'leaves', 'plant', 'grass'],
    landfill: ['ceramic', 'pottery', 'styrofoam', 'foam', 'trash', 'waste', 'broken', 'damaged']
};

// Load model from uploaded files
document.getElementById('load-btn').addEventListener('click', loadModel);

async function loadModel() {
    const modelFile = document.getElementById('model-file').files[0];
    const metadataFile = document.getElementById('metadata-file').files[0];
    const statusDiv = document.getElementById('status');

    if (!modelFile || !metadataFile) {
        statusDiv.textContent = '❌ Please select both model.json and metadata.json files';
        statusDiv.className = 'status error';
        return;
    }

    try {
        statusDiv.textContent = '⏳ Loading model...';
        statusDiv.className = 'status loading';

        // Create URLs for the files
        const modelURL = URL.createObjectURL(modelFile);
        const metadataURL = URL.createObjectURL(metadataFile);

        // Get the directory for loading files relative to the model
        const modelPath = modelURL.substring(0, modelURL.lastIndexOf('/') + 1);

        // Load the model
        model = await tmImage.loadFromFiles(modelFile, metadataFile);
        maxPredictions = model.getTotalClasses();

        statusDiv.textContent = '✅ Model loaded successfully!';
        statusDiv.className = 'status success';

        // Show the main section
        document.getElementById('main-section').style.display = 'grid';

        // Setup button listeners
        document.getElementById('start-btn').addEventListener('click', startCamera);
        document.getElementById('stop-btn').addEventListener('click', stopCamera);
    } catch (error) {
        console.error('Error loading model:', error);
        statusDiv.textContent = '❌ Error loading model: ' + error.message;
        statusDiv.className = 'status error';
    }
}

// Start the webcam
async function startCamera() {
    try {
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        
        isRunning = true;
        document.getElementById('start-btn').style.display = 'none';
        document.getElementById('stop-btn').style.display = 'block';

        // append webcam canvas to the DOM
        document.getElementById('webcam-container').innerHTML = '';
        document.getElementById('webcam-container').appendChild(webcam.canvas);

        // initialize label container
        labelContainer = document.getElementById('label-container');
        labelContainer.innerHTML = '';
        
        for (let i = 0; i < maxPredictions; i++) {
            const div = document.createElement('div');
            div.className = 'prediction';
            labelContainer.appendChild(div);
        }

        // start the detection loop
        window.requestAnimationFrame(loop);
    } catch (error) {
        console.error('Error accessing webcam:', error);
        alert('Error accessing webcam: ' + error.message);
    }
}

// Stop the webcam
function stopCamera() {
    isRunning = false;
    if (webcam) {
        webcam.stop();
    }
    document.getElementById('start-btn').style.display = 'block';
    document.getElementById('stop-btn').style.display = 'none';
    document.getElementById('webcam-container').innerHTML = '';
    document.getElementById('label-container').innerHTML = '';
    document.getElementById('bin-recommendation').innerHTML = '';
}

// Main detection loop
async function loop() {
    if (isRunning) {
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }
}

// Run prediction on webcam image
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    
    // Find the class with the highest confidence
    let highestConfidence = 0;
    let highestIndex = 0;
    let highestClass = '';

    // Display all predictions
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i];
        const confidence = classPrediction.probability.toFixed(4);

        // Update prediction display
        const predictionDiv = labelContainer.childNodes[i];
        predictionDiv.innerHTML = `
            <span class="prediction-label">${classPrediction.className}</span>
            <span class="prediction-value">${(confidence * 100).toFixed(1)}%</span>
        `;

        // Track highest confidence
        if (classPrediction.probability > highestConfidence) {
            highestConfidence = classPrediction.probability;
            highestIndex = i;
            highestClass = classPrediction.className;
        }
    }

    // Only show bin recommendation if confidence is above 60%
    if (highestConfidence > 0.6) {
        showBinRecommendation(highestClass, highestConfidence);
    } else {
        document.getElementById('bin-recommendation').classList.remove('show');
    }
}

// Show which bin the detected object should go into
function showBinRecommendation(className, confidence) {
    const binRecommendation = document.getElementById('bin-recommendation');
    const lowerClass = className.toLowerCase();

    let bin = 'landfill'; // default
    let binEmoji = '🗑️';
    let binLabel = 'Landfill Bin';

    // Check classification keywords
    for (const [binType, keywords] of Object.entries(binClassifications)) {
        if (keywords.some(keyword => lowerClass.includes(keyword))) {
            bin = binType;
            break;
        }
    }

    // Set emoji and label based on bin type
    if (bin === 'recycling') {
        binEmoji = '♻️';
        binLabel = 'Recycling Bin';
    } else if (bin === 'compost') {
        binEmoji = '🌱';
        binLabel = 'Compost Bin';
    }

    binRecommendation.innerHTML = `
        <strong>${binEmoji} This belongs in the ${binLabel}</strong><br>
        <small>Confidence: ${(confidence * 100).toFixed(1)}%</small>
    `;
    binRecommendation.className = `bin-recommendation show ${bin}`;
}
