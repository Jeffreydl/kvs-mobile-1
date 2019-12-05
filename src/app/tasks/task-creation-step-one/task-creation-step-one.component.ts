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
    this.formStepOne = this.formBuilder.group({
      taskType: this.formBuilder.control('', Validators.compose([Validators.required])),
    });
  }

  ngOnInit() {
    // this.formStepOne = this.formBuilder.group({
    //   taskType: this.formBuilder.control('', Validators.compose([Validators.required])),
    // });
  }

  ngOnDestroy(): void {
  }

  public selectTaskType(type: string) {
    if (type === 'email') {
      this.formStepOne.controls.taskType.setValue('email');
    } else if (type === 'telefoon') {
      this.formStepOne.controls.taskType.setValue('telefoon');
    }
    this.selectType(type);

  }

  selectType(value: string) {
    this.taskType.emit(value);
  }

}
