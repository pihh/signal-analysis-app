import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-train-status',
  templateUrl: './train-status.component.html',
  styleUrls: ['./train-status.component.scss'],
  standalone: false,
})
export class TrainStatusComponent implements OnInit {
  @Input('trainingInProgress') trainingInProgress: any = false;
  @Input('trainingStatus') trainingStatus: any = 'Idle';
  @Input('trainingAccuracy') trainingAccuracy: any = 0;
  @Input('trainingLoss') trainingLoss: any = 0;
  @Input('validationAccuracy') validationAccuracy: any = 0;
  @Input('validationLoss') validationLoss: any = 0;
  @Output() onStartTrain = new EventEmitter();
  @Output() onCancelTrain = new EventEmitter();
  constructor() {}

  ngOnInit() {}
  trainModel() {
    this.onStartTrain.emit();
  }
  cancelTraining() {
    this.onCancelTrain.emit();
  }
}
