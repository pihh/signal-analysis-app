import { Injectable } from '@angular/core';
import { SignalTriangulation } from '../../../../capacitor-signal-triangulation/dist/esm';

@Injectable({
  providedIn: 'root'
})
export class SignalsService {

  constructor() { }

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
          this.pluginEventMap[pluginEvent].push({...data,timestamp:Date.now()});
        }
      );
    }
  }

  lastReadings={
    magnetometer:{x:0,y:0,z:0},
    wifi:{level:0,frequency:0},
    accelerometer:{x:0,y:0,z:0,velocity:0,position:0}
  }

  magnetometerReadings = [];
  startMagnetometer(){
    this.magnetometerReadings = []
    SignalTriangulation.addListener('sensorData',
      (data: any) => {
        //{"type":"magnetometer","x":-17.418750762939453,"y":-9.131250381469727,"z":-35.83125305175781,"timestamp":1745342964502}
        if(data.type =="magnetometer") {

          const reading = {
            x: data.x,
            y: data.y,
            z: data.z,
       
          };
          
          console.log('Magnetometer:', reading);
          this.lastReadings.magnetometer = reading;
          
        }
    
        // Save it to array, or send to AI or canvas
        // this.logReading(reading);
      })
  }
  wifiReadings = [];
  scanCurrentWifi(){
    this.wifiReadings = [];

    SignalTriangulation.addListener('wifiScanResult',
      (data: any) => {
        // {"SSID":"MEO-220ED0","BSSID":"d8:78:7f:22:0e:d0","level":-66,"frequency":2437,"capabilities":"[WPA2-PSK-CCMP][RSN-PSK-CCMP][ESS][WPS][MFPC]","timestamp":1745342966732}
        if(data.SSID == "MEO-2200ED0"){

          const reading = {
            level:data.level,
            frequency:data.frequency,
          
          };
          
          console.log('Wifi:', reading);
          this.lastReadings.wifi = reading;
        }
        // Save it to array, or send to AI or canvas
        // this.logReading(reading);
      })
    // async getWiFiRSSI() {
    //   try {
    //     const networks = await WifiWizard2.scan();
    //     const target = networks.find((n: any) => n.SSID === 'YourSSID');
    //     if (target) {
    //       return target.level; // RSSI in dBm
    //     }
    //   } catch (err) {
    //     console.error('WiFi scan error:', err);
    //   }
    //   return null;
    // }
  }

  motionPosition = 0;
lastTimestamp = 0;
startMotionTracking() {
  // {"type":"accelerometer","x":-4.780859470367432,"y":4.240081787109375,"z":7.113861560821533,"timestamp":1745342964098}
  SignalTriangulation.addListener('sensorData', (data:any) => {
    if(data.type == "accelerometer"){

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
        x:data.x,
        y:data.y,
        z:data.z,
        position:this.motionPosition,
        velocity,

      }
      // Debug or log
      console.log('Position est:', this.motionPosition.toFixed(2), 'meters');
    }
      
      // Optionally use this to shift drawing X position
  });
}

  stop(){
    SignalTriangulation.removeAllListeners()
  }
}
