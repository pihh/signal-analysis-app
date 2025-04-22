import { Component, Input, OnInit } from '@angular/core';
import { chartMap } from './charts.constants';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  standalone:false
})
export class ChartsComponent  implements OnInit {
  @Input('type')type:string =""
  @Input('data')data:any = []
  @Input('elementId') elementId:string = "chart"
  constructor() { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.renderChart();
   
  }

  renderChart(){
    chartMap[this.type](this.data,this.elementId)
  }
  

}

/*

renderChart1() {
  const data = [{"address":"16:9E:D2:CC:66:D4","rssi":-49}];
  Plotly.newPlot('chart1', [{
    x: [data[0].address],
    y: [data[0].rssi],
    type: 'bar'
  }], {
    title: 'Bluetooth RSSI Signal'
  });
}

renderChart2() {
  const data = [{"type":"GSM","signalStrength":-91}];
  Plotly.newPlot('chart2', [{
    x: [data[0].type],
    y: [data[0].signalStrength],
    type: 'bar'
  }], {
    title: 'GSM Signal Strength'
  });
}

renderChart3() {
  const data = [{"type":"accelerometer","x":-0.09,"y":0.24,"z":9.92}];
  Plotly.newPlot('chart3', [{
    x: ['x', 'y', 'z'],
    y: [data[0].x, data[0].y, data[0].z],
    type: 'bar'
  }], {
    title: 'Accelerometer Readings'
  });
}

renderChart4() {
  const data = [{"type":"light","value":201.02}];
  Plotly.newPlot('chart4', [{
    values: [data[0].value, 1000 - data[0].value],
    labels: ['Light', 'Remaining'],
    type: 'pie'
  }], {
    title: 'Light Sensor Value'
  });
}

renderChart5() {
  const data = [{"SSID":"9qLTdRw4gVaBFhS1lHYtuxrUUzlCQ2jZ","BSSID":"58:b5:68:5f:8f:48","level":-84,"frequency":2437}];
  Plotly.newPlot('chart5', [{
    x: ['Signal Level', 'Frequency'],
    y: [data[0].level, data[0].frequency],
    type: 'bar'
  }], {
    title: `WiFi Info: ${data[0].SSID}`
  });
}
*/