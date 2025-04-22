import { Component, OnDestroy, OnInit } from '@angular/core';
import { SignalTriangulation } from '../../../../../capacitor-signal-triangulation';
@Component({
  selector: 'app-plugin-testing',
  templateUrl: './plugin-testing.page.html',
  styleUrls: ['./plugin-testing.page.scss'],
  standalone: false,
})
export class PluginTestingPage implements OnInit, OnDestroy {
  constructor() {}

  ngOnInit() {
    console.log({ SignalTriangulation });
  
  }

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

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                      WIFI                                      ||
  // ! ||--------------------------------------------------------------------------------||
  networks: any[] = [];
  async getWifiNetworks() {
    return [];
  }
  //   const res = await SignalTriangulation.getWifiNetworks()
  //   this.networks = res.networks || []
  //   console.log({res})
  // }

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                    BLUETOOTH                                   ||
  // ! ||--------------------------------------------------------------------------------||
  devices: any[] = [];
  async getBluetoothDevices() {
    return [];
  }
  // async getBluetoothDevices(){
  //   const res = await SignalTriangulation.getBluetoothDevices()
  //   this.devices = res.devices || []
  //   console.log({res})
  // }

  // ! ||--------------------------------------------------------------------------------||
  // ! ||                                  GLOBALSCANNER                                 ||
  // ! ||--------------------------------------------------------------------------------||
  isScanning: boolean = false;
  scanResult:any = {
    wifiScanResult: [],
    bluetoothScanResult: [],
    cellSignalResult: [],
    sensorData: [],
  }

  bluetoothCharts:any[] = [];
  bluetoothChartNames:any[] = []
  async toggleScan() {
    this.isScanning = !this.isScanning;
    if (!this.isScanning) {
      SignalTriangulation.removeAllListeners()
      const res = await SignalTriangulation.stopScan();
      this.scanResult = Object.assign({},this.pluginEventMap);
      let bluetoothMap :any = {}
      for(let result of this.scanResult.bluetoothScanResult){
        if(!bluetoothMap[result.address]){
          bluetoothMap[result.address]= []
        }
        bluetoothMap[result.address].push(result)
      }
      this.bluetoothCharts = [...Object.values(bluetoothMap)]
      this.bluetoothChartNames= [...Object.keys(bluetoothMap)]
      return res;
    } else {
      this.initListeners()
      const res = await SignalTriangulation.startScan();
    
      return res;
    }
  }

  parseResult(result:any){
    return JSON.stringify(result)
  }
}
