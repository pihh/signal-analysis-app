import { Injectable } from '@angular/core';
import { SignalTriangulation } from '../../../../capacitor-signal-triangulation/dist/esm';

@Injectable({
  providedIn: 'root',
})
export class SignalsService {
  constructor() {}

  ngOnDestroy() {
    SignalTriangulation.removeAllListeners();
  }

  pluginEvents = [
    'wifiScanResult',
    'bluetoothScanResult',
    'cellSignalResult',
    'sensorData',
  ];
  pluginEventMap = {
    wifiScanResult: [],
    bluetoothScanResult: [],
    cellSignalResult: [],
    sensorData: [],
  };

  initListeners() {
    for (let pluginEvent of this.pluginEvents) {
      SignalTriangulation.addListener(
        pluginEvent as
          | 'wifiScanResult'
          | 'bluetoothScanResult'
          | 'cellSignalResult'
          | 'sensorData',
        (data: any) => {
          this.pluginEventMap[pluginEvent].push({
            ...data,
            timestamp: Date.now(),
          });
        }
      );
    }
  }


  lastReadings = {
    magnetometer: null,//{ x: 0, y: 0, z: 0 },
    wifi: null,//{ level: 0, frequency: 0 },
    accelerometer:null // { x: 0, y: 0, z: 0, velocity: 0, position: 0 },
  };

  motionPosition = 0;
  lastTimestamp = 0;
  
  wifiReadings = [];
  magnetometerReadings = [];
  startStudFinder(onDataCollectedFn:any){
    this.wifiReadings = [];
    this.magnetometerReadings = [];
    const broadCast = ()=>{
      console.log(this.lastReadings.wifi == null , this.lastReadings.accelerometer == null , this.lastReadings.magnetometer == null)
      if (this.lastReadings.wifi && this.lastReadings.accelerometer && this.lastReadings.magnetometer){
        console.log('will broadcast')
     
        const data = Object.assign({},this.lastReadings);
        this.lastReadings = {
          wifi:null,
          accelerometer:null,
          magnetometer:null
        }
        onDataCollectedFn(data)
        // SignalTriangulation.
      }
    }

    SignalTriangulation.addListener('wifiRssiUpdate',(data:any)=>{
      console.log('RSSI UPDATE ', data)
      this.lastReadings.wifi = {rssi:data.rssi,level:data.rssi};
        broadCast()
    })

 
    SignalTriangulation.addListener('sensorData', (data: any) => {

      if (data.type == 'accelerometer') {
        
        const now = Date.now();
        const dt = this.lastTimestamp ? (now - this.lastTimestamp) / 1000 : 0;
        this.lastTimestamp = now;

        const ax = data.x ?? 0;
        const ay = data.y ?? 0;
        const az = data.z ?? 0;

        // Estimate horizontal distance moved (very simplified)
        const velocity = ax * dt;
        const dx = velocity * dt; // s = v*t (assumes linear)
        this.motionPosition += dx;

        this.lastReadings.accelerometer = {
          x: data.x,
          y: data.y,
          z: data.z,
          position: this.motionPosition,
          velocity,
        };
        // Debug or log
   
        broadCast()
      }

      if (data.type == 'magnetometer') {
        const reading = {
          x: data.x,
          y: data.y,
          z: data.z,
        };

     
        this.lastReadings.magnetometer = reading;
        broadCast()
      }

      // Optionally use this to shift drawing X position
    });

    
 
  }


  async start() {
   
    await SignalTriangulation.startScan();
  }
  stop() {

    SignalTriangulation.stopScan()
    SignalTriangulation.removeAllListeners();
    SignalTriangulation.startWifiRssiMonitor()
  }
}
