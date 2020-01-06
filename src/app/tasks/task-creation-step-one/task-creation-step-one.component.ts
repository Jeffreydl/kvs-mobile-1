import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-task-creation-step-one',
  templateUrl: './task-creation-step-one.component.html',
  styleUrls: ['./task-creation-step-one.component.scss']
})
export class TaskCreationStepOneComponent implements OnInit, OnDestroy {
  public formStepOne: FormGroup;
  @Output() taskType = new EventEmitter<string>();

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.formStepOne = this.formBuilder.group({
      taskType: this.formBuilder.control('', Validators.compose([Validators.required])),
    });
  }

  ngOnDestroy(): void {
  }

  public selectTaskType(type: string) {
    this.formStepOne.controls.taskType.setValue(type);
    this.taskType.emit(type);
  }
}
