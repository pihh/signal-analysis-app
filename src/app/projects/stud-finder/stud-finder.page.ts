import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SensorStorageService } from 'src/app/services/sensor-storage.service';
import { SignalsService } from 'src/app/services/signals.service';
import * as tf from '@tensorflow/tfjs';
@Component({
  selector: 'app-stud-finder',
  templateUrl: './stud-finder.page.html',
  styleUrls: ['./stud-finder.page.scss'],
  standalone: false,
})
export class StudFinderPage implements AfterViewInit {
  @ViewChild('camera', { static: false }) camera!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay', { static: false })
  overlay!: ElementRef<HTMLCanvasElement>;

  aiConfidence: number = 0;

  constructor(
    private signalService: SignalsService,
    private sensorStorage: SensorStorageService
  ) {}
  async ngAfterViewInit() {
    await this.startCamera();
    this.setupOverlayCanvas();
    let readings =  await this.sensorStorage.getAllReadings()
    this.labelCounts.stud = readings.filter((reading)=>reading.label == "stud").length
    this.labelCounts.empty = readings.filter((reading)=>reading.label == "empty").length
  }

  currentLabel: 'stud' | 'empty' = 'empty';
  labelCounts = {
    stud: 0,
    empty: 0,
  };

  resetCounts() {
    this.labelCounts = { stud: 0, empty: 0 };
  }

  scanInterval: any;
  private sensorData: any = [];
  private scanFrequency: any = 100;
  async startScan() {
    this.signalService.scanCurrentWifi();
    this.signalService.startMagnetometer();
    this.scanInterval = setInterval(() => {
      this.logData();
    }, this.scanFrequency);
  }

  stopScan() {
    clearInterval(this.scanInterval);
    this.signalService.stop();
    this.scanInterval = null
  }

  isLikelyStud(data: any): boolean {
    const magZ = Math.abs(data.magnetometer.z);
    const rssi = data.rssi;
  
    // Customize thresholds based on tests
    const magThreshold = 70;
    const rssiDrop = rssi !== null && rssi < -70;
  
    return magZ > magThreshold || rssiDrop;
  }

  private async logData() {
    const label = this.currentLabel;
    const dataPoint = {
      magnetometer: this.signalService.lastReadings.magnetometer,
      rssi: this.signalService.lastReadings.wifi.level,
      position: this.signalService.lastReadings.accelerometer.position,
      accelerometer: this.signalService.lastReadings.accelerometer,
      label: label,
      timestamp: Date.now(),
    };

    this.sensorData.push(dataPoint);

    await this.sensorStorage.saveReading(dataPoint);
    // Update label count
    this.labelCounts[label]++;
    this.drawHeatmapPoint(dataPoint); // optional
  }

  async exportReadings() {
    const readings = await this.sensorStorage.getAllReadings();
    console.log('Exported data:', readings);

    const blob = new Blob([JSON.stringify(readings, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    window.open(url); // or trigger download
  }

  async clearReadings() {
    await this.sensorStorage.clearReadings();
    console.log('Readings cleared');
  }

  async startCamera() {
    try {
  

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      this.camera.nativeElement.srcObject = stream;
    } catch (err) {
      console.error('Error accessing camera', err);
    }
  }

  setupOverlayCanvas() {
    const canvas = this.overlay.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match video
    const resize = () => {
      canvas.width = this.camera.nativeElement.videoWidth;
      canvas.height = this.camera.nativeElement.videoHeight;
    };

    this.camera.nativeElement.onloadedmetadata = resize;

    // Example drawing
    setInterval(() => {
      resize();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Example: draw a red dot (placeholder for "detected stud")
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'red';
      ctx.fill();

      // Simulate AI confidence update
      this.aiConfidence = Math.floor(Math.random() * 100);
    }, 500);
  }

  async drawHeatmapPoint(data: any) {
    const canvas = this.overlay.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const model = await this.loadModel();  // Load the model once
  
    // Make prediction for the current data
    const isStud = await this.predictStud(data, model);
  
    const x = canvas.width / 2 + (data.position * 300); // scale
    const y = canvas.height / 2;
  
    const intensity = Math.min(1, Math.abs(data.magnetometer.z) / 100);
  
    // Draw base heat circle
    let color = 'rgba(0, 255, 0, 0.4)'; // empty = green
    if (isStud) color = 'rgba(255, 0, 0, 0.6)'; // stud = red
  
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  
    // Optionally, add auto-highlight with a stronger visual
    if (isStud) {
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.9)';
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
  
  
  
  clearHeatmap() {
    const canvas = this.overlay.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }


  // MACHINE LEARNING 
  trainingInProgress = false;
  trainingStatus = '';  // to display the progress
  trainingLoss: any[] = [];
  trainingAccuracy: any[] = [];
  validationLoss: any[] = [];
  validationAccuracy: any[] = [];
  


  async prepareTrainingData() {
    const readings = await this.sensorStorage.getAllReadings();
    const features = [];
    const labels = [];

    for (let data of readings) {
      const { magnetometer, rssi, position, label } = data;
      const feature = [
        Math.abs(magnetometer.x), 
        Math.abs(magnetometer.y),
        Math.abs(magnetometer.z),
        rssi ?? 0,
        position
      ];
      features.push(feature);
      labels.push(label === 'stud' ? 1 : 0); // 1 = stud, 0 = empty
    }
    return { features, labels };
  }

  // Fine-tuning: Training the model with callbacks and progress display
  async trainModel() {
    this.trainingInProgress = true;
    this.trainingStatus = 'Training in progress...';

    const { features, labels } = await this.prepareTrainingData();
    const xs = tf.tensor2d(features);
    const ys = tf.tensor1d(labels, 'int32');

    // Model architecture (can be expanded/changed based on testing)
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [xs.shape[1]] }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'binaryCrossentropy',
      metrics: ['accuracy']
    });

    const earlyStopping = tf.callbacks.earlyStopping({
      monitor: 'val_loss',
      patience: 5,
      restoreBestWeights: false
    });

    // Training the model and capturing history
    const history = await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: [earlyStopping]
    });


    // Setting up the callbacks to track training progress
    // const historyCallback = tf.callbacks.history();
    
    // // Training with early stopping and progress monitoring
    // const earlyStopping = tf.callbacks.earlyStopping({
    //   monitor: 'val_loss',
    //   patience: 5,
    //   restoreBestWeights: true
    // });

    await model.fit(xs, ys, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: [
        earlyStopping
      ]
    });

    // Store the trained model in localStorage for reuse
    await model.save('localstorage://stud-finder-model');

    // After training is done, update progress
    this.trainingStatus = 'Training completed!';
    this.trainingLoss = history.history['loss'];
    this.trainingAccuracy = history.history['acc'];
    this.validationLoss = history.history['val_loss'];
    this.validationAccuracy = history.history['val_acc'];
    // this.trainingLoss = historyCallback.history.loss;
    // this.trainingAccuracy = historyCallback.history.acc;
    // this.validationLoss = historyCallback.history.val_loss;
    // this.validationAccuracy = historyCallback.history.val_acc;
  }

  cancelTraining() {
    this.trainingInProgress = false;
    this.trainingStatus = 'Training canceled.';
  }

  // Method to load the trained model for inference
  async loadModel() {
    const model = await tf.loadLayersModel('localstorage://stud-finder-model');
    return model;
  }

  // Predict if the current reading is a stud
  async predictStud(data: any, model: tf.LayersModel): Promise<boolean> {
    const { magnetometer, rssi, position } = data;
    const features = [
      Math.abs(magnetometer.x),
      Math.abs(magnetometer.y),
      Math.abs(magnetometer.z),
      rssi ?? 0,
      position
    ];

    const input = tf.tensor2d([features]);
    const prediction = model.predict(input) as tf.Tensor;
    const predictionValue = prediction.dataSync()[0];

    return predictionValue > 0.5;
  }
}

/**
 * 
 * dd your sensor data feed (magnetometer, RSSI).

Visualize that on the canvas.

Train a model (or use basic threshold logic to start).


What You Have Now:
Position-aware sensor logger

Stored readings in IDB

Ready-to-train AI dataset
Fully offline, works on mobile or desktop


✅ What You’ve Got:
Real-Time Training Progress:

Updates every epoch with accuracy, loss, and validation metrics.

Progress bar to show training status.

Model Saved Locally:

After training is complete, the model is saved in localStorage.

Real-Time Predictions:

After training, you can use the trained model for predictions during the stud detection process.

🔜 Next Steps:
Evaluation: Evaluate the model performance on test data after training.

Improve Model: Experiment with deeper architectures or use more sensor data.

Model Deployment: Once the model is optimized, deploy it to mobile for real-time predictions.

Let me know how it goes, or if you'd like to adjust anything! Ready to test out the live training flow? 🚀
 */


/*
Model v2
async trainModel() {
  const { features, labels } = await this.prepareTrainingData();

  const xs = tf.tensor2d(features);
  const ys = tf.tensor1d(labels, 'int32');

  // Define a deeper model
  const model = tf.sequential();

  // Adding an extra hidden layer for more complex features
  model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [xs.shape[1]] }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

  model.compile({
    optimizer: tf.train.adam(0.001),  // You can experiment with the learning rate
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });

  // Train with more epochs
  await model.fit(xs, ys, {
    epochs: 50,  // Train for more epochs to capture the patterns
    batchSize: 32,
    validationSplit: 0.2  // Use 20% of data for validation during training
  });

  await model.save('localstorage://stud-finder-model');
  console.log('Model trained and saved!');
}



// LR Scheduler
const optimizer = tf.train.adam();
const learningRateScheduler = tf.callbacks.learningRateScheduler((epoch) => {
  // Reduce learning rate at each epoch (e.g., decay)
  return epoch < 10 ? 0.001 : 0.0005;  // Change learning rates as needed
});

await model.fit(xs, ys, {
  epochs: 50,
  batchSize: 32,
  validationSplit: 0.2,
  callbacks: [learningRateScheduler]
});


// DROPOUT
model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [xs.shape[1]] }));
model.add(tf.layers.dropout({ rate: 0.3 }));  // 30% dropout on this layer
model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));


// EARLY STOPPING
const earlyStopping = tf.callbacks.earlyStopping({
  monitor: 'val_loss',
  patience: 5,  // Stop after 5 epochs of no improvement
  restoreBestWeights: true,
});

await model.fit(xs, ys, {
  epochs: 50,
  batchSize: 32,
  validationSplit: 0.2,
  callbacks: [earlyStopping]
});

// MONITOR TRAIN
await model.fit(xs, ys, {
  epochs: 50,
  batchSize: 32,
  validationSplit: 0.2,
  callbacks: [
    tf.callbacks.earlyStopping({ monitor: 'val_loss', patience: 5 }),
    tf.callbacks.history() // Keeps track of accuracy/loss
  ]
});

// TEST
async testModel(model: tf.LayersModel) {
  const testData = await this.prepareTestData();  // New test data

  const xs = tf.tensor2d(testData.features);
  const predictions = model.predict(xs) as tf.Tensor;
  
  predictions.print(); // Print out the predictions for analysis
}


// EVAL 
const { features, labels } = await this.prepareTestData();
const xs = tf.tensor2d(features);
const ys = tf.tensor1d(labels, 'int32');

const results = model.evaluate(xs, ys);
console.log('Model Evaluation Results:', results);*/