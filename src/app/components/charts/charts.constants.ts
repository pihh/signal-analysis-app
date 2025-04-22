//import * as Plotly from 'plotly.js';
import Plotly from 'plotly.js-dist';
export interface BluetoothChartData {
  address: string;
  rssi: number;
}
export interface BluetoothChartSetup {
  x: number;
  y: number;
}

export const chartMap: any = {
  bluetooth: (data: BluetoothChartData[] = [],elementId="bluetooth") => {
    const x = data.map((d: any) => d.timestamp);
    const rssi = data.map((d: any) => d.rssi);
    Plotly.newPlot(
     elementId,
      [
        {
          y: rssi,
          x,
          type: 'scatter',
          mode: 'lines+markers',
          line: { shape: 'linear' },
        },
      ],
      {
        title: 'Bluetooth RSSI Signal',
      }
    );
  },
  wifi: (data: BluetoothChartData[] = [],elementId="chart") => {
    const x = data.map((d: any) => d.timestamp);
    const y = data.map((d: any) => d.level);
    Plotly.newPlot(
      elementId,
      [
        {
          y,
          x,
          type: 'scatter',
          mode: 'lines+markers',
          line: { shape: 'linear' },
        },
      ],
      {
        title: 'Bluetooth RSSI Signal',
      }
    );
  },
  light: (data: BluetoothChartData[] = [],elementId="chart") => {
    const x = data.map((d: any) => d.timestamp);
    const y = data.map((d: any) => d.value);
    Plotly.newPlot(
      elementId,
      [
        {
          y: y,
          x,
          type: 'scatter',
          mode: 'lines+markers',
          line: { shape: 'linear' },
        },
      ],
      {
        title: 'Light',
      }
    );
  },
  accelerometer: (data: BluetoothChartData[] = [],elementId="chart") => {
    const x = data.map((d: any) => d.timestamp);
    const y = data.map((d: any) => [d.x,d.y,d.z]);
    Plotly.newPlot(
      elementId,
      [
        {
          y: y,
          x,
          type: 'scatter',
          mode: 'lines+markers',
          line: { shape: 'linear' },
        },
      ],
      {
        title: 'Accelerometer',
      }
    );
  },
  magnetometer: (data: BluetoothChartData[] = [],elementId="chart") => {
    const x = data.map((d: any) => d.timestamp);
    const y = data.map((d: any) => [d.x,d.y,d.z]);
    Plotly.newPlot(
      elementId,
      [
        {
          y: y,
          x,
          type: 'scatter',
          mode: 'lines+markers',
          line: { shape: 'linear' },
        },
      ],
      {
        title: 'Magnetometer',
      }
    );
  },
 
};
